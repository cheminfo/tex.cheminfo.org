import type { DocSection } from './latexTypes.ts';

export const SECTIONS_MATH: DocSection[] = [
  {
    title: 'Arithmetic & Algebra',
    accent: '#6366f1',
    entries: [
      {
        tex: String.raw`\frac{a^2 - b^2}{a + b} = a - b`,
        label: 'Fraction & simplification',
      },
      {
        tex: String.raw`\binom{n}{k} = \frac{n!}{k!\,(n-k)!}`,
        label: 'Binomial coefficient',
      },
      {
        tex: String.raw`\left(\frac{x+1}{x-1}\right)^{2}`,
        label: 'Auto-sized brackets',
      },
      {
        tex: 'a^2 - b^2 = (a+b)(a-b)',
        label: 'Difference of squares',
      },
      { tex: String.raw`\sqrt[n]{x} = x^{1/n}`, label: 'nth root' },
      { tex: String.raw`n! = \prod_{k=1}^{n} k`, label: 'Factorial' },
      {
        tex: String.raw`\lfloor x \rfloor \leq x < \lceil x \rceil`,
        label: 'Floor and ceiling',
      },
    ],
  },
  {
    title: 'Calculus',
    accent: '#059669',
    entries: [
      {
        tex: String.raw`\int_a^b f(x)\,dx = F(b) - F(a)`,
        label: 'Fundamental theorem',
      },
      {
        tex: String.raw`\frac{d}{dx}\left[f(g(x))\right] = f'(g(x))\,g'(x)`,
        label: 'Chain rule',
      },
      {
        tex: String.raw`\lim_{x \to 0} \frac{\sin x}{x} = 1`,
        label: 'Fundamental limit',
      },
      {
        tex: String.raw`f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n`,
        label: 'Taylor series',
      },
      {
        tex: String.raw`\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} = 0`,
        label: 'Laplace equation',
      },
      { tex: String.raw`\iint_D f(x,y)\,dA`, label: 'Double integral' },
      {
        tex: String.raw`\nabla \cdot \mathbf{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}`,
        label: 'Divergence',
      },
    ],
  },
  {
    title: 'Relations',
    accent: '#d97706',
    entries: [
      { tex: String.raw`a \equiv b \pmod{n}`, label: 'Congruence' },
      {
        tex: String.raw`|x - a| < \delta \implies |f(x) - L| < \varepsilon`,
        label: 'Epsilon-delta definition',
      },
      { tex: String.raw`a \leq b < c \leq d`, label: 'Chained inequalities' },
      {
        tex: String.raw`f(x) \sim \frac{1}{x} \text{ as } x \to \infty`,
        label: 'Asymptotic equivalence',
      },
      { tex: String.raw`a \ll b \ll c`, label: 'Much less than' },
      { tex: String.raw`y \propto x^2`, label: 'Proportionality' },
    ],
  },
  {
    title: 'Logic & Sets',
    accent: '#7c3aed',
    entries: [
      {
        tex: String.raw`\forall x \in \mathbb{R},\; x^2 \geq 0`,
        label: 'Universal quantifier',
      },
      {
        tex: String.raw`\exists\, x \in \mathbb{N} : x > 100`,
        label: 'Existential quantifier',
      },
      {
        tex: String.raw`\mathbb{N} \subset \mathbb{Z} \subset \mathbb{R} \subset \mathbb{C}`,
        label: 'Number sets hierarchy',
      },
      {
        tex: String.raw`\overline{A \cup B} = \bar{A} \cap \bar{B}`,
        label: 'De Morgan',
      },
      {
        tex: String.raw`P \implies Q \iff \neg P \lor Q`,
        label: 'Logical equivalence',
      },
      {
        tex: String.raw`A \times B = \{(a,b) : a \in A,\, b \in B\}`,
        label: 'Cartesian product',
      },
      {
        tex: String.raw`|\mathcal{P}(A)| = 2^{|A|}`,
        label: 'Power set cardinality',
      },
    ],
  },
  {
    title: 'Trigonometry',
    accent: '#0f766e',
    entries: [
      {
        tex: String.raw`\sin^2\theta + \cos^2\theta = 1`,
        label: 'Pythagorean identity',
      },
      { tex: String.raw`e^{ix} = \cos x + i\sin x`, label: "Euler's formula" },
      {
        tex: String.raw`\sin(a \pm b) = \sin a\cos b \pm \cos a\sin b`,
        label: 'Angle addition',
      },
      {
        tex: String.raw`\cos(2\theta) = \cos^2\theta - \sin^2\theta`,
        label: 'Double angle',
      },
      { tex: String.raw`c^2 = a^2 + b^2 - 2ab\cos C`, label: 'Law of cosines' },
      {
        tex: String.raw`\tan\theta = \frac{\sin\theta}{\cos\theta}`,
        label: 'Tangent definition',
      },
    ],
  },
];
