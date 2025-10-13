import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UsersPage from '@/pages/user/UsersPage';
import UserDetailPage from '@/pages/user/UserDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/user',
    element: <UsersPage />,
  },
  {
    path: '/user/:id',
    element: <UserDetailPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
