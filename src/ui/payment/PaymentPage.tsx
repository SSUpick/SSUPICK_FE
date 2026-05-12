import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import couponImg from '@/assets/coupon.webp';
import { CtaButton } from '@/components/button/CtaButton';
import { ChevronRightIcon } from '@/components/icon/ChevronRightIcon';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCheckout } from '@/features/payment/hooks/useCheckout';
import type { CouponProduct } from '@/features/payment/types';

import { PhoneNumberModal } from './PhoneNumberModal';

const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

type AccordionItemProps = {
    title: string;
    children: React.ReactNode;
};

function AccordionItem({ title, children }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-black-200 border-b">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="flex w-full items-center justify-between py-16"
            >
                <span className="text-black-700 text-sm font-medium">{title}</span>
                <ChevronRightIcon
                    className={`text-black-400 size-18 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                />
            </button>
            {isOpen && <div className="pb-16">{children}</div>}
        </div>
    );
}

export function PaymentPage() {
    const [params] = useSearchParams();
    const count = Number(params.get('count') ?? '1');
    const price = Number(params.get('price') ?? '1000');
    const product = (params.get('product') ?? 'COUPON_1') as CouponProduct;

    const [method, setMethod] = useState<'card' | null>('card');
    const [agreed, setAgreed] = useState(false);

    const { checkout, isPending, isPhoneModalOpen, closePhoneModal, onPhoneRegistered } =
        useCheckout(product);

    return (
        <>
            <PhoneNumberModal
                open={isPhoneModalOpen}
                onClose={closePhoneModal}
                onSuccess={onPhoneRegistered}
            />
            <div className="bg-white-default flex min-h-svh flex-col">
                <PageHeader title="결제하기" />

                {/* 상품 정보 — 항상 노출 */}
                <section className="py-20">
                    <div className="flex items-start gap-14">
                        <img
                            src={couponImg}
                            alt=""
                            aria-hidden
                            className="mt-2 size-58 shrink-0 object-contain"
                        />
                        <div className="flex flex-col gap-6">
                            <span className="text-black-800 text-base font-bold">
                                프로필 조회 이용권 {count}개
                            </span>
                            <p className="text-black-500 text-xs leading-18 tracking-tight">
                                슈픽 서비스 내에서 축제 참여자가 공개에 동의한 프로필 상세 정보를
                                1회 확인할 수 있는 디지털 이용권입니다.
                            </p>
                        </div>
                    </div>
                    <div className="border-black-200 mt-16 flex flex-col gap-10 border-t pt-16">
                        <div className="flex items-center justify-between">
                            <span className="text-black-500 text-xs font-medium">결제 금액</span>
                            <span className="text-black-800 text-xl font-bold">
                                {formatPrice(price)}
                            </span>
                        </div>
                        <ul className="text-black-400 flex flex-col gap-4 text-xs tracking-tight">
                            <li>결제 완료 후 즉시 지급</li>
                            <li>이용권 1개당 프로필 상세 정보 1회 확인</li>
                        </ul>
                    </div>
                </section>

                <div className="bg-black-100 -mx-20 h-8" />

                {/* 결제 방법 */}
                <section className="flex flex-col gap-12 py-20">
                    <h2 className="text-black-800 text-base font-semibold">결제 방법</h2>
                    <button
                        type="button"
                        onClick={() => setMethod('card')}
                        className={`rounded-10 bg-white-default flex h-58 w-full items-center justify-center border text-base font-medium ${
                            method === 'card'
                                ? 'border-pink-point text-pink-point'
                                : 'border-black-300 text-black-800'
                        }`}
                    >
                        신용 · 체크카드
                    </button>
                </section>

                <div className="bg-black-100 -mx-20 h-8" />

                {/* 아코디언 — 상품 정보 / 환불 안내 / 주의사항 */}
                <section className="border-black-200 border-t">
                    <AccordionItem title="상품 정보">
                        <dl className="text-xs tracking-tight">
                            {(
                                [
                                    ['상품명', `프로필 조회 이용권 ${count}개`],
                                    ['가격', formatPrice(price)],
                                    ['지급 방식', '결제 완료 후 즉시 지급'],
                                    ['사용 횟수', '이용권 1개당 프로필 상세 정보 1회 확인'],
                                ] as const
                            ).map(([label, value]) => (
                                <div key={label} className="mb-6 flex gap-12 last:mb-0">
                                    <dt className="text-black-400 w-56 shrink-0">{label}</dt>
                                    <dd className="text-black-600">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </AccordionItem>

                    <AccordionItem title="환불 안내">
                        <ul className="flex flex-col gap-6 text-xs leading-18 tracking-tight">
                            {[
                                '구매한 프로필 조회 이용권은 결제일로부터 7일 이내, 사용하지 않은 경우에 한해 환불을 요청할 수 있습니다.',
                                '이미 프로필 상세 정보 조회에 사용된 이용권은 디지털 콘텐츠 제공이 완료된 것으로 보아 환불이 제한됩니다.',
                                '중복 결제, 이용권 미지급, 시스템 오류 등 회사의 귀책 사유가 확인되는 경우 환불 또는 재지급 처리됩니다.',
                                '환불은 결제 수단과 동일한 방식으로 처리됩니다.',
                                '이벤트, 프로모션, 무료 지급 이용권은 현금 환불 대상에 해당하지 않습니다.',
                            ].map(item => (
                                <li key={item} className="flex items-start gap-4">
                                    <span className="text-black-400 mt-1 shrink-0">·</span>
                                    <span className="text-black-500">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionItem>

                    <AccordionItem title="주의사항">
                        <ul className="flex flex-col gap-6 text-xs leading-18 tracking-tight">
                            {[
                                '슈픽은 사용자 간 연결을 돕는 서비스이며, 만남이나 관계 형성 결과를 보장하지 않습니다.',
                                '프로필 정보는 사용자가 공개 및 제공에 동의한 범위 내에서만 조회됩니다.',
                                '타인의 정보를 무단 수집, 저장, 유포하거나 스팸성 연락에 이용하는 행위는 금지됩니다.',
                            ].map(item => (
                                <li key={item} className="flex items-start gap-4">
                                    <span className="text-black-400 mt-1 shrink-0">·</span>
                                    <span className="text-black-500">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionItem>

                    <AccordionItem title="사업자 정보">
                        <dl className="text-xs tracking-tight">
                            {(
                                [
                                    ['상호', '슈픽'],
                                    ['서비스명', '슈픽(SSUpick)'],
                                    ['대표자', '백승현'],
                                    ['사업자등록번호', '2824501301'],
                                    ['이메일', 'seunghyun020907@naver.com'],
                                    ['문의 채널', 'pf.kakao.com/_xjJrxbX/chat'],
                                ] as const
                            ).map(([label, value]) => (
                                <div key={label} className="mb-6 flex gap-12 last:mb-0">
                                    <dt className="text-black-400 w-72 shrink-0">{label}</dt>
                                    <dd className="text-black-600 break-all">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </AccordionItem>
                </section>

                {/* 동의 체크박스 */}
                <label className="flex cursor-pointer items-start gap-10 py-16">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="accent-pink-point mt-1 size-16 shrink-0"
                    />
                    <span className="text-black-500 text-xs leading-18 tracking-tight">
                        상품 정보, 환불 안내 및 주의사항을 확인했으며, 결제에 동의합니다.
                    </span>
                </label>

                <div className="mt-auto pb-22">
                    <CtaButton
                        className="w-full"
                        onClick={() => checkout()}
                        disabled={method === null || !agreed || isPending}
                        loading={isPending}
                    >
                        {formatPrice(price)} 결제하기
                    </CtaButton>
                </div>
            </div>
        </>
    );
}
