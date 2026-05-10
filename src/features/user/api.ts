import type { ProfileViewListResponseDto } from '@/features/profile-view/types';
import type { CommonResponse } from '@/types/api';
import { http } from '@/utils/http';

import type {
    UserCardResponseDto,
    UserOnboardingRequestDto,
    UserProfileResponseDto,
    UserTargetProfileResponseDto,
    UserUpdateProfileRequestDto,
} from './types';

export const getUserProfile = () =>
    http.get<CommonResponse<UserProfileResponseDto>>('/api/users/me').then(r => r.data.data);

export const registerUserOnboarding = (body: UserOnboardingRequestDto) =>
    http.post('/api/users/onboarding', body).then(() => undefined);

export const updateUserProfile = (body: UserUpdateProfileRequestDto) =>
    http.put('/api/users/me', body).then(() => undefined);

export const getUserCardList = () =>
    http.get<CommonResponse<UserCardResponseDto[]>>('/api/users').then(r => r.data.data);

export const getTargetUserProfile = (targetUserId: number) =>
    http
        .get<CommonResponse<UserTargetProfileResponseDto>>(`/api/users/${targetUserId}`)
        .then(r => r.data.data);

export const getProfileViewList = () =>
    http
        .get<CommonResponse<ProfileViewListResponseDto>>('/api/users/me/profile-views')
        .then(r => r.data.data);
