import type { ReactNode } from 'react';
import { Fragment } from 'react';

import { MathJaxRenderer } from '../shared/MathJaxRenderer.tsx';

import type { GlossaryEntry } from './glossary.ts';
import { GLOSSARY } from './glossary.ts';

/** A `[[term]]` marker, or a run of `code` between backticks. */
const MARKER = /\[\[(?<term>[^\]]+)\]\]|`(?<code>[^`]+)`/gu;

/**
 * Render prose in which jargon is marked with `[[double brackets]]` and code
 * with backticks, turning every marked word the glossary knows into a
 * hoverable definition.
 *
 * A marker the glossary has no entry for renders as the plain word — never as
 * the brackets — so a description may link a term before anybody has written
 * it, and the page keeps reading.
 * @param props.text - The prose to render.
 * @returns The prose, with its terms made hoverable.
 */
export function GlossaryText({ text }: { text: string }) {
  const pieces: ReactNode[] = [];
  let at = 0;

  for (const match of text.matchAll(MARKER)) {
    const start = match.index;
    if (start > at) pieces.push(text.slice(at, start));
    const key = `${start}-${match[0]}`;
    const code = match.groups?.code;
    if (code !== undefined) {
      pieces.push(
        <code key={key} className="inline-code">
          {code}
        </code>,
      );
    } else {
      const term = match.groups?.term ?? '';
      const entry = GLOSSARY[term.toLowerCase()];
      pieces.push(
        entry ? (
          <GlossaryTerm key={key} term={term} entry={entry} />
        ) : (
          <Fragment key={key}>{term}</Fragment>
        ),
      );
    }
    at = start + match[0].length;
  }
  if (at < text.length) pieces.push(text.slice(at));

  return <>{pieces}</>;
}

function GlossaryTerm({ term, entry }: { term: string; entry: GlossaryEntry }) {
  return (
    <span className="glossary-term" tabIndex={0}>
      {term}
      <span className="glossary-card" role="tooltip">
        <span className="glossary-title">{entry.title}</span>
        <span className="glossary-summary">{entry.summary}</span>
        {entry.examples.map((example) => (
          <span key={example.tex} className="glossary-example">
            <code>{example.tex}</code>
            <MathJaxRenderer tex={example.tex} displayMode={false} />
            {example.note && <i>{example.note}</i>}
          </span>
        ))}
      </span>
    </span>
  );
}
