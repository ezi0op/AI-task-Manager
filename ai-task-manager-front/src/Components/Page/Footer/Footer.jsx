import React from 'react';

const Footer = ({ dark }) => {
  return (
    <footer style={{ background: dark ? '#080e1a' : '#0f172a', padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
        <img src="/logo1.png" alt="AI Task Manager" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }} />
        <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>AI Task Manager</span>
      </div>
      <p style={{ color: '#475569', fontSize: 13 }}>
        &copy; {new Date().getFullYear()}  All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;