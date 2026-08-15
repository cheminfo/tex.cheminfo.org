import type { ExerciseSeries } from '../exerciseTypes.ts';

export const CHEMISTRY: ExerciseSeries = {
  id: 'chemistry',
  title: 'Chemistry notation',
  description:
    'Formulas, charges and reaction arrows with the mhchem package, plus the equations that use them.',
  level: 'intermediate',
  exercises: [
    {
      id: 'water',
      title: 'A molecular formula',
      level: 'intermediate',
      prompt: 'Write the formula of water, with the 2 as a proper subscript.',
      solution: String.raw`\ce{H2O}`,
      hints: [
        String.raw`\ce{...} typesets chemistry: digits become subscripts on their own.`,
        String.raw`\ce{H2O}`,
      ],
      commands: [String.raw`\ce{}`],
    },
    {
      id: 'sulfate',
      title: 'A charged ion',
      level: 'intermediate',
      prompt: 'Write the sulfate ion, with its 2− charge in superscript.',
      solution: String.raw`\ce{SO4^2-}`,
      hints: [
        String.raw`Inside \ce, a charge is written after a caret.`,
        String.raw`\ce{SO4^2-}`,
      ],
      commands: [String.raw`\ce{}`],
    },
    {
      id: 'combustion',
      title: 'A reaction arrow',
      level: 'intermediate',
      prompt:
        'Write the reaction of carbon dioxide with carbon giving two carbon monoxide.',
      solution: String.raw`\ce{CO2 + C -> 2CO}`,
      hints: [
        String.raw`Inside \ce, the arrow is written -> and the spaces are yours to place.`,
        String.raw`\ce{CO2 + C -> 2CO}`,
      ],
      commands: [String.raw`\ce{}`, '->'],
    },
    {
      id: 'ammonia-equilibrium',
      title: 'An equilibrium',
      level: 'intermediate',
      prompt:
        'Write the synthesis of ammonia as an equilibrium, with a double harpoon.',
      solution: String.raw`\ce{N2 + 3H2 <=> 2NH3}`,
      hints: [
        'An equilibrium arrow is <=>; a one-sided pair would be <-> .',
        String.raw`\ce{N2 + 3H2 <=> 2NH3}`,
      ],
      commands: [String.raw`\ce{}`, '<=>'],
    },
    {
      id: 'ph',
      title: 'The definition of pH',
      level: 'intermediate',
      prompt:
        'Write pH equals minus the logarithm of the proton concentration.',
      solution: String.raw`\mathrm{pH} = -\log[\ce{H+}]`,
      hints: [
        String.raw`\mathrm keeps pH upright — two italic letters would read as a product.`,
        String.raw`\log is a command, and the concentration brackets are typed as they are.`,
        String.raw`\mathrm{pH} = -\log[\ce{H+}]`,
      ],
      commands: [String.raw`\mathrm{}`, String.raw`\log`, String.raw`\ce{}`],
    },
    {
      id: 'nernst',
      title: 'The Nernst equation',
      level: 'advanced',
      prompt:
        'Write E equals E standard minus RT over nF times the natural logarithm of Q.',
      solution: String.raw`E = E^\circ - \frac{RT}{nF} \ln Q`,
      starter: 'E = ',
      hints: [
        String.raw`The standard-state degree sign is \circ, in superscript.`,
        String.raw`The natural logarithm is \ln.`,
        String.raw`E = E^\circ - \frac{RT}{nF} \ln Q`,
      ],
      commands: [String.raw`^\circ`, String.raw`\frac{}{}`, String.raw`\ln`],
    },
  ],
};
