import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { Plus, Save, Loader2, AlertCircle, CheckCircle2, Calendar, Flag, FileText } from 'lucide-react';
import { isGuestUser } from '../../../App';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isGuestUser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('isGuest');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const email = localStorage.getItem('email');
      const taskRequest = {
        title,
        description,
        priority,
        email,
        dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
      };

      const response = await api.post('/tasks', taskRequest);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/tasks'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  const priorities = [
    { value: 'LOW', label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', activeBg: 'bg-emerald-100' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', activeBg: 'bg-amber-100' },
    { value: 'HIGH', label: 'High', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', activeBg: 'bg-red-100' },
  ];

  if (success) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20">
        <div className="bg-emerald-50 p-6 rounded-full mb-6 animate-bounce">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Task Created!</h2>
        <p className="text-slate-500">Redirecting to your tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-xl">
            <Plus className="w-6 h-6 text-indigo-600" />
          </div>
          Add New Task
        </h1>
        <p className="text-slate-500 mt-2 ml-14">Create a task manually with your own details.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 space-y-6">
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to accomplish?"
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 font-medium placeholder:text-slate-300 transition-all"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task..."
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-32 text-slate-700 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
            <Flag className="w-4 h-4 text-slate-400" />
            Priority
          </label>
          <div className="flex gap-3">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all ${
                  priority === p.value
                    ? `${p.activeBg} ${p.color} ${p.border} shadow-sm`
                    : `bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100`
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 transition-all"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl hover:bg-indigo-700 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
