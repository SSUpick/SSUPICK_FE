import { RouterProvider } from 'react-router-dom';
import { router } from '@/apps/router';

export function App() {
    return <RouterProvider router={router} />;
}
