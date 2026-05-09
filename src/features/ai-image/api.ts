import type { CommonResponse } from '@/types/api';
import { http } from '@/utils/http';

import type { AiImageResponseDto } from './types';

export const generateAiImage = (file: File) => {
    const form = new FormData();
    form.append('originalImage', file);
    return http
        .post<CommonResponse<AiImageResponseDto>>('/api/ai-images', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data.data);
};

export const getAiImageStatus = (aiImageId: number) =>
    http
        .get<CommonResponse<AiImageResponseDto>>(`/api/ai-images/${aiImageId}/status`)
        .then((r) => r.data.data);

export const selectAiImage = (aiImageId: number) =>
    http.patch(`/api/ai-images/${aiImageId}/select`).then(() => undefined);
