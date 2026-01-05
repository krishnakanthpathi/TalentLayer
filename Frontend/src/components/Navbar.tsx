import React, { useState } from 'react';
import Logo from './Logo';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="mt-6 mx-auto bg-white/10 text-white backdrop-blur-md shadow-lg rounded-full w-full max-w-5xl fixed top-4 left-1/2 transform -translate-x-1/2 z-50 border border-white/20">
      <div className="px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">TalentLayer</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <button className="text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors">
                    Profile
                  </button>
                </Link>
                <span className="text-sm font-medium text-gray-300">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-100 font-medium px-5 py-2 rounded-full transition-all border border-red-500/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-white text-black hover:bg-gray-100 font-bold px-6 py-2 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-white/10">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex flex-col space-y-4 shadow-2xl">
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-gray-300 text-center py-2">Profile</Link>
              <span className="text-gray-300 text-center">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="bg-red-500/20 text-red-100 py-2 rounded-lg border border-red-500/30">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center text-gray-300 py-2">Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-white text-black text-center py-2 rounded-lg font-bold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
