import HomePage from './pages/main/HomePage';
import PartyPage from './pages/main/PartyPage';
import NotFoundPage from './pages/NotFoundPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GuideLayout from './layouts/GuideLayout';
import MainLayout from './layouts/MainLayout';
import ComponentGuidePage from './pages/guide/common/ComponentGuidePage';
import PopupGuidePage from './pages/guide/common/PopupGuidePage';
import GlobalPopupGuidePage from './pages/guide/global/GlobalPopupGuidePage';
import SheetGuidePage from './pages/guide/common/SheetGuidePage';
import SubLayout from './layouts/SubLayout';
import JoinPage from './pages/auth/register/JoinPage';
import AgreePage from './pages/auth/register/AgreePage';
import MyPage from './pages/main/MyPage';
import LoginPage from './pages/auth/LoginPage';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import ChatPage from './pages/main/ChatPage';
import SelectSchedulePage from './pages/party/SelectSchedule';
import KakaoRedirectPage from './pages/auth/oauth/KakaoRedirectPage';
import ProfileCompletePage from './pages/auth/ProfileCompletePage';
import NaverRedirectPage from './pages/auth/oauth/NaverRedirectPage';

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
		element: <SubLayout />,
		path: '/auth',
		children: [
			{
				path: 'login',
				element: <LoginPage />,
				middleware: [AuthMiddleware]
			},
			{
				path: 'register',
				children: [
					{
						path: 'agree',
						element: <AgreePage />,
						middleware: [AuthMiddleware]
					},
					{
						path: 'join',
						element: <JoinPage />,
						middleware: [AuthMiddleware]
					}
				]
			},
			{
				path: 'oauth',
				middleware: [AuthMiddleware],
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
			},
			{
				path: 'profile-complete',
				element: <ProfileCompletePage />
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
