import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">SkinHealth</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-primary-600 font-medium">
              Home
            </Link>
            <Link to="/#about" className="text-slate-700 hover:text-primary-600 font-medium">
              About
            </Link>
            <Link to="/#services" className="text-slate-700 hover:text-primary-600 font-medium">
              Services
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-700 hover:text-primary-600 font-medium">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-slate-700 hover:text-primary-600"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-slate-700 hover:text-primary-600 font-medium"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/#about" 
              className="block text-slate-700 hover:text-primary-600 font-medium"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/#services" 
              className="block text-slate-700 hover:text-primary-600 font-medium"
              onClick={closeMenu}
            >
              Services
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block text-slate-700 hover:text-primary-600 font-medium"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full btn btn-outline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="block w-full btn btn-primary text-center"
                onClick={closeMenu}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;