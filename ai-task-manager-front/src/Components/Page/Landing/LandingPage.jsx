import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot, Sparkles, CheckSquare, Zap, BarChart3, ShieldCheck, ArrowRight, Moon, Sun,
} from 'lucide-react';
import Footer from '../Footer/Footer';

/* ─── inline styles for blob animation (no Tailwind plugin needed) ─── */
const blobStyle = `
  @keyframes blob {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-50px) scale(1.1); }
    66%      { transform: translate(-20px,20px) scale(0.9); }
  }
  .blob { animation: blob 7s infinite; }
  .blob-delay-2 { animation-delay: 2s; }
  .blob-delay-4 { animation-delay: 4s; }
`;

const NAV_LINKS = ['Features'];

/* ── tiny avatar component using DiceBear (no real photos needed) ─── */
const Avatar = ({ seed, style = {} }) => (
  <img
    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
    alt="user avatar"
    style={{
      width: 36, height: 36, borderRadius: '50%', border: '2px solid white',
      marginLeft: -8, objectFit: 'cover', background: '#e0e7ff', ...style,
    }}
  />
);

const Stars = ({ count = 5 }) => (
  <span style={{ color: '#f59e0b', fontSize: 18, letterSpacing: 1 }}>
    {'★'.repeat(count)}
  </span>
);

