import { PageHeader } from '@/components/layout/PageHeader';

export function PaymentPgPage() {
    return (
        <div className="flex min-h-svh flex-col bg-white-default">
            <PageHeader title="결제하기" />
            <div className="flex flex-1 items-center justify-center">
                <p className="text-center text-2xl font-bold text-black-800">
                    결제 화면
                    <br />
                    PG사
                </p>
            </div>
        </div>
    );
}
