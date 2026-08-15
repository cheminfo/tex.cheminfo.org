import type { ExerciseSeries } from '../exerciseTypes.ts';

export const SYMBOLS: ExerciseSeries = {
  id: 'symbols',
  title: 'Greek letters and symbols',
  description: 'The names behind the glyphs, and where the capitals differ.',
  level: 'beginner',
  exercises: [
    {
      id: 'area-of-a-disc',
      title: 'Area of a disc',
      level: 'beginner',
      prompt: 'Write the area of a disc of radius r.',
      solution: String.raw`\pi r^2`,
      hints: [
        'A Greek letter is its name preceded by a backslash.',
        String.raw`\pi r^2`,
      ],
      commands: [String.raw`\pi`],
    },
    {
      id: 'alpha-beta-gamma',
      title: 'Three lowercase letters',
      level: 'beginner',
      prompt: 'Write alpha plus beta equals gamma.',
      solution: String.raw`\alpha + \beta = \gamma`,
      hints: [
        'Each letter is its own command.',
        String.raw`\alpha + \beta = \gamma`,
      ],
      commands: [String.raw`\alpha`, String.raw`\beta`, String.raw`\gamma`],
    },
    {
      id: 'enthalpy-change',
      title: 'An exothermic reaction',
      level: 'beginner',
      prompt: 'Write "delta H is less than zero" with a capital delta.',
      solution: String.raw`\Delta H < 0`,
      hints: [
        'A capital Greek letter is the same name with a capital first letter.',
        String.raw`\Delta H < 0 — \delta would give the small one.`,
      ],
      commands: [String.raw`\Delta`],
    },
    {
      id: 'inequalities',
      title: 'Less than or equal',
      level: 'beginner',
      prompt: 'Write a ≤ b ≤ c, using the "less than or equal" sign.',
      solution: String.raw`a \leq b \leq c`,
      hints: [
        String.raw`The sign is \leq; its mirror is \geq.`,
        String.raw`a \leq b \leq c`,
      ],
      commands: [String.raw`\leq`, String.raw`\geq`, String.raw`\neq`],
    },
    {
      id: 'speed-of-light',
      title: 'A number in scientific notation',
      level: 'beginner',
      prompt:
        'Write c equals 3 times 10 to the power 8, with a multiplication cross.',
      solution: String.raw`c = 3 \times 10^{8}`,
      hints: [
        String.raw`The cross is \times, not the letter x.`,
        String.raw`c = 3 \times 10^{8}`,
      ],
      commands: [String.raw`\times`, String.raw`\cdot`, '^{}'],
    },
  ],
};
