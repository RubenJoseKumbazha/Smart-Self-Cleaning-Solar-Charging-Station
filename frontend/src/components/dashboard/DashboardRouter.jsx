import { useAuth } from '../../context/AuthContext.jsx';
import UserDashboard from '../../pages/UserDashboard.jsx';
import AdminDashboard from '../../pages/AdminDashboard.jsx';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}
