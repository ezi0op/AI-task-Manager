import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { User, Mail, Shield, Calendar, CheckCircle2, AlertCircle, Edit3, Save, X, Image } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editImage, setEditImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const navigate = useNavigate();

  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  const name = email ? email.split('@')[0] : 'User';
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/profile/${email}`);
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      // Fallback
      setProfile({ name: capitalizedName, email, role, image: '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchProfile();
    else setLoading(false);
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [profile?.image]);

  const startEditing = () => {
    setEditName(profile?.name || capitalizedName);
    setEditEmail(profile?.email || email);
    setEditImage(profile?.image || '');
    setIsEditing(true);
    setError('');
    setSuccessMsg('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;

    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      const currentEmail = localStorage.getItem('email');
      const response = await api.put(`/users/profile/${currentEmail}`, {
        name: editName,
        email: editEmail,
        image: editImage || ''
      });

      if (response.data.success) {
        const updated = response.data.data;
        setProfile(updated);
        localStorage.setItem('email', updated.email);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3">
        <div className="w-7 h-7 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-slate-500 text-sm font-medium">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            My Profile
          </h1>
          <p className="text-slate-500 mt-2 ml-14">View and manage your account details.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm border border-red-100">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-sm border border-emerald-100">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
          {profile?.image && !imageError ? (
            <img 
              src={profile.image} 
              alt="Avatar" 
              className="w-20 h-20 rounded-2xl object-cover shadow-md shadow-indigo-600/10 flex-shrink-0 border border-slate-200" 
              onError={() => setImageError(true)} 
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 flex-shrink-0">
              <span className="text-white text-3xl font-bold">
                {(profile?.name || capitalizedName).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-800">{profile?.name || capitalizedName}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{profile?.email || email}</p>
            <span className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              role === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              <Shield className="w-3 h-3" />
              {role === 'ADMIN' ? 'Administrator' : 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Details Card or Form */}
      {!isEditing ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-base font-bold text-slate-700">Account Information</h3>
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</p>
              <p className="text-slate-700 font-medium text-sm mt-0.5">{profile?.email || email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</p>
              <p className="text-slate-700 font-medium text-sm mt-0.5">{role === 'ADMIN' ? 'Administrator' : 'User'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</p>
              <p className="text-emerald-600 font-semibold text-sm mt-0.5">Active</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-base font-bold text-slate-700">Edit Account Details</h3>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address (Read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                value={editEmail}
                disabled
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-medium"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile Image URL</label>
            <div className="relative">
              <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
            {editImage && (
              <div className="mt-3 flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                <img 
                  src={editImage} 
                  alt="Preview" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
                  onError={(e) => e.target.style.display = 'none'} 
                />
                <span className="text-xs text-slate-400 truncate">Image URL preview</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-50">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold text-sm shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Action buttons (only when not editing) */}
      {!isEditing && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/change-password')}
            className="w-full sm:flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold text-sm shadow-md shadow-indigo-600/20"
          >
            Change Password
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
