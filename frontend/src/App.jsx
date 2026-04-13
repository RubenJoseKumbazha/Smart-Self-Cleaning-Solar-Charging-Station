import { RouterProvider } from 'react-router-dom';
import router from './routes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TokenProvider } from './context/TokenContext.jsx';

export default function App() {
  return (
    <AuthProvider>
      <TokenProvider>
        <RouterProvider router={router} />
      </TokenProvider>
    </AuthProvider>
  );
}
