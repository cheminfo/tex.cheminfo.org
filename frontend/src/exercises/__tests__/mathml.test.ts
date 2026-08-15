import { expect, test } from 'vitest';

import { compileError, rendersTheSame } from '../mathml.ts';

test('braces around a single-character script change nothing', () => {
  expect(rendersTheSame('x^2', 'x^{2}')).toBe(true);
});

test('a fraction is the same however its arguments are grouped', () => {
  expect(rendersTheSame(String.raw`\frac12`, String.raw`\frac{1}{2}`)).toBe(
    true,
  );
});

test('spacing commands and whitespace do not distinguish two answers', () => {
  expect(
    rendersTheSame(
      String.raw`\int_0^1 x^2\,dx`,
      String.raw`\int_{0}^{1} x^{2} dx`,
    ),
  ).toBe(true);
});

test('two spellings of the same arrow are the same answer', () => {
  expect(
    rendersTheSame(
      String.raw`\lim_{x \to 0} x`,
      String.raw`\lim_{x
      \rightarrow 0} x`,
    ),
  ).toBe(true);
});

test('a superscript is not a subscript', () => {
  expect(rendersTheSame('x^2', 'x_2')).toBe(false);
});

test('a fraction is not its reciprocal', () => {
  expect(rendersTheSame(String.raw`\frac{a}{b}`, String.raw`\frac{b}{a}`)).toBe(
    false,
  );
});

test('a stretched bracket is not a plain one', () => {
  expect(
    rendersTheSame(
      String.raw`\left(\frac{a}{b}\right)`,
      String.raw`(\frac{a}{b})`,
    ),
  ).toBe(false);
});

test('a chemistry formula is compared like any other', () => {
  expect(rendersTheSame(String.raw`\ce{H2O}`, String.raw`\ce{H2O}`)).toBe(true);
  expect(rendersTheSame(String.raw`\ce{H2O}`, String.raw`\ce{H2O2}`)).toBe(
    false,
  );
});

test('a valid formula reports no error', () => {
  expect(compileError(String.raw`\frac{1}{2}`)).toBe(null);
});

test('an unbalanced brace is reported as MathJax words it', () => {
  expect(compileError(String.raw`\frac{1`)).toBe('Missing close brace');
});

test('a missing script argument is reported', () => {
  expect(compileError('x^')).toBe('Missing superscript or subscript argument');
});

test('an unknown command is named in the message', () => {
  expect(compileError(String.raw`\notacommand{x}`)).toBe(
    String.raw`Unknown command \notacommand`,
  );
});
