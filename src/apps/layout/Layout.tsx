import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div className="mx-auto flex min-h-svh w-full max-w-640 flex-col bg-white-default">
            <Outlet />
        </div>
    );
}
