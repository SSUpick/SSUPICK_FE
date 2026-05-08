import { PageHeader } from '@/components/layout/PageHeader';

export function PaymentPgPage() {
    return (
        <div className="bg-white-default flex min-h-svh flex-col">
            <PageHeader title="결제하기" />
            <div className="flex flex-1 items-center justify-center">
                <p className="text-black-800 text-center text-2xl font-bold">
                    결제 화면
                    <br />
                    PG사
                </p>
            </div>
        </div>
    );
}