const LandingPage = () => {
  const [dark, setDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const bg = dark ? '#0f172a' : '#f8f9ff';
  const cardBg = dark ? '#1e293b' : '#ffffff';
  const textPrimary = dark ? '#f1f5f9' : '#0f172a';
  const textSecondary = dark ? '#94a3b8' : '#475569';
  const navBg = dark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.88)';
  const navBorder = dark ? 'rgba(99,102,241,0.18)' : 'rgba(226,232,240,0.7)';

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', 'Segoe UI', sans-serif", color: textPrimary, transition: 'background 0.3s' }}>
      <style>{blobStyle}</style>

      {/* ══════════════ NAVIGATION BAR ══════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${navBorder}`,
        transition: 'background 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 68 }}>

          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minWidth: 200, cursor: 'pointer' }}
          >
            <img src="/logo1.png" alt="AI Task Manager" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
            <span style={{ fontWeight: 800, fontSize: 17, color: textPrimary, letterSpacing: '-0.3px' }}>
              AI Task Manager
            </span>
          </div>

          {/* Centre nav links */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 32 }}>
            {NAV_LINKS.map(label => (
              <button
                key={label}
                onClick={() => {
                  const el = document.getElementById(label.toLowerCase().replace(/\s+/, '-'));
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 500, color: textSecondary,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#6366f1'}
                onMouseLeave={e => e.target.style.color = textSecondary}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right-side actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200, justifyContent: 'flex-end' }}>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(d => !d)}
              style={{
                background: dark ? '#1e293b' : '#f1f5f9', border: `1px solid ${navBorder}`,
                borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', color: textSecondary,
                transition: 'background 0.2s',
              }}
              title="Toggle dark mode"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: '#6366f1', color: 'white', border: 'none',
                  borderRadius: 10, padding: '8px 20px', fontWeight: 600,
                  fontSize: 14, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { e.target.style.background = '#4f46e5'; e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.target.style.background = '#6366f1'; e.target.style.transform = 'none'; }}
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: textPrimary, fontWeight: 600, fontSize: 14,
                    textDecoration: 'none', padding: '8px 14px',
                    border: `1px solid ${navBorder}`, borderRadius: 10,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#6366f1';
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.background = dark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = textPrimary;
                    e.currentTarget.style.borderColor = navBorder;
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO SECTION ══════════════ */}
      <section style={{ paddingTop: 140, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        {/* Soft blob background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="blob" style={{ position: 'absolute', top: -80, left: '5%', width: 420, height: 420, background: 'rgba(167,139,250,0.25)', borderRadius: '50%', filter: 'blur(90px)' }} />
          <div className="blob blob-delay-2" style={{ position: 'absolute', top: -60, right: '8%', width: 360, height: 360, background: 'rgba(99,102,241,0.18)', borderRadius: '50%', filter: 'blur(90px)' }} />
          <div className="blob blob-delay-4" style={{ position: 'absolute', bottom: 0, left: '30%', width: 320, height: 320, background: 'rgba(139,92,246,0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: 640 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: dark ? 'rgba(99,102,241,0.15)' : '#ede9fe',
              border: `1px solid ${dark ? 'rgba(139,92,246,0.3)' : '#ddd6fe'}`,
              borderRadius: 999, padding: '6px 16px', marginBottom: 28,
            }}>
              <Sparkles size={14} color="#7c3aed" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed' }}>
                Smart Tasks. Better Productivity.
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(42px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px', color: textPrimary, letterSpacing: '-1.5px' }}>
              Let AI help you<br />
              be more{' '}
              <span style={{
                color: '#7c3aed',
                background: dark ? 'transparent' : 'none',
              }}>
                productive!
              </span>
            </h1>

            {/* Sub-text */}
            <p style={{ fontSize: 17, color: textSecondary, lineHeight: 1.7, marginBottom: 36, maxWidth: 500 }}>
              AI Task Manager helps you organize tasks, get smart suggestions and track progress — all in one place.
            </p>

            {/* CTA buttons — only Get Started Free */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 48 }}>
              <button
                onClick={() => navigate(isLoggedIn ? '/dashboard' : '/register')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#6366f1', color: 'white', border: 'none',
                  borderRadius: 12, padding: '14px 28px', fontSize: 16, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                  transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.35)'; }}
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES SECTION ══════════════ */}
      <section id="features" style={{ padding: '96px 24px', background: dark ? '#0f172a' : '#ffffff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', letterSpacing: 1, textTransform: 'uppercase' }}>Capabilities</span>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: textPrimary, marginTop: 10, letterSpacing: '-0.5px' }}>
              Everything you need to stay organized
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, justifyItems: 'center' }}>
            {[
              { icon: <Bot size={26} />, color: '#3b82f6', bg: '#eff6ff', darkBg: '#1e3a5f', label: 'AI Task Generation', desc: 'Describe your goal and our AI automatically breaks it into actionable sub-tasks in seconds.' },
              { icon: <Sparkles size={26} />, color: '#6366f1', bg: '#eef2ff', darkBg: '#1e1b4b', label: 'Smart Suggestions', desc: 'Get intelligent next-step suggestions based on your deadlines, priority, and activity patterns.' },
              { icon: <Zap size={26} />, color: '#8b5cf6', bg: '#f5f3ff', darkBg: '#2e1065', label: 'Automated Summaries', desc: 'Receive AI-generated daily or weekly summaries highlighting completed items and bottlenecks.' },
              { icon: <CheckSquare size={26} />, color: '#10b981', bg: '#ecfdf5', darkBg: '#064e3b', label: 'Intuitive Tracking', desc: 'A clean, modern interface for tasks in lists or boards. Update status with a single click.' },
              { icon: <BarChart3 size={26} />, color: '#f59e0b', bg: '#fffbeb', darkBg: '#451a03', label: 'Deep Analytics', desc: 'Understand productivity trends over time with beautiful charts and work-habit insights.' },
              { icon: <ShieldCheck size={26} />, color: '#ef4444', bg: '#fef2f2', darkBg: '#450a0a', label: 'Admin Controls', desc: 'Admins can oversee all users, tasks, and system analytics from a single power dashboard.' },
            ].map(({ icon, color, bg, darkBg, label, desc }) => (
              <div
                key={label}
                style={{
                  background: cardBg, borderRadius: 20, padding: '32px 28px',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default', width: '100%', textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: dark ? darkBg : bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, color,
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: textPrimary, marginBottom: 10 }}>{label}</h3>
                <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ══════════════ FOOTER ══════════════ */}
      <Footer dark={dark} />
    </div>
  );
};

export default LandingPage;
