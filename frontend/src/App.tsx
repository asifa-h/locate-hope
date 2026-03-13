import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import ReportPage from './pages/ReportPage';
import AdminDashboard from './pages/AdminDashboard';
import NgoDashboard from './pages/NgoDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: string[];
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  LH
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-base font-semibold text-slate-900">
                    LocateHope
                  </span>
                  <span className="text-xs text-slate-500">
                    Community Rescue Network
                  </span>
                </div>
              </Link>
              <nav className="hidden items-center gap-4 text-sm md:flex">
                <Link to="/#how-it-works" className="text-slate-600 hover:text-blue-600">
                  How it works
                </Link>
                <Link to="/#about" className="text-slate-600 hover:text-blue-600">
                  About
                </Link>
              </nav>
            </div>
            <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                {user.role === 'user' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-slate-700 hover:text-blue-600"
                    >
                      My dashboard
                    </Link>
                    <Link
                      to="/report"
                      className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                      Report a case
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                  >
                    Admin dashboard
                  </Link>
                )}
                {user.role === 'ngo' && (
                  <Link
                    to="/ngo"
                    className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
                  >
                    NGO dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute roles={['user']}>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo"
            element={
              <ProtectedRoute roles={['ngo']}>
                <NgoDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} LocateHope.</span>
          <span>Built for communities in need.</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
