import type { ExerciseSeries } from '../exerciseTypes.ts';

export const OPERATORS: ExerciseSeries = {
  id: 'operators',
  title: 'Sums, integrals and limits',
  description: 'The big operators, and the bounds that ride on them.',
  level: 'intermediate',
  exercises: [
    {
      id: 'finite-sum',
      title: 'A sum with bounds',
      level: 'intermediate',
      prompt: 'Write the sum of n, for n going from 1 to 10.',
      solution: String.raw`\sum_{n=1}^{10} n`,
      hints: [
        String.raw`\sum takes its bounds as a subscript and a superscript.`,
        'Both bounds are more than one character, so both need braces.',
        String.raw`\sum_{n=1}^{10} n`,
      ],
      commands: [String.raw`\sum_{}^{}`],
    },
    {
      id: 'definite-integral',
      title: 'A definite integral',
      level: 'intermediate',
      prompt: 'Write the integral of x squared from 0 to 1, with respect to x.',
      solution: String.raw`\int_0^1 x^2\,dx`,
      hints: [
        String.raw`\int carries its bounds like \sum does.`,
        String.raw`A thin space before the dx is written \, — it is optional here.`,
        String.raw`\int_0^1 x^2\,dx`,
      ],
      commands: [String.raw`\int_{}^{}`, String.raw`\,`],
    },
    {
      id: 'sinc-limit',
      title: 'A limit',
      level: 'intermediate',
      prompt: 'Write "the limit as x tends to 0 of sin x over x equals 1".',
      solution: String.raw`\lim_{x \to 0} \frac{\sin x}{x} = 1`,
      hints: [
        String.raw`\lim takes what is under it as a subscript, and the arrow is \to.`,
        String.raw`Named functions have commands too: \sin, not sin.`,
        String.raw`\lim_{x \to 0} \frac{\sin x}{x} = 1`,
      ],
      commands: [String.raw`\lim_{}`, String.raw`\to`, String.raw`\sin`],
    },
    {
      id: 'factorial-product',
      title: 'A product',
      level: 'intermediate',
      prompt: 'Write the product of k for k from 1 to n, equal to n factorial.',
      solution: String.raw`\prod_{k=1}^{n} k = n!`,
      hints: [
        String.raw`The product sign is \prod.`,
        'The factorial is just an exclamation mark.',
        String.raw`\prod_{k=1}^{n} k = n!`,
      ],
      commands: [String.raw`\prod_{}^{}`],
    },
    {
      id: 'partial-derivative',
      title: 'A partial derivative',
      level: 'intermediate',
      prompt:
        'Write the partial derivative of f with respect to x, as a fraction.',
      solution: String.raw`\frac{\partial f}{\partial x}`,
      hints: [
        String.raw`The curly d is \partial.`,
        'It appears in both the numerator and the denominator.',
        String.raw`\frac{\partial f}{\partial x}`,
      ],
      commands: [String.raw`\partial`, String.raw`\frac{}{}`],
    },
  ],
};
