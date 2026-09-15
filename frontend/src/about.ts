import type { AboutContent } from 'react-cheminfo/core';
import { PLATFORM_WORK } from 'react-cheminfo/core';

/**
 * What this site says about itself, drawn by `AboutPage` from
 * `react-cheminfo/ui` at `/about`.
 */
export const ABOUT: AboutContent = {
  siteId: 'tex',
  what: 'Render a LaTeX or mhchem formula as an SVG or PNG image, from an address any img tag can point at.',
  can: [
    'Write a formula and watch it render as you type.',
    'Copy the server-rendered image as SVG, or as PNG at 150 or 300 dpi.',
    'Point an img tag at a URL and get the image back, with no page to load.',
    'Learn the notation in seventeen editable tutorial steps.',
    'Practise with 33 exercises, marked on what your answer renders to.',
    'Share or embed any page, formula and configuration included.',
  ],
  paragraphs: [
    'MathJax 3 renders both the preview in your browser and the image the server hands out, so the two agree. The API is a stateless GET: /v1/?tex=E%3Dmc%5E2 returns the image, and nothing is stored.',
    'Every ?tex= link or bookmark pointing at tex.cheminfo.org opens here.',
  ],
  credits: ['mathjax', 'blueprint', 'react-cheminfo', 'react', 'vite'],
  cite: [PLATFORM_WORK],
};
