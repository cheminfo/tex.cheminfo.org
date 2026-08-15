import type { ExerciseSeries } from '../exerciseTypes.ts';

export const POWERS: ExerciseSeries = {
  id: 'powers',
  title: 'Powers and indices',
  description: 'Superscripts, subscripts, and when braces are needed.',
  level: 'beginner',
  exercises: [
    {
      id: 'x-squared',
      title: 'x squared',
      level: 'beginner',
      prompt: 'Write x raised to the power 2.',
      solution: 'x^2',
      hints: [
        'A superscript is written with the caret ^.',
        'A single character needs no braces: x^2.',
      ],
      commands: ['^'],
    },
    {
      id: 'a-sub-one',
      title: 'First term of a sequence',
      level: 'beginner',
      prompt: 'Write a with the index 1 below it.',
      solution: 'a_1',
      hints: [
        'A subscript is written with the underscore _.',
        'a_1 puts the 1 below the line.',
      ],
      commands: ['_'],
    },
    {
      id: 'x-i-squared',
      title: 'Index and power together',
      level: 'beginner',
      prompt: 'Write x with the index i below and the power 2 above.',
      solution: 'x_i^2',
      hints: [
        'Both scripts attach to the same letter — write them one after the other.',
        'The order does not matter: x_i^2 and x^2_i render alike.',
      ],
      commands: ['^', '_'],
    },
    {
      id: 'e-minus-x',
      title: 'A power of more than one character',
      level: 'beginner',
      prompt: 'Write e to the power minus x.',
      solution: 'e^{-x}',
      hints: [
        'The caret takes only the next character unless you group.',
        'Braces { } group several characters into one exponent.',
        'e^{-x} — without the braces only the minus sign goes up.',
      ],
      commands: ['^{}'],
    },
    {
      id: 'two-to-n-plus-one',
      title: 'A power that is a sum',
      level: 'beginner',
      prompt:
        'Write 2 to the power n plus 1, with the whole sum in the exponent.',
      solution: '2^{n+1}',
      hints: [
        'The whole sum has to be inside the exponent.',
        'Group it: 2^{n+1}, not 2^n+1.',
      ],
      commands: ['^{}'],
    },
  ],
};
