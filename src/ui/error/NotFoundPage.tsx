import { ErrorView } from './ErrorView';

export function NotFoundPage() {
    return <ErrorView title="잘못된 요청입니다." description="다시 시도해주세요." />;
}
