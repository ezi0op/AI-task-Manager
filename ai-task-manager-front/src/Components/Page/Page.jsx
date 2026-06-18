import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar/SideBar';
import Header from './Header/Header';
import Middle from './Middle/Middle';

const Page = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  
  const [workspaceMode, setWorkspaceModeState] = useState(() => {
    if (role !== 'ADMIN') return 'user';
    const saved = localStorage.getItem('workspaceMode');
    if (saved) return saved;
    return 'admin';
  });

  const setWorkspaceMode = (mode) => {
    localStorage.setItem('workspaceMode', mode);
    setWorkspaceModeState(mode);
    window.dispatchEvent(new Event('workspaceModeChange'));

    const currentPath = window.location.pathname;
    if (mode === 'admin') {
      const allowedAdminPaths = ['/dashboard', '/admin/users', '/admin/tasks', '/admin/analytics', '/profile', '/change-password'];
      if (!allowedAdminPaths.includes(currentPath)) {
        navigate('/dashboard');
      }
    } else {
      const forbiddenUserPaths = ['/admin/users', '/admin/tasks', '/admin/analytics'];
      if (forbiddenUserPaths.includes(currentPath)) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className='flex h-screen w-screen bg-slate-50 overflow-hidden font-sans'>
      <SideBar workspaceMode={workspaceMode} setWorkspaceMode={setWorkspaceMode} /> 
      <div className='flex flex-col flex-1 h-full w-full overflow-hidden relative'>
        <Header workspaceMode={workspaceMode} setWorkspaceMode={setWorkspaceMode} />
        <div className='flex-1 overflow-y-auto p-8'>
          <Middle workspaceMode={workspaceMode} />
        </div>
      </div>
    </div>
  );
};

export default Page;