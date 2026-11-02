import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import ProgramDetail from './pages/ProgramDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}


function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoute />}>
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}