import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { STATE } from 'mathjax-full/js/core/MathItem.js';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { SVG } from 'mathjax-full/js/output/svg.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mjDocument = mathjax.document('', {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: 'none' }),
});

const mmlVisitor = new SerializedMmlVisitor();

export function renderToSvg(tex: string, display: boolean): string {
  const node = mjDocument.convert(tex, { display });
  return adaptor.innerHTML(node);
}

/**
 * Compile a formula to MathML, stopping before it is laid out.
 * This is what the formula *means* to MathJax, so two ways of writing the same
 * thing can be compared without comparing their source.
 * @param tex - The LaTeX formula.
 * @returns The serialized MathML tree.
 */
export function renderToMathML(tex: string): string {
  return mmlVisitor.visitTree(
    mjDocument.convert(tex, { display: true, end: STATE.CONVERT }),
  );
}
