import { SetMetadata } from '@nestjs/common';

export const FEATURE_FLAG_KEY = 'featureFlagKey';

export const FeatureFlag = (key: string): ReturnType<typeof SetMetadata> =>
    SetMetadata(FEATURE_FLAG_KEY, key);
