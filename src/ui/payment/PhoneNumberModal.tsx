import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { CtaButton } from '@/components/button/CtaButton';
import { Modal } from '@/components/feedback/Modal';
import { TextInput } from '@/components/input/TextInput';
import { updateUserProfile } from '@/features/user/api';
import { toast } from '@/store/toastStore';

type PhoneNumberModalProps = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function PhoneNumberModal({ open, onClose, onSuccess }: PhoneNumberModalProps) {
    const [phone, setPhone] = useState('');

    const isValid = /^010-\d{4}-\d{4}$/.test(phone);
    const isError = phone.length > 0 && !isValid;

    const { mutate: registerContact, isPending } = useMutation({
        mutationFn: () => updateUserProfile({ contact: phone }),
        onSuccess: () => {
            setPhone('');
            onSuccess();
        },
        onError: () => {
            toast.error('전화번호 등록에 실패했어요. 다시 시도해주세요.');
        },
    });

    const handleClose = () => {
        setPhone('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="bg-white-default rounded-20 flex flex-col gap-24 px-24 py-28">
                <div className="flex flex-col gap-8">
                    <p className="text-black-800 text-base font-bold leading-24">
                        결제 및 환불 안내를 위해 연락 가능한 휴대폰 번호를 입력해주세요.
                    </p>
                    <p className="text-black-400 text-sm leading-20 tracking-tight">
                        입력한 번호는 결제 확인, 환불 처리, 고객 문의 대응 목적으로만 사용됩니다.
                    </p>
                </div>
                <TextInput
                    type="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    valid={isValid}
                    error={isError}
                />
                <div className="flex gap-8">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-black-100 text-black-500 rounded-14 h-58 flex-1 text-lg font-medium"
                    >
                        취소
                    </button>
                    <CtaButton
                        className="flex-1"
                        onClick={() => registerContact()}
                        disabled={!isValid || isPending}
                        loading={isPending}
                    >
                        확인
                    </CtaButton>
                </div>
            </div>
        </Modal>
    );
}
