import { FEATURE_FLAGS } from './types';

const DEFAULT_FEATURE_CONFIG = {
  [FEATURE_FLAGS.ENABLE_E_CHARTS]: false,
};

export const DEFAULT_APP_KIT_CONFIG = {
  featureFlagConfig: DEFAULT_FEATURE_CONFIG,
};