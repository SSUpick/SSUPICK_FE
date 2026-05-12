import { PageHeader } from '@/components/layout/PageHeader';

export function CardDetailSkeleton() {
    return (
        <div className="relative flex min-h-dvh animate-pulse flex-col">
            <PageHeader title={<div className="bg-black-200 rounded-4 h-20 w-60" />} />

            <main className="flex flex-1 flex-col items-center gap-13 pt-12 pb-22">
                <div className="bg-black-200 rounded-14 aspect-308/385 w-full" />

                <div className="flex flex-col items-center gap-10">
                    <div className="flex items-center gap-7">
                        <div className="bg-black-200 rounded-4 h-22 w-80" />
                        <div className="bg-black-200 rounded-6 h-28 w-52" />
                    </div>
                    <div className="flex flex-col items-center gap-10">
                        <div className="bg-black-200 rounded-4 h-16 w-72" />
                        <div className="bg-black-200 rounded-4 h-16 w-60" />
                        <div className="bg-black-200 rounded-4 h-16 w-48" />
                    </div>
                </div>

                <section className="mt-auto flex w-full flex-col gap-16">
                    <div className="flex items-center gap-6">
                        <div className="bg-black-200 rounded-4 size-24" />
                        <div className="bg-black-200 rounded-4 h-20 w-56" />
                    </div>
                    <div className="bg-black-200 rounded-20 h-82 w-full" />
                </section>
            </main>
        </div>
    );
}
