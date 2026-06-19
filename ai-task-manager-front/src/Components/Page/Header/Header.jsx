import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, LogIn, Menu } from 'lucide-react';
import { isGuestUser } from '../../../App';
import api from '../../../api/axiosConfig';

const Header = ({ workspaceMode, setWorkspaceMode, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isGuest = isGuestUser();
  const email = localStorage.getItem('email') || 'User';
  const name = isGuest ? 'Guest' : email.split('@')[0];
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const role = localStorage.getItem('role') === 'ADMIN' ? 'Admin' : isGuest ? 'Guest' : 'User';

  const [profileImage, setProfileImage] = useState('');
  const [headerImageError, setHeaderImageError] = useState(false);

  useEffect(() => {
    setHeaderImageError(false);
  }, [profileImage]);

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      if (isGuest || !email || email === 'User') return;
      try {
        const response = await api.get(`/users/profile/${email}`);
        if (response.data.success && response.data.data.image) {
          setProfileImage(response.data.data.image);
        } else {
          setProfileImage('');
        }
      } catch (err) {
        console.error('Header profile image fetch error:', err);
      }
    };

    fetchHeaderProfile();
    
    window.addEventListener('storage', fetchHeaderProfile);
    return () => window.removeEventListener('storage', fetchHeaderProfile);
  }, [email, isGuest]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/dashboard': return workspaceMode === 'admin' ? 'Admin Statistics' : 'Dashboard';
      case '/tasks': return 'My Tasks';
      case '/add-task': return 'Add Task';
      case '/ai-generate': return 'AI Generator';
      case '/ai-suggestions': return 'AI Suggestions';
      case '/ai-smart': return 'Smart Insights';
      case '/profile': return 'Profile';
      case '/change-password': return 'Security';
      case '/admin/users': return 'Manage Users';
      case '/admin/tasks': return 'All Tasks';
      case '/admin/audit-trail': return 'Blockchain Audit Trail';
      case '/admin/analytics': return 'System Analytics';
      default: 
        if (location.pathname.startsWith('/tasks/')) return 'Task Details';
        return 'Dashboard';
    }
  };

  const getPageSubtext = () => {
    if (isGuest) return 'Explore the dashboard — sign in to unlock all features';
    return `Welcome back, ${capitalizedName}! 👋`;
  };

  return (
    <div className='flex justify-between items-center px-4 sm:px-8 py-4 sm:py-5 bg-white/50 backdrop-blur-sm border-b border-slate-100/60'>
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Toggle for Mobile */}
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100/80 md:hidden transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div>
          <h1 className='text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight'>{getPageTitle()}</h1>
          <p className='text-slate-400 mt-0.5 text-xs sm:text-sm font-medium hidden sm:block'>{getPageSubtext()}</p>
        </div>
      </div>
      
      <div className='flex items-center gap-3 sm:gap-4'>
        {/* User Profile / Login */}
        {isGuest ? (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('email');
              localStorage.removeItem('role');
              localStorage.removeItem('isGuest');
              navigate('/login');
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 bg-indigo-600 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
          >
            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Sign In
          </button>
        ) : (
          <div 
            className='flex items-center gap-2 sm:gap-3 cursor-pointer group'
            onClick={() => navigate('/profile')}
          >
            {profileImage && !headerImageError ? (
              <img 
                src={profileImage} 
                alt="Avatar" 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl object-cover shadow-md shadow-indigo-600/10 border border-slate-200 flex-shrink-0"
                onError={() => {
                  setHeaderImageError(true);
                }}
              />
            ) : (
              <div className='h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex justify-center items-center shadow-md shadow-indigo-600/20 flex-shrink-0'>
                <span className='text-white text-xs sm:text-sm font-bold'>{capitalizedName.charAt(0)}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className='font-bold text-xs sm:text-sm text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors'>{capitalizedName}</span>
              <span className='text-[10px] sm:text-[11px] font-medium text-slate-400'>{role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;