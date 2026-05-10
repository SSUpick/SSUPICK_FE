import type { CommonResponse } from '@/types/api';
import { http } from '@/utils/http';

import type {
    AuthKakaoLoginRequestDto,
    AuthKakaoLoginResponseDto,
    AuthReissueResponseDto,
} from './types';

export const kakaoLogin = (body: AuthKakaoLoginRequestDto) =>
    http
        .post<CommonResponse<AuthKakaoLoginResponseDto>>('/api/oauth/kakao/login', body)
        .then(r => r.data.data);

export const logout = () => http.post<CommonResponse<null>>('/api/auth/logout');

export const reissueToken = (refreshToken: string) =>
    http
        .post<CommonResponse<AuthReissueResponseDto>>(
            '/api/auth/token/reissue',
            null,
            { headers: { 'Refresh-Token': refreshToken } },
        )
        .then(r => r.data.data);

export const withdraw = () => http.delete<CommonResponse<null>>('/api/auth/withdraw');
