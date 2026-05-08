import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div>
            <div className="bg-white-default mx-auto flex min-h-svh w-full max-w-3xl flex-col px-20">
                <Outlet />
            </div>
        </div>
    );
}
