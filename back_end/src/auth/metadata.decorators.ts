import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, FOR_REFRESHING_KEY } from './constants';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const ForRefreshingPublic = () => SetMetadata(FOR_REFRESHING_KEY, true);
