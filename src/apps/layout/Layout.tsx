import { Outlet } from "react-router-dom";

export function Layout() {
    return (
        <main className="flex flex-col min-h-svh">
            <Outlet />
        </main>
    );
}
