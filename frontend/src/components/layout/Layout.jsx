import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import { UpdateProvider } from './UpdateContext.jsx';

export default function Layout() {
  return (
    <UpdateProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="sm:pl-72">
          <Navbar />
          <main className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950">
            <div className="mx-auto min-h-[calc(100vh-80px)] max-w-7xl"> 
              <Outlet />
            </div>
          </main>
        </div>
        <Sidebar />
      </div>
    </UpdateProvider>
  );
}
