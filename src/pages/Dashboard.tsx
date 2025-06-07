import { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Upload, MapPin, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import DiseaseClassifier from '../components/dashboard/DiseaseClassifier';
import HospitalFinder from '../components/dashboard/HospitalFinder';
import MedicalChatbot from '../components/dashboard/MedicalChatbot';
import NotFound from './NotFound';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname.endsWith(path);
  };

  const navLinkClasses = (path: string) => {
    const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-md";
    const activeClasses = "bg-primary-100 text-primary-700";
    const inactiveClasses = "text-slate-700 hover:bg-slate-100";
    
    return `${baseClasses} ${isActivePath(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-6">
        {/* Mobile dashboard header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={toggleMobileMenu} 
            className="p-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white p-4 rounded-lg shadow-md mb-6 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <NavLink 
                to="/dashboard" 
                end
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md ${
                    isActive 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Upload className="h-5 w-5 mr-2" />
                <span>Disease Classifier</span>
              </NavLink>
              <NavLink 
                to="/dashboard/hospitals" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md ${
                    isActive 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="h-5 w-5 mr-2" />
                <span>Hospital Finder</span>
              </NavLink>
              <NavLink 
                to="/dashboard/chatbot" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md ${
                    isActive 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                <span>Medical Chatbot</span>
              </NavLink>
              <button 
                onClick={logout} 
                className="flex items-center p-3 rounded-md text-error-600 hover:bg-error-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              {/* User info */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 rounded-full p-2">
                    <User className="h-6 w-6 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="p-4 space-y-2">
                <NavLink to="/dashboard" end className={navLinkClasses('')}>
                  <Upload className="h-5 w-5 mr-3" />
                  <span>Disease Classifier</span>
                </NavLink>
                <NavLink to="/dashboard/hospitals" className={navLinkClasses('hospitals')}>
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Hospital Finder</span>
                </NavLink>
                <NavLink to="/dashboard/chatbot" className={navLinkClasses('chatbot')}>
                  <MessageSquare className="h-5 w-5 mr-3" />
                  <span>Medical Chatbot</span>
                </NavLink>
                <hr className="my-4 border-slate-200" />
                <button 
                  onClick={logout} 
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-error-600 hover:bg-error-50 w-full"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <Routes>
                <Route index element={<DiseaseClassifier />} />
                <Route path="hospitals" element={<HospitalFinder />} />
                <Route path="chatbot" element={<MedicalChatbot />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;