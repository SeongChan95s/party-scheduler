import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UsersPage from './pages/user/UsersPage';
import UserDetailPage from './pages/user/UserDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/about',
		element: <AboutPage />
	},
	{
		path: '/user',
		element: <UsersPage />
	},
	{
		path: '/user/:id',
		element: <UserDetailPage />
	},
	{
		path: '*',
		element: <NotFoundPage />
	}
]);

export default function Router() {
	return <RouterProvider router={router} />;
}
