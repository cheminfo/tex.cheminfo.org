import type { ExerciseSeries } from '../exerciseTypes.ts';

export const FRACTIONS: ExerciseSeries = {
  id: 'fractions',
  title: 'Fractions and roots',
  description: 'Building stacked expressions, and nesting them.',
  level: 'beginner',
  exercises: [
    {
      id: 'one-half',
      title: 'One half',
      level: 'beginner',
      prompt: 'Write the fraction one over two.',
      solution: String.raw`\frac{1}{2}`,
      hints: [
        String.raw`\frac takes two groups: the numerator, then the denominator.`,
        String.raw`\frac{1}{2}`,
      ],
      commands: [String.raw`\frac{}{}`],
    },
    {
      id: 'sum-over-two',
      title: 'A sum over a number',
      level: 'beginner',
      prompt:
        'Write the fraction whose numerator is a plus b and whose denominator is 2.',
      solution: String.raw`\frac{a+b}{2}`,
      hints: [
        'The whole sum is the numerator, so it goes in the first group.',
        String.raw`\frac{a+b}{2}`,
      ],
      commands: [String.raw`\frac{}{}`],
    },
    {
      id: 'sqrt-two',
      title: 'Square root of two',
      level: 'beginner',
      prompt: 'Write the square root of 2.',
      solution: String.raw`\sqrt{2}`,
      hints: [
        String.raw`The command is \sqrt, and what is under the sign goes in braces.`,
        String.raw`\sqrt{2}`,
      ],
      commands: [String.raw`\sqrt{}`],
    },
    {
      id: 'cube-root',
      title: 'A root of another order',
      level: 'intermediate',
      prompt: 'Write the cube root of x — the 3 sits in the notch of the sign.',
      solution: String.raw`\sqrt[3]{x}`,
      hints: [
        String.raw`\sqrt takes an optional argument in square brackets.`,
        'That optional argument is the order of the root.',
        String.raw`\sqrt[3]{x}`,
      ],
      commands: [String.raw`\sqrt[]{}`],
    },
    {
      id: 'nested-fraction',
      title: 'A fraction inside a fraction',
      level: 'intermediate',
      prompt: 'Write 1 over the quantity 1 plus 1 over x.',
      solution: String.raw`\frac{1}{1+\frac{1}{x}}`,
      hints: [
        String.raw`A \frac can appear inside another \frac.`,
        'Start from the outer fraction, then fill its denominator.',
        String.raw`\frac{1}{1+\frac{1}{x}}`,
      ],
      commands: [String.raw`\frac{}{}`],
    },
    {
      id: 'quadratic-roots',
      title: 'The quadratic formula',
      level: 'intermediate',
      prompt: 'Write the two solutions of a quadratic equation.',
      solution: String.raw`x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}`,
      starter: 'x = ',
      hints: [
        String.raw`The plus-or-minus sign is \pm.`,
        'The whole discriminant is under the root, and the root is in the numerator.',
        String.raw`\frac{-b \pm \sqrt{b^2-4ac}}{2a}`,
      ],
      commands: [String.raw`\frac{}{}`, String.raw`\sqrt{}`, String.raw`\pm`],
    },
  ],
};
