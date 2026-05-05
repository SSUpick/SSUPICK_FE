import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <main className="flex flex-col min-h-svh">
            <Outlet />
        </main>
    );
}

export default Layout;
