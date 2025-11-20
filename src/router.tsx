import Home from './pages/main/Home';
import About from './pages/main/About';
import NotFoundPage from './pages/NotFoundPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GuideLayout from './layouts/GuideLayout';
import MainLayout from './layouts/MainLayout';
import Wrapper from './Wrapper';
import ComponentGuidePage from './pages/guide/common/ComponentGuidePage';
import PopupGuidePage from './pages/guide/common/PopupGuidePage';
import GlobalPopupGuidePage from './pages/guide/global/GlobalPopupGuidePage';
import SheetGuidePage from './pages/guide/common/SheetGuidePage';
import Detail from './pages/detail/Detail';
import SubLayout from './layouts/SubLayout';
import Training from './pages/main/Training';
import Login from './pages/auth/Login';
import RegisterJoin from './pages/auth/register/Join';
import RegisterAgree from './pages/auth/register/Agree';
import My from './pages/main/My';
import { useUserStateChanged } from './hooks/auth/useUserStateChanged';
import Calendar from './pages/party/Calendar';

const router = createBrowserRouter([
	{
		element: <Wrapper />,
		children: [
			{
				element: <MainLayout />,
				children: [
					{
						path: '/',
						element: <Home />
					},
					{
						path: '/about',
						element: <About />
					},
					{
						path: '/my',
						element: <My />
					}
				]
			},
			{
				element: <SubLayout />,
				children: [
					{
						path: '/training',
						element: <Training />
					},
					{
						path: '/detail/:id',
						element: <Detail />
					},
					{
						path: '/auth/login',
						element: <Login />
					},
					{
						path: '/auth/register/agree',
						element: <RegisterAgree />
					},
					{
						path: '/auth/register/join',
						element: <RegisterJoin />
					},
					{
						path: '/party/calendar',
						element: <Calendar />
					}
				]
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
				path: '*',
				element: <NotFoundPage />
			}
		]
	}
]);

export default function Router() {
	useUserStateChanged();

	return <RouterProvider router={router} />;
}
