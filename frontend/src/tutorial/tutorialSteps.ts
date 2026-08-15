import type { Level } from '../exercises/exerciseTypes.ts';

/**
 * One stop in the guided tour. The description may carry `[[term]]` markers
 * pointing at the glossary; a marker the glossary does not know renders as the
 * plain word, so prose may link a term before anybody has written its entry.
 *
 * `tex` is preloaded into the playground — the student is free to take it
 * apart, and the render refreshes on every keystroke.
 */
export interface TutorialStep {
  title: string;
  description: string;
  tex: string;
  level: Level;
}

export interface TutorialLevel {
  level: Level;
  label: string;
}

export const TUTORIAL_LEVELS: readonly TutorialLevel[] = [
  { level: 'beginner', label: 'Reading and writing a formula' },
  { level: 'intermediate', label: 'Operators, functions and spacing' },
  { level: 'advanced', label: 'Structures, chemistry and images' },
];

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    level: 'beginner',
    title: 'A formula is text, and the layout is inferred',
    description:
      'Everything you type is math: single letters become italic [[variable]]s, digits stay upright, and the spaces you type are ignored — MathJax spaces the formula itself, from what the symbols mean. So `E=mc^2` and `E = m c^2` give the same picture. Try adding spaces below, then removing them all.',
    tex: 'E = mc^2',
  },
  {
    level: 'beginner',
    title: 'Above and below: ^ and _',
    description:
      'A caret raises what follows it and an underscore lowers it — a [[superscript]] and a [[subscript]]. Each takes exactly one item, so `x^2` works but `10^23` puts only the 2 up there. Both can sit on the same letter, in either order. Change the 2 to 10 below and watch what happens.',
    tex: 'x_i^2 + 10^23',
  },
  {
    level: 'beginner',
    title: 'Braces make several characters into one item',
    description:
      'Braces build a [[group]]: `{...}` is one item wherever LaTeX expects one, and the braces themselves are never printed. This is the fix for the step before — `10^{23}` — and it is how any [[command]] is given more than one character. Braces nest as deeply as you like.',
    tex: String.raw`6.022 \times 10^{23}\ \text{mol}^{-1}`,
  },
  {
    level: 'beginner',
    title: 'A command starts with a backslash',
    description:
      'A [[command]] is a backslash followed by letters, and it may take [[argument]]s in braces. `\\frac` takes two — the numerator and the denominator — and stacks them. A command ends at the first non-letter, which is why `\\frac{a}{b}` needs no space but `\\pi r` does.',
    tex: String.raw`\frac{a+b}{c} = \frac{1}{2}`,
  },
  {
    level: 'beginner',
    title: 'Roots, and an optional argument',
    description:
      '`\\sqrt` draws the radical over its [[argument]], and it accepts an [[optional argument]] in square brackets for the order of the root. Square brackets before braces are the general shape of an option in LaTeX.',
    tex: String.raw`\sqrt{b^2 - 4ac} \quad \sqrt[3]{x}`,
  },
  {
    level: 'beginner',
    title: 'Greek letters are named',
    description:
      'Every Greek letter is a [[command]] carrying its own name: `\\alpha`, `\\beta`, `\\pi`. A capital letter is the same name capitalised — `\\Delta`, `\\Omega` — and the ones that look like Latin capitals (A, B, E…) have no command at all, because you simply type them.',
    tex: String.raw`\Delta G = \Delta H - T\Delta S`,
  },
  {
    level: 'intermediate',
    title: 'Big operators carry their limits',
    description:
      'A [[big operator]] — `\\sum`, `\\prod`, `\\int`, `\\bigcup` — takes its bounds as a [[subscript]] and a [[superscript]]. In [[display style]] the bounds of a sum sit above and below the sign, while those of an integral stay beside it; that is a convention of mathematical typesetting, not something you choose.',
    tex: String.raw`\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}`,
  },
  {
    level: 'intermediate',
    title: 'Integrals, and the space before the d',
    description:
      'Nothing forces you to space a formula, but one convention is worth knowing: a thin space `\\,` before the differential. Compare the two integrals below — the second is what a typesetter would print. The other [[spacing command]]s are `\\;`, `\\quad` and `\\qquad`, in growing order.',
    tex: String.raw`\int_0^\infty e^{-x}dx = \int_0^\infty e^{-x}\,dx = 1`,
  },
  {
    level: 'intermediate',
    title: 'Function names are upright',
    description:
      'Written plainly, `sin` is three variables multiplied — s times i times n — and it is set in italic. The known functions have their own commands (`\\sin`, `\\log`, `\\exp`, `\\lim`) which print upright and space correctly. For a name of your own, `\\mathrm{}` keeps it upright and `\\text{}` prints real words, spaces included.',
    tex: String.raw`\lim_{x \to 0} \frac{\sin x}{x} = 1 \quad \mathrm{pH} = -\log[\mathrm{H}^+]`,
  },
  {
    level: 'intermediate',
    title: 'Delimiters that grow with their contents',
    description:
      'A typed bracket keeps the size of a letter, however tall the formula inside it. `\\left(` and `\\right)` make a matching pair that grows to fit — and every `\\left` needs its `\\right`, though `\\right.` closes with nothing. It works for `[ ] \\{ \\} | \\langle \\rangle` too.',
    tex: String.raw`(\frac{1}{2}) \neq \left(\frac{1}{2}\right)`,
  },
  {
    level: 'intermediate',
    title: 'Hats, bars and arrows on top',
    description:
      'An [[accent]] command puts a mark over its argument: `\\hat{x}`, `\\bar{x}`, `\\vec{v}`, `\\dot{x}`, `\\tilde{a}`. The wide versions — `\\widehat`, `\\overline`, `\\overrightarrow` — stretch over several characters, which is what you want for anything longer than one letter.',
    tex: String.raw`\hat{y} = \bar{x} + \vec{v}\cdot\vec{n} \quad \overline{AB}`,
  },
  {
    level: 'advanced',
    title: 'An environment builds a table: matrices',
    description:
      'An [[environment]] is opened by `\\begin{name}` and closed by `\\end{name}`. The matrix family lays out rows and columns: `&` separates columns, `\\\\` ends a row, and the name picks the brackets — pmatrix (round), bmatrix (square), vmatrix (bars), Bmatrix (braces), matrix (none).',
    tex: String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix} \quad \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc`,
  },
  {
    level: 'advanced',
    title: 'Definitions by cases',
    description:
      'The `cases` [[environment]] draws a single large brace on the left and lays out one line per case, each written as "value & condition". It is the same table machinery as a matrix, with different decoration.',
    tex: String.raw`|x| = \begin{cases} x & x \geq 0 \\ -x & x < 0 \end{cases}`,
  },
  {
    level: 'advanced',
    title: 'Aligning several lines',
    description:
      'The `aligned` [[environment]] stacks lines and lines them up on the `&` marker — put it just before the equals sign of every line and the whole derivation hangs from one column. A line whose left-hand side is empty simply starts with `&`.',
    tex: String.raw`\begin{aligned}
  (a+b)^2 &= (a+b)(a+b) \\
          &= a^2 + 2ab + b^2
