import type {
  ShareConfig as SharedConfig,
  ShareParamCodec,
  ShareVocabulary,
} from 'react-cheminfo/core';
import { integerParam, parseShareConfig } from 'react-cheminfo/core';

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const DEFAULT_ZOOM = 2;

/**
 * The tool's own parameters, beyond the `embed` and `hide` every site shares.
 * A `Record` rather than an interface: `ShareVocabulary` is keyed by an index
 * signature, which an interface does not satisfy.
 */
type Params = Readonly<Record<'zoom', ShareParamCodec<number>>>;

/**
 * The share vocabulary this tool understands, and the only place that knows
 * the parameter names. `embed` and `hide` are shared by every cheminfo tool;
 * `zoom` is this tool's own. Unknown `hide` keys are ignored and a malformed
 * number falls back to its default, so a link written years ago still opens.
 *
 * The order is the one the dialog and `hide=` both use, so two people who
 * ticked the same boxes hand out the same link.
 */
export const SHARE_VOCABULARY = {
  parts: [
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
      key: 'exerciseList',
      label: 'Exercise list',
      description:
        'The series and their numbered exercises. Hiding it embeds exactly the exercise the link names.',
    },
    {
      key: 'tutorialSteps',
      label: 'Tutorial steps',
      description:
        'The strips of numbered steps. Hiding them embeds exactly the step the link names.',
    },
    {
      key: 'serverRender',
      label: 'Server render',
      description:
        'The server-rendered image with its SVG and PNG copy buttons. Hiding it keeps the live preview.',
    },
  ],
  params: {
    zoom: integerParam({ min: MIN_ZOOM, max: MAX_ZOOM, default: DEFAULT_ZOOM }),
  },
} as const satisfies ShareVocabulary<Params>;

/** A part of the page a shared link can switch off. */
export type FeatureKey = (typeof SHARE_VOCABULARY)['parts'][number]['key'];

/** What one of this site's links says, beyond the formula it carries. */
export type ShareConfig = SharedConfig<Params>;

/** What a plain link, with nothing configured, means. */
export const DEFAULT_SHARE_CONFIG: ShareConfig = parseShareConfig(
  '',
  SHARE_VOCABULARY,
);
