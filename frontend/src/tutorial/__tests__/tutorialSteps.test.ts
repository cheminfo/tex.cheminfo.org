import { expect, test } from 'vitest';

import { compileError } from '../../exercises/mathml.ts';
import { GLOSSARY } from '../glossary.ts';
import { TUTORIAL_LEVELS, TUTORIAL_STEPS } from '../tutorialSteps.ts';

const MARKER = /\[\[(?<term>[^\]]+)\]\]/gu;

test('the tour has 17 steps across its 3 levels', () => {
  expect(TUTORIAL_STEPS).toHaveLength(17);
  expect(TUTORIAL_LEVELS).toHaveLength(3);
  for (const group of TUTORIAL_LEVELS) {
    expect(
      TUTORIAL_STEPS.filter((step) => step.level === group.level).length,
      group.level,
    ).toBeGreaterThanOrEqual(4);
  }
});

test('every step opens on a formula that renders', () => {
  for (const step of TUTORIAL_STEPS) {
    expect(compileError(step.tex), step.title).toBe(null);
  }
});

test('every glossary example renders', () => {
  for (const [term, entry] of Object.entries(GLOSSARY)) {
    expect(entry.examples.length, term).toBeGreaterThanOrEqual(1);
    for (const example of entry.examples) {
      expect(compileError(example.tex), `${term}: ${example.tex}`).toBe(null);
    }
  }
});

test('every marked term has a glossary entry', () => {
  const missing = new Set<string>();
  for (const step of TUTORIAL_STEPS) {
    for (const match of step.description.matchAll(MARKER)) {
      const term = (match.groups?.term ?? '').toLowerCase();
      // A plural marker links the singular entry: [[variable]]s.
      if (!GLOSSARY[term]) missing.add(term);
    }
  }
  expect([...missing]).toStrictEqual([]);
});

test('glossary keys are lowercase, since markers are matched lowercased', () => {
  for (const term of Object.keys(GLOSSARY)) {
    expect(term).toBe(term.toLowerCase());
  }
});
