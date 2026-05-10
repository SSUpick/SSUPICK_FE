export type CommonResponse<T> = {
    isSuccess: boolean;
    code: string;
    message: string;
    data: T;
};
