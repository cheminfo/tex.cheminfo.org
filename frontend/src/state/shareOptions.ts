import type { FeatureKey } from './shareConfig.ts';
import { SHARE_VOCABULARY } from './shareConfig.ts';

/** The parts the dialog offers, in the order it lists them. */
export const SHARE_FEATURES = SHARE_VOCABULARY.parts;

/**
 * The parts a link starts with switched off: what is noise inside a frame.
 */
export const DEFAULT_EMBED_HIDDEN: readonly FeatureKey[] =
  SHARE_VOCABULARY.parts
    .filter((part) => 'hiddenByDefault' in part && part.hiddenByDefault)
    .map((part) => part.key);
