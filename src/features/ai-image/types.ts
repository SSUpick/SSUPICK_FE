export type AiImageStatus = 'PENDING' | 'DONE' | 'FAILED';

export type AiImageResponseDto = {
    aiImageId: number;
    status: AiImageStatus;
    originalImageUrl: string;
    generatedImageUrl: string;
    selected: boolean;
    remainingCount: number;
    totalCount: number;
};
