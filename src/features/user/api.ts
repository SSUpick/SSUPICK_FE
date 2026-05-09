import type { ProfileViewListResponseDto } from '@/features/profile-view/types';
import type { CommonResponse } from '@/types/api';
import { http } from '@/utils/http';

import type { UserProfileResponseDto } from './types';

export const getUserProfile = () =>
    http.get<CommonResponse<UserProfileResponseDto>>('/api/users/me').then((r) => r.data.data);

export const getProfileViewList = () =>
    http
        .get<CommonResponse<ProfileViewListResponseDto>>('/api/users/me/profile-views')
        .then((r) => r.data.data);
