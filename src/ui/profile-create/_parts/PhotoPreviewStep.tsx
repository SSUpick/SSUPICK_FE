import { useMemo, useRef } from 'react';

import { CtaButton } from '@/components/button/CtaButton';

import { BackdropScene } from './BackdropScene';

type PhotoPreviewStepProps = {
    file: File;
    onConfirm: () => void;
    onChangePhoto: (file: File) => void;
};

export function PhotoPreviewStep({ file, onConfirm, onChangePhoto }: PhotoPreviewStepProps) {
    // blob URL은 페이지 세션 동안 남지만, 사진 선택은 1~수회뿐이라 누수 영향 미미
    // (이전에 useEffect cleanup으로 revoke했더니 StrictMode 이중 mount에서 revoke된 URL을 다시 참조하는 버그가 있었음)
    const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePick = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.files?.[0];
        e.target.value = '';
        if (!next) return;
        onChangePhoto(next);
    };

    return (
        <BackdropScene>
            <section className="flex w-full flex-1 flex-col items-center justify-center gap-46">
                <p className="text-black-800 text-28 text-center font-semibold">
                    이 사진으로 할까?
                </p>

                <button
                    type="button"
                    onClick={handlePick}
                    aria-label="사진 다시 선택"
                    className="rounded-20 h-360 w-260 overflow-hidden"
                >
                    <img
                        src={previewUrl}
                        alt="업로드한 사진"
                        className="h-full w-full object-cover"
                    />
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    hidden
                    onChange={handleChange}
                />
            </section>

            <div className="pb-30">
                <CtaButton className="w-full" onClick={onConfirm}>
                    응, 이걸로 할래.
                </CtaButton>
            </div>
        </BackdropScene>
    );
}