\end{aligned}`,
  },
  {
    level: 'advanced',
    title: String.raw`Chemistry: \ce from mhchem`,
    description:
      'The [[mhchem]] package adds `\\ce{...}`, inside which chemistry is written the way it is spoken: digits become subscripts, charges follow a caret, `->` is a reaction arrow and `<=>` an equilibrium. It is far shorter — and far more legible — than assembling the same formula out of subscripts by hand.',
    tex: String.raw`\ce{N2 + 3H2 <=> 2NH3} \quad \ce{SO4^2-}`,
  },
  {
    level: 'advanced',
    title: 'Framing, grouping and annotating',
    description:
      'A handful of commands decorate rather than compute: `\\boxed{}` frames a result, `\\underbrace{}_{}` and `\\overbrace{}^{}` group a run of terms with a label, and `\\text{}` drops back into words in the middle of a formula.',
    tex: String.raw`\boxed{\underbrace{a + b + c}_{\text{three terms}} = \overbrace{x + y}^{\text{two}}}`,
  },
  {
    level: 'advanced',
    title: 'From a formula to an image',
    description:
      'Everything you have written here is rendered by the same MathJax that the server runs, so any formula becomes an image with a plain address: `/v1/?tex=<your formula, URL-encoded>`, optionally `&format=png&resolution=300`. Open a formula in the Editor page and the embed snippets are written for you — HTML for a web page, Markdown for a notebook or a README.',
    tex: String.raw`\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)\,e^{-2\pi i x\xi}\,dx`,
  },
];
