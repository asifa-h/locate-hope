import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import LoginForm from '../components/auth/LoginForm';

interface LocationState {
  returnTo?: string;
}

const LoginPage: React.FC = () => {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a returnTo path in location state
  const state = location.state as LocationState | null;
  const returnTo = state?.returnTo || '/dashboard';
  
  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (currentUser) {
      navigate(returnTo);
    }
  }, [currentUser, navigate, returnTo]);
  
  const handleLogin = (email: string) => {
    login(email);
    navigate(returnTo);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <LockKeyhole className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <LoginForm onLogin={handleLogin} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;