import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1 
            }}
            className="bg-blue-500 rounded-full p-2"
          >
            <Heart className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-xl font-bold text-blue-600">ShelterConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/report" className="text-gray-700 hover:text-blue-600 transition-colors">
            Report
          </Link>
          <Link to="/shelters" className="text-gray-700 hover:text-blue-600 transition-colors">
            Shelters
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
            About Us
          </Link>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 transition-colors">
                <User className="h-5 w-5" />
                <span>{currentUser.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/report" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Report
            </Link>
            <Link 
              to="/shelters" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Shelters
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 transition-colors py-2 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>{currentUser.name}</span>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors py-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors inline-block"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;