import { lazy } from 'react';
import HomePage from './pages/main/HomePage';
import PartyPage from './pages/main/PartyPage';
import NotFoundPage from './pages/NotFoundPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GuideLayout from './layouts/GuideLayout';
import MainLayout from './layouts/MainLayout';
import SubLayout from './layouts/SubLayout';
import JoinPage from './pages/auth/register/JoinPage';
import AgreePage from './pages/auth/register/AgreePage';
import MyPage from './pages/main/MyPage';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import ChatPage from './pages/main/ChatPage';
import SelectSchedulePage from './pages/party/SelectSchedule';
import KakaoRedirectPage from './pages/auth/oauth/KakaoRedirectPage';
import NaverRedirectPage from './pages/auth/oauth/NaverRedirectPage';
import LoginPage from './pages/auth/login/LoginPage';
import EmailLoginPage from './pages/auth/login/EmailLoginPage';
import CenterLayout from './layouts/CenterLayout';

const ComponentGuidePage = lazy(() => import('./pages/guide/common/ComponentGuidePage'));
const PopupGuidePage = lazy(() => import('./pages/guide/common/PopupGuidePage'));
const GlobalPopupGuidePage = lazy(
	() => import('./pages/guide/global/GlobalPopupGuidePage')
);
const SheetGuidePage = lazy(() => import('./pages/guide/common/SheetGuidePage'));

const router = createBrowserRouter([
	{
		element: <MainLayout />,
		children: [
			{
				path: '/',
				element: <HomePage />
			},
			{
				path: '/party',
				element: <PartyPage />
			},
			{
				path: '/chat',
				element: <ChatPage />
			},
			{
				path: '/my',
				element: <MyPage />
			}
		]
	},
	{
		path: '/auth',
		middleware: [AuthMiddleware],
		children: [
			{
				path: 'login',
				element: <SubLayout />,
				children: [
					{
						path: '',
						element: <LoginPage />
					},
					{
						path: 'email',
						element: <EmailLoginPage />
					}
				]
			},
			{
				path: 'register',
				element: <SubLayout />,
				children: [
					{
						path: 'agree',
						element: <AgreePage />
					},
					{
						path: 'join',
						element: <JoinPage />
					}
				]
			},
			{
				path: 'oauth',
				element: <CenterLayout />,
				children: [
					{
						path: 'kakao/callback',
						element: <KakaoRedirectPage />
					},
					{
						path: 'naver/callback',
						element: <NaverRedirectPage />
					}
				]
			}
		]
	},
	{
		element: <SubLayout />,
		path: '/party',
		children: [
			{
				path: 'select-schedule',
				element: <SelectSchedulePage />
			}
		]
	},
	{
		element: <GuideLayout />,
		path: '/guide',
		children: [
			{
				path: 'common/component',
				element: <ComponentGuidePage />
			},
			{
				path: 'common/popup',
				element: <PopupGuidePage />
			},
			{
				path: 'common/sheet',
				element: <SheetGuidePage />
			},
			{
				path: 'global/popup',
				element: <GlobalPopupGuidePage />
			}
		]
	},
	{
		path: '*',
		element: <NotFoundPage />
	}
]);

export default function Router() {
	return <RouterProvider router={router} />;
}
