import { PageHeader } from '@/components/layout/PageHeader';

export function TermsPage() {
    return (
        <div className="flex min-h-svh flex-col bg-white-default">
            <PageHeader title="이용약관" />
            <div className="flex flex-1 flex-col gap-14 px-22 py-22 text-sm leading-22 text-black-700">
                <p>슈픽 서비스 이용약관 본문이 들어갑니다.</p>
                <p>본 약관은 슈픽 서비스 이용에 관한 제반 사항을 규정합니다.</p>
                {/* TODO: 약관 본문 연동 */}
            </div>
        </div>
    );
}
