import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div>
            <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col bg-white-default px-20">
                <Outlet />
            </div>
        </div>
    );
}
