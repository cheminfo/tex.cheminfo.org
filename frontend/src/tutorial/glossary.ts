export interface GlossaryExample {
  tex: string;
  /** What this example demonstrates. @default undefined */
  note?: string;
}

export interface GlossaryEntry {
  title: string;
  /** One short paragraph. */
  summary: string;
  examples: GlossaryExample[];
}

/** Keyed by the lowercased text inside a `[[marker]]`. */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  variable: {
    title: 'Variable',
    summary:
      'A single letter standing for a quantity. It is set in italic, which is how a reader tells it from a function name or a unit.',
    examples: [
      { tex: 'v = d/t', note: 'three variables, all italic' },
      {
        tex: String.raw`\mathrm{d} \neq d`,
        note: 'upright d for a differential, italic d for a distance',
      },
    ],
  },
  command: {
    title: 'Command',
    summary:
      'A backslash followed by letters. It ends at the first character that is not a letter, and may take arguments in braces.',
    examples: [
      { tex: String.raw`\alpha\beta`, note: 'two commands, no space needed' },
      { tex: String.raw`\frac{1}{2}`, note: 'a command with two arguments' },
    ],
  },
  argument: {
    title: 'Argument',
    summary:
      'What a command is applied to, written in braces. A single character may be written without them, which is why some formulas look as if the braces were optional.',
    examples: [
      { tex: String.raw`\sqrt x = \sqrt{x}`, note: 'the same formula' },
      {
        tex: String.raw`\sqrt xy \neq \sqrt{xy}`,
        note: 'without braces only the x is under the root',
      },
    ],
  },
  'optional argument': {
    title: 'Optional argument',
    summary:
      'An option in square brackets, written before the braces. Only a few commands take one.',
    examples: [
      { tex: String.raw`\sqrt[3]{8} = 2`, note: 'the order of the root' },
    ],
  },
  group: {
    title: 'Group',
    summary:
      'Braces turn any run of characters into a single item, and are never printed. Anywhere LaTeX expects one item, a group counts as one.',
    examples: [
      { tex: '10^{23}', note: 'the whole 23 goes up' },
      { tex: '10^23', note: 'only the 2 goes up' },
    ],
  },
  superscript: {
    title: 'Superscript',
    summary:
      'Written with a caret. It takes exactly one item, so more than one character must be a group.',
    examples: [
      { tex: String.raw`e^{i\pi} + 1 = 0`, note: 'a grouped exponent' },
      { tex: String.raw`\ce{SO4^2-}`, note: String.raw`a charge, inside \ce` },
    ],
  },
  subscript: {
    title: 'Subscript',
    summary:
      'Written with an underscore, and identical to a superscript in every other way. Both may sit on the same symbol, in either order.',
    examples: [
      { tex: String.raw`a_1, a_2, \ldots, a_n`, note: 'indices of a sequence' },
      { tex: 'x_i^2', note: 'an index and a power together' },
    ],
  },
  'big operator': {
    title: 'Big operator',
    summary:
      'A symbol that grows and carries bounds: sum, product, integral, union. Its bounds are written as a subscript and a superscript.',
    examples: [
      {
        tex: String.raw`\sum_{k=0}^{n} \binom{n}{k}`,
        note: 'bounds above and below',
      },
      { tex: String.raw`\int_a^b f(x)\,dx`, note: 'bounds beside the sign' },
    ],
  },
  'display style': {
    title: 'Display style',
    summary:
      'The larger setting used for a formula on a line of its own: taller fractions, and the bounds of a sum above and below rather than beside it. This tool renders in display style; `\\textstyle` asks for the inline setting.',
    examples: [
      { tex: String.raw`\sum_{n=1}^{10} n`, note: 'display style' },
      { tex: String.raw`\textstyle\sum_{n=1}^{10} n`, note: 'inline style' },
    ],
  },
  'spacing command': {
    title: 'Spacing command',
    summary:
      'Typed spaces are ignored, so extra space is asked for explicitly, in growing order: \\, then \\; then \\quad then \\qquad. `\\!` takes space away.',
    examples: [
      { tex: String.raw`\int f\,dx`, note: 'a thin space before the d' },
      { tex: String.raw`a \quad b \qquad c`, note: 'wider gaps' },
    ],
  },
  accent: {
    title: 'Accent',
    summary:
      'A mark placed over its argument. The wide versions stretch over several characters, which is what more than one letter needs.',
    examples: [
      { tex: String.raw`\hat{x}, \bar{x}, \vec{v}, \dot{x}` },
      {
        tex: String.raw`\widehat{ABC} \neq \hat{ABC}`,
        note: 'wide, and not wide',
      },
    ],
  },
  environment: {
    title: 'Environment',
    summary: String.raw`A region opened by \begin{name} and closed by \end{name}. The table-shaped ones separate columns with & and end a row with a double backslash.`,
    examples: [
      { tex: String.raw`\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}` },
      { tex: String.raw`\begin{cases} 1 & x > 0 \\ 0 & x \leq 0 \end{cases}` },
    ],
  },
  delimiter: {
    title: 'Delimiter',
    summary: String.raw`A bracket, brace, bar or angle around a formula. Prefixed by \left and \right it grows to the height of what it holds.`,
    examples: [
      { tex: String.raw`\left[\frac{a}{b}\right]`, note: 'grown to fit' },
      { tex: String.raw`\left\langle \psi \middle| \phi \right\rangle` },
    ],
  },
  mhchem: {
    title: 'mhchem',
    summary: String.raw`The chemistry package MathJax loads here. Inside \ce{...} a formula is written as it is spoken: digits fall to subscripts, charges follow a caret, and arrows are drawn from -> and <=>.`,
    examples: [
      { tex: String.raw`\ce{H2SO4}` },
      { tex: String.raw`\ce{CaCO3 ->[\Delta] CaO + CO2 ^}` },
    ],
  },
};
