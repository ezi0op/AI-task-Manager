import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Page from './Components/Page/Page';
import LogIn from './Components/Page/Login/LogIn';
import Register from './Components/Page/Login/Register';
import LandingPage from './Components/Page/Landing/LandingPage';
import api from './api/axiosConfig';

const GUEST_EMAIL = 'guest@example.com';

export const isGuestUser = () => {
  const email = localStorage.getItem('email');
  return !email || email === GUEST_EMAIL;
};

const PrivateRoute = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        setIsReady(true);
        return;
      }
      try {
        // Attempt to login as a default guest user
        const loginRes = await api.post('/auth/login', { 
          email: GUEST_EMAIL, 
          password: 'guestpassword123' 
        });
        
        if (loginRes.data.success) {
          localStorage.setItem('token', loginRes.data.data.token);
          localStorage.setItem('email', loginRes.data.data.email);
          localStorage.setItem('role', loginRes.data.data.role);
          localStorage.setItem('isGuest', 'true');
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If login fails, user might not exist, so register them
        try {
          const regRes = await api.post('/auth/register', {
            name: 'Guest User',
            email: GUEST_EMAIL,
            password: 'guestpassword123',
            image: ''
          });
          if (regRes.data.success) {
            const loginRes = await api.post('/auth/login', { 
              email: GUEST_EMAIL, 
              password: 'guestpassword123' 
            });
            if (loginRes.data.success) {
              localStorage.setItem('token', loginRes.data.data.token);
              localStorage.setItem('email', loginRes.data.data.email);
              localStorage.setItem('role', loginRes.data.data.role);
              localStorage.setItem('isGuest', 'true');
              setIsAuthenticated(true);
            }
          }
        } catch (regError) {
          console.error('Auto-login/register failed', regError);
        }
      }
      setIsReady(true);
    };

    autoLogin();
  }, []);

  if (!isReady) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, background: '#f8f9ff',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}>
        <div style={{
          width: 44, height: 44, border: '4px solid #e0e7ff',
          borderTop: '4px solid #6366f1', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public landing page — no login needed */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<Register />} />

      {/* Protected app routes — all wrapped in Page layout */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Page />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;