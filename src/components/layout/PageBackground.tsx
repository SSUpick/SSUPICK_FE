import bg_clean from '@/assets/bg_clean.webp';

export function PageBackground() {
    return (
        <div
            aria-hidden
            className="blur-page-bg pointer-events-none fixed -inset-20 -z-10 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bg_clean})`, backgroundColor: 'lightgray' }}
        />
    );
}
