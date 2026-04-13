import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BenchDetails from './pages/BenchDetails.jsx';
import Analytics from './pages/Analytics.jsx';
import Alerts from './pages/Alerts.jsx';
import Settings from './pages/Settings.jsx';
import Tokens from './pages/Tokens.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

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
      { index: true, element: <Dashboard /> },
      { path: 'bench/:id', element: <BenchDetails /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'tokens', element: <Tokens /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default router;
