import type { ReactElement } from 'react';
import { ClickToCopy } from 'react-cheminfo/ui';

import { MathJaxRenderer } from '../shared/MathJaxRenderer.tsx';

import type { GlossaryExample as Example } from './glossary.ts';

/**
 * One worked example inside a definition: the formula as it is typed, next to
 * what it renders to. A term is only understood once both are on screen.
 * @param props.example - The formula, and what it demonstrates.
 * @returns The source beside the rendered formula.
 */
export function GlossaryExample({
  example,
}: {
  example: Example;
}): ReactElement {
  return (
    <span className="glossary-example">
      <ClickToCopy as="code" label="LaTeX" value={example.tex}>
        {example.tex}
      </ClickToCopy>
      <MathJaxRenderer tex={example.tex} displayMode={false} />
    </span>
  );
}
