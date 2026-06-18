import React, { useState } from 'react';
import api from '../../../api/axiosConfig';
import { Wand2, Save, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isGuestUser } from '../../../App';

const AiGenTask = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTask, setGeneratedTask] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedTask(null);

    try {
      const email = localStorage.getItem('email');
      const response = await api.post('/ai/generate-task-details', { title: prompt, email: email });
      if (response.data.success) {
        setGeneratedTask(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate task details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    if (isGuestUser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('isGuest');
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      const email = localStorage.getItem('email');
      const taskRequest = {
        title: prompt,
        description: generatedTask.description,
        priority: generatedTask.priority,
        email: email,
        dueDate: generatedTask.dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
      };

      const response = await api.post('/tasks', taskRequest);
      if (response.data.success) {
        navigate('/tasks');
      }
    } catch (err) {
      setError('Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Wand2 className="text-purple-600" />
          AI Task Generator
        </h1>
        <p className="text-gray-500 mt-1">Describe what you want to achieve, and let AI break it down for you.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Implement a new login page with email and password fields..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none h-32"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {loading ? 'Generating...' : 'Generate Task Details'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {generatedTask && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">
                {generatedTask.description}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Priority</h3>
                <span className={`inline-block px-3 py-1 rounded-lg font-medium ${
                  generatedTask.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                  generatedTask.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {generatedTask.priority}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Effort</h3>
                <p className="text-gray-800 font-medium bg-gray-50 inline-block px-3 py-1 rounded-lg">
                  {generatedTask.estimatedEffort || 'Unknown'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Suggested Due Date</h3>
                <p className="text-purple-800 font-bold bg-purple-50 inline-block px-3 py-1 rounded-lg border border-purple-100">
                  {generatedTask.dueDate || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveTask}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save as Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiGenTask;