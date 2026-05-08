import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import errorImage from '@/assets/error.webp';

type ErrorViewProps = {
    title: string;
    description: string;
};

export function ErrorView({ title, description }: ErrorViewProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-14 px-24">
            <img src={errorImage} alt="" className="h-184 w-184" />
            <div className="flex w-full flex-col items-center gap-33">
                <div className="flex flex-col items-center gap-20">
                    <h1 className="text-xl font-semibold text-black-800">{title}</h1>
                    <p className="whitespace-pre-line text-center text-base text-black-400">
                        {description}
                    </p>
                </div>
                <Link
                    to={ROUTES.ROOT}
                    className="rounded-10 bg-pink-light px-13 py-10 text-base font-semibold text-pink-point"
                >
                    홈으로
                </Link>
            </div>
        </div>
    );
}
