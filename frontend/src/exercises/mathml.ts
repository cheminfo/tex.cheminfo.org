import { renderToMathML } from '../shared/mathjax.ts';

/**
 * Whether two formulas render to the same thing, however they are written.
 * This is what marks an exercise: a student writing `x^{2}` has answered an
 * exercise whose solution is `x^2`, and `\int_0^1 x^2\,dx` is the same answer
 * as `\int_{0}^{1} x^{2} dx`.
 * @param answer - The formula the student wrote.
 * @param solution - The formula to reproduce.
 * @returns True when both compile to the same MathML.
 */
export function rendersTheSame(answer: string, solution: string): boolean {
  return canonicalize(answer) === canonicalize(solution);
}

/**
 * The canonical form of a formula: its MathML, stripped of everything that
 * does not change what is on the page.
 * @param tex - The LaTeX formula.
 * @returns A string that is equal for two formulas rendering alike.
 */
export function canonicalize(tex: string): string {
  return serialize(parseMathML(renderToMathML(tex)));
}

/**
 * What MathJax could not make sense of in a formula.
 * MathJax never throws on bad input: it renders the offending source inside a
 * `merror`, or in red when a command is unknown, so the complaint has to be
 * read back out of the MathML.
 * @param tex - The LaTeX formula.
 * @returns The first complaint, or null when the formula compiles.
 */
export function compileError(tex: string): string | null {
  const mathml = renderToMathML(tex);
  const failed = /data-mjx-error="(?<message>[^"]*)"/u.exec(mathml);
  if (failed?.groups?.message) return decodeEntities(failed.groups.message);
  const unknown = /<mtext mathcolor="red">(?<command>[^<]*)<\/mtext>/u.exec(
    mathml,
  );
  if (unknown?.groups?.command) {
    return `Unknown command ${decodeEntities(unknown.groups.command)}`;
  }
  return null;
}

interface MmlNode {
  name: string;
  /** The text of a leaf; empty for an element carrying children. */
  text: string;
  children: MmlNode[];
}

/** Invisible in the output, so it never distinguishes two answers. */
const DROPPED = new Set(['mspace', 'mphantom']);

/** Carries no meaning of its own once its attributes are gone. */
const TRANSPARENT = new Set(['math', 'mstyle', 'mpadded', 'semantics']);

const TOKEN = /<[^>]+>|[^<]+/g;

function parseMathML(mathml: string): MmlNode {
  const root: MmlNode = { name: '#root', text: '', children: [] };
  const stack: MmlNode[] = [root];
  for (const token of mathml.match(TOKEN) ?? []) {
    const parent = stack.at(-1);
    if (parent === undefined) break;
    if (!token.startsWith('<')) {
      const text = decodeEntities(token).replaceAll(/\s+/gu, ' ').trim();
      if (text) parent.children.push({ name: '#text', text, children: [] });
    } else if (token.startsWith('</')) {
      if (stack.length > 1) stack.pop();
    } else {
      const name = token.slice(1).split(/[\s/>]/u, 1)[0] ?? '';
      const node: MmlNode = { name, text: '', children: [] };
      parent.children.push(node);
      if (!token.endsWith('/>')) stack.push(node);
    }
  }
  return root;
}

function serialize(node: MmlNode): string {
  if (node.name === '#text') return `"${node.text}"`;
  const children: string[] = [];
  for (const child of node.children) {
    if (DROPPED.has(child.name)) continue;
    const serialized = serialize(child);
    // A wrapper holding nothing visible — `\,` inside its mstyle — is nothing.
    if (serialized) children.push(serialized);
  }
  const body = children.join(',');
  if (TRANSPARENT.has(node.name) || node.name === '#root') return body;
  // A group of one is the group's only child: `x^{2}` is `x^2`.
  if (node.name === 'mrow' && children.length === 1) return body;
  return `${node.name}(${body})`;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(text: string): string {
  return text.replaceAll(
    /&(?<entity>#x[\da-f]+|#\d+|[a-z]+);/giu,
    (match, entity) => {
      const body = String(entity);
      if (body.startsWith('#x') || body.startsWith('#X')) {
        return String.fromCodePoint(Number.parseInt(body.slice(2), 16));
      }
      if (body.startsWith('#')) {
        return String.fromCodePoint(Number.parseInt(body.slice(1), 10));
      }
      return NAMED_ENTITIES[body.toLowerCase()] ?? match;
    },
  );
}
