import type { FeatureKey } from './shareConfig.ts';

export interface ShareFeatureOption {
  key: FeatureKey;
  label: string;
  /** What hiding this feature does, worded for the person embedding the page. */
  description: string;
  /**
   * Whether the dialog starts with this feature already switched off, because
   * it is noise inside a frame.
   * @default false
   */
  hiddenByDefault?: boolean;
}

export const SHARE_FEATURES: readonly ShareFeatureOption[] = [
  {
    key: 'examples',
    label: 'Examples',
    description: 'A gallery of ready-made formulas to start from.',
  },
  {
    key: 'reference',
    label: 'Reference',
    description: 'The LaTeX syntax reference, grouped by topic.',
  },
  {
    key: 'commands',
    label: 'Commands',
    description: 'The searchable list of every supported command.',
  },
  {
    key: 'help',
    label: 'Help',
    description: 'The page explaining what this tool does.',
  },
  {
    key: 'embedCode',
    label: 'Embed code',
    description:
      'The HTML and Markdown snippets pointing at the rendering API. Rarely useful inside a course page.',
    hiddenByDefault: true,
  },
  {
    key: 'serverRender',
    label: 'Server render',
    description:
      'The server-rendered image with its SVG and PNG copy buttons. Hiding it keeps the live preview.',
  },
];

export const DEFAULT_EMBED_HIDDEN: readonly FeatureKey[] =
  SHARE_FEATURES.filter((feature) => feature.hiddenByDefault).map(
    (feature) => feature.key,
  );
