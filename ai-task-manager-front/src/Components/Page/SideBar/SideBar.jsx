import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Plus, Sparkles, Bot, FileText, User, Lock, LogOut, ChevronLeft, ChevronRight, LogIn, Home, Users, BarChart2, Shield, History } from 'lucide-react';
import { isGuestUser } from '../../../App';

const SideBar = ({ workspaceMode, setWorkspaceMode }) => {
  const role = localStorage.getItem('role');
  const isGuest = isGuestUser();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const taskLinks = workspaceMode === 'admin'
    ? [
        { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Admin Stats' },
        { to: '/admin/users', icon: <Users size={18} />, label: 'Manage Users' },
        { to: '/admin/tasks', icon: <ClipboardList size={18} />, label: 'All Tasks' },
        { to: '/admin/audit-trail', icon: <History size={18} />, label: 'Audit Trail' },
        { to: '/admin/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
      ]
    : [
        { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/tasks', icon: <ClipboardList size={18} />, label: 'My Tasks', requiresAuth: true },
        { to: '/add-task', icon: <Plus size={18} />, label: 'Add Task', requiresAuth: true },
        { to: '/ai-suggestions', icon: <Sparkles size={18} />, label: 'AI Suggestions', requiresAuth: true },
      ];

  const aiToolsLinks = workspaceMode === 'admin'
    ? []
    : [
        { to: '/ai-generate', icon: <Bot size={18} />, label: 'Generate Task', requiresAuth: true },
        { to: '/ai-smart', icon: <FileText size={18} />, label: 'AI Summary', requiresAuth: true },
      ];

  const accountLinks = isGuest
    ? [{ to: '/login', icon: <LogIn size={18} />, label: 'Sign In', isExternal: true }]
    : [
        { to: '/profile', icon: <User size={18} />, label: 'Profile' },
        { to: '/change-password', icon: <Lock size={18} />, label: 'Change Password' },
        { to: '/logout', icon: <LogOut size={18} />, label: 'Logout' },
      ];

  const handleNavClick = (e, link) => {
    if (link.requiresAuth && isGuest) {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('isGuest');
      navigate('/login');
    }
    if (link.isExternal) {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('isGuest');
      navigate('/login');
    }
  };

  return (
    <div
      className={`flex flex-col ${collapsed ? 'w-[68px]' : 'w-60'} h-full overflow-y-auto transition-all duration-300 relative`}
      style={{
        background: '#0f172a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-20 bg-slate-700 hover:bg-slate-600 text-white rounded-full p-1 shadow transition-all"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo — click to go to landing page */}
      <div
        onClick={() => window.location.href = '/'}
        className={`flex items-center gap-2.5 cursor-pointer border-b border-white/[0.06] ${collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4'}`}
        title="Back to Home"
      >
        <img src="/logo1.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
        {!collapsed && (
          <span className="text-[15px] font-bold text-white tracking-tight whitespace-nowrap">
            AI Task Manager
          </span>
        )}
      </div>

      {/* Workspace Switcher for Admin */}
      {role === 'ADMIN' && (
        <div className={`border-b border-white/[0.06] bg-slate-900/40 ${collapsed ? 'py-3 flex justify-center' : 'px-4 py-3.5'}`}>
          {collapsed ? (
            <button
              onClick={() => setWorkspaceMode(workspaceMode === 'admin' ? 'user' : 'admin')}
              className={`p-2 rounded-xl transition-all ${
                workspaceMode === 'admin'
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
              }`}
              title={workspaceMode === 'admin' ? 'Switch to User Space' : 'Switch to Admin Space'}
            >
              {workspaceMode === 'admin' ? <Shield size={18} /> : <User size={18} />}
            </button>
          ) : (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                Workspace
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-white/[0.04]">
                <button
                  onClick={() => setWorkspaceMode('user')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    workspaceMode === 'user'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User size={12} />
                  User
                </button>
                <button
                  onClick={() => setWorkspaceMode('admin')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    workspaceMode === 'admin'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield size={12} />
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className={`flex-1 py-4 ${collapsed ? 'px-2' : 'px-3'} space-y-5`}>
        {/* Tasks */}
        <div>
          {!collapsed && (
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-3">
              {workspaceMode === 'admin' ? 'Administration' : 'Tasks'}
            </p>
          )}
          <nav className="flex flex-col gap-0.5">
            {taskLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavClick(e, link)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive
                      ? workspaceMode === 'admin' ? 'bg-purple-700 text-white' : 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                  }`
                }
                title={collapsed ? link.label : undefined}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
                {link.requiresAuth && isGuest && !collapsed && (
                  <Lock size={10} className="ml-auto text-amber-400" />
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* AI Tools */}
        {aiToolsLinks.length > 0 && (
          <div>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-3">
                AI Tools
              </p>
            )}
            <nav className="flex flex-col gap-0.5">
              {aiToolsLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                    }`
                  }
                  title={collapsed ? link.label : undefined}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {!collapsed && <span>{link.label}</span>}
                  {link.requiresAuth && isGuest && !collapsed && (
                    <Lock size={10} className="ml-auto text-amber-400" />
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* Separator */}
        <div className="border-t border-white/[0.06] mx-2" />

        {/* Account */}
        <div>
          {!collapsed && (
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-3">
              Account
            </p>
          )}
          <nav className="flex flex-col gap-0.5">
            {accountLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavClick(e, link)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive && !link.isExternal
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                  }`
                }
                title={collapsed ? link.label : undefined}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom: Back to Landing */}
      <div className={`border-t border-white/[0.06] ${collapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
        <button
          onClick={() => window.location.href = '/'}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-white/[0.05] hover:text-slate-300 transition-colors ${collapsed ? 'justify-center' : ''}`}
          title="Back to Landing Page"
        >
          <Home size={18} className="flex-shrink-0" />
          {!collapsed && <span>Back to Home</span>}
        </button>
      </div>
    </div>
  );
};

export default SideBar;