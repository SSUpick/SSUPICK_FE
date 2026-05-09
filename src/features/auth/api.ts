import type { CommonResponse } from '@/types/api';
import { http } from '@/utils/http';

import type { AuthKakaoLoginRequestDto, AuthKakaoLoginResponseDto } from './types';

export const kakaoLogin = (body: AuthKakaoLoginRequestDto) =>
    http
        .post<CommonResponse<AuthKakaoLoginResponseDto>>('/api/oauth/kakao/login', body)
        .then((r) => r.data.data);
