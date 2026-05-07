import { ErrorView } from './ErrorView';

export function ServerErrorPage() {
    return (
        <ErrorView
            title="네트워크 상태를 확인해주세요."
            description={'서버와의 통신이 원활하지 않아\n데이터를 불러올 수 없습니다.'}
        />
    );
}
