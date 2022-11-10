import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import CategoryPage from './pages/CategoryPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SignupPage from './pages/SignupPage';
import VerifyRegister from './sections/auth/login/VerifyRegister';
import WalletPage from './pages/WalletPage';
import TransactionPage from './pages/TransactionPage';
import LogoutPage from './pages/LogoutPage';
import ReportPage from './pages/ReportPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/transaction" />, index: true },
        { path: 'transaction', element: <TransactionPage /> },
        { path: 'report', element: <ReportPage /> },
        { path: 'profile', element: <UserPage /> },
        { path: 'category', element: <CategoryPage /> },
        { path: 'wallet', element: <WalletPage /> },
        {
          path: 'logout',
          element: <LogoutPage />,
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },

    {
      path: '/signup',
      element: <SignupPage />,
    },
    {
      path: '/register/user/:id',
      element: <VerifyRegister />,
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/transaction" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
