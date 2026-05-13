import { CONTACT } from '@/constants/contact';
import { PageHeader } from '@/components/layout/PageHeader';

import { OL } from './_parts/Article';

export function RefundPage() {
    return (
        <div className="flex w-full flex-col">
            <PageHeader title="환불 정책" />

            <div className="flex flex-col gap-24 pt-8 pb-40">
                <div className="text-black-700 flex flex-col gap-8 text-sm leading-22 tracking-tight">
                    <OL>
                        <li>
                            구매한 이용권은 결제일로부터 7일 이내, 미사용 상태인 경우에 한해 환불을
                            요청할 수 있습니다.
                        </li>
                        <li>
                            이미 프로필 상세 정보 조회에 사용된 이용권은 디지털 콘텐츠 제공이 완료된
                            것으로 보아 환불이 제한됩니다.
                        </li>
                        <li>
                            단, 서비스 오류 또는 회사의 귀책 사유로 이용권을 정상적으로 사용할 수
                            없는 경우에는 사용 여부와 관계없이 환불 또는 재지급을 요청할 수
                            있습니다.
                        </li>
                        <li>
                            환불 요청은 고객센터 이메일({CONTACT.EMAIL}) 혹은 문의 채널(
                            {CONTACT.KAKAO_CHANNEL_BASE})을 통해 접수할 수 있으며, 결제자 정보,
                            결제일, 결제 금액, 환불 사유를 함께 전달해야 합니다.
                        </li>
                        <li>
                            환불은 결제 수단과 동일한 방식으로 처리되며, 결제대행사 및 카드사 사정에
                            따라 실제 환불 완료까지 영업일 기준 일정 기간이 소요될 수 있습니다.
                        </li>
                        <li>
                            이벤트, 프로모션, 무료 지급 이용권은 현금 환불 대상에 해당하지 않습니다.
                        </li>
                        <li>
                            부정 이용, 허위 정보 등록, 타인의 개인정보 침해, 서비스 운영정책
                            위반으로 이용이 제한된 경우에는 환불이 제한될 수 있습니다.
                        </li>
                    </OL>
                </div>
            </div>
        </div>
    );
}
