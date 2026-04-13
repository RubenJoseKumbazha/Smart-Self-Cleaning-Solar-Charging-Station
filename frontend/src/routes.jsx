import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminBenches from './pages/AdminBenches.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import BenchDetails from './pages/BenchDetails.jsx';
import Analytics from './pages/Analytics.jsx';
import Alerts from './pages/Alerts.jsx';
import Settings from './pages/Settings.jsx';
import Tokens from './pages/Tokens.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import DashboardRouter from './components/dashboard/DashboardRouter.jsx';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardRouter /> },
      { path: 'bench/:id', element: <BenchDetails /> },
      { path: 'admin/benches', element: <AdminBenches /> },
      { path: 'admin/users', element: <AdminUsers /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'tokens', element: <Tokens /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default router;
