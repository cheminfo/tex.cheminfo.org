import type { ExerciseSeries } from '../exerciseTypes.ts';

export const STRUCTURES: ExerciseSeries = {
  id: 'structures',
  title: 'Matrices, cases and alignment',
  description: String.raw`Environments: rows separated by \\, columns by &.`,
  level: 'advanced',
  exercises: [
    {
      id: 'two-by-two',
      title: 'A 2×2 matrix',
      level: 'advanced',
      prompt: 'Write the matrix with rows a b and c d, inside round brackets.',
      solution: String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}`,
      hints: [
        'Round brackets come from the pmatrix environment.',
        String.raw`& separates the columns, \\ ends a row.`,
        String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}`,
      ],
      commands: [String.raw`\begin{pmatrix}`, '&', String.raw`\\`],
    },
    {
      id: 'determinant',
      title: 'A determinant',
      level: 'advanced',
      prompt:
        'Write the determinant of that matrix, between vertical bars, equal to ad minus bc.',
      solution: String.raw`\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc`,
      hints: [
        'The bracket is chosen by the environment name.',
        'Vertical bars are vmatrix; square brackets would be bmatrix.',
        String.raw`\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc`,
      ],
      commands: [String.raw`\begin{vmatrix}`],
    },
    {
      id: 'absolute-value',
      title: 'A definition by cases',
      level: 'advanced',
      prompt: 'Write the absolute value of x as a two-case definition.',
      solution: String.raw`|x| = \begin{cases} x & x \geq 0 \\ -x & x < 0 \end{cases}`,
      starter: '|x| = ',
      hints: [
        'The cases environment draws the brace on the left.',
        'Each line is "value & condition".',
        String.raw`\begin{cases} x & x \geq 0 \\ -x & x < 0 \end{cases}`,
      ],
      commands: [String.raw`\begin{cases}`],
    },
    {
      id: 'binomial',
      title: 'A binomial coefficient',
      level: 'advanced',
      prompt:
        'Write "n choose k" equal to n factorial over k factorial times n minus k factorial.',
      solution: String.raw`\binom{n}{k} = \frac{n!}{k!(n-k)!}`,
      hints: [
        String.raw`\binom stacks two arguments without a rule between them.`,
        String.raw`\binom{n}{k} = \frac{n!}{k!(n-k)!}`,
      ],
      commands: [String.raw`\binom{}{}`],
    },
    {
      id: 'aligned-expansion',
      title: 'Two aligned lines',
      level: 'advanced',
      prompt:
        'Expand (a+b)² over two lines, with both equals signs vertically aligned.',
      solution: String.raw`\begin{aligned} (a+b)^2 &= (a+b)(a+b) \\ &= a^2 + 2ab + b^2 \end{aligned}`,
      hints: [
        'The aligned environment lines up on the & marker.',
        'The second line starts with & and no left-hand side.',
        String.raw`\begin{aligned} (a+b)^2 &= (a+b)(a+b) \\ &= a^2 + 2ab + b^2 \end{aligned}`,
      ],
      commands: [String.raw`\begin{aligned}`, '&', String.raw`\\`],
    },
    {
      id: 'boxed-mass-energy',
      title: 'A framed result',
      level: 'advanced',
      prompt: 'Write E = mc² inside a frame.',
      solution: String.raw`\boxed{E = mc^2}`,
      hints: [
        String.raw`\boxed draws a rule around whatever it is given.`,
        String.raw`\boxed{E = mc^2}`,
      ],
      commands: [String.raw`\boxed{}`],
    },
  ],
};
