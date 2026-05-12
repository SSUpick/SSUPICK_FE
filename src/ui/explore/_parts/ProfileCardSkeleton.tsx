export function ProfileCardSkeleton() {
    return (
        <div className="flex w-full animate-pulse flex-col items-start gap-7">
            <div className="bg-black-200 rounded-8 aspect-3/4 w-full" />
            <div className="flex w-full flex-col items-start gap-2">
                <div className="flex items-center gap-4">
                    <div className="bg-black-200 size-15 rounded-full" />
                    <div className="bg-black-200 rounded-4 h-14 w-50" />
                    <div className="bg-black-200 rounded-4 h-18 w-28" />
                </div>
                <div className="flex flex-col items-start gap-2">
                    <div className="bg-black-200 rounded-2 h-12 w-56" />
                    <div className="bg-black-200 rounded-2 h-12 w-44" />
                    <div className="bg-black-200 rounded-2 h-12 w-36" />
                </div>
            </div>
        </div>
    );
}
