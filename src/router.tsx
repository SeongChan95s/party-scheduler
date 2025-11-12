import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UsersPage from './pages/user/UsersPage';
import UserDetailPage from './pages/user/UserDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GuideLayout from './layouts/GuideLayout';
import MainLayout from './layouts/MainLayout';
import Wrapper from './Wrapper';
import ComponentGuidePage from './pages/guide/common/ComponentGuidePage';
import PopupGuidePage from './pages/guide/common/PopupGuidePage';
import GlobalPopupGuidePage from './pages/guide/global/GlobalPopupGuidePage';
import SheetGuidePage from './pages/guide/common/SheetGuidePage';

const router = createBrowserRouter([
	{
		element: <Wrapper />,
		children: [
			{
				element: <MainLayout />,
				children: [
					{
						path: '/',
						element: <HomePage />
					}
				]
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
				element: <GuideLayout />,
				children: [
					{
						path: '/guide/common/component',
						element: <ComponentGuidePage />
					},
					{
						path: '/guide/common/popup',
						element: <PopupGuidePage />
					},
					{
						path: '/guide/common/sheet',
						element: <SheetGuidePage />
					},
					{
						path: '/guide/global/popup',
						element: <GlobalPopupGuidePage />
					}
				]
			},
			{
				path: '/user/:id',
				element: <UserDetailPage />
			},
			{
				path: '*',
				element: <NotFoundPage />
			}
		]
	}
]);

export default function Router() {
	return <RouterProvider router={router} />;
}
