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
                    <h1 className="text-black-800 text-xl font-semibold">{title}</h1>
                    <p className="text-black-400 text-center text-base whitespace-pre-line">
                        {description}
                    </p>
                </div>
                <Link
                    to={ROUTES.ROOT}
                    className="rounded-10 bg-pink-light text-pink-point inline-flex items-center justify-center px-13 py-10 text-base font-semibold"
                >
                    홈으로
                </Link>
            </div>
        </div>
    );
}
