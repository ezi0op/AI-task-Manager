import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Briefcase, Trash2, Search, Calendar, User, AlertTriangle } from 'lucide-react';

const AdminTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, taskId: null, userEmail: null });

  const fetchTasks = async () => {
    try {
      const response = await api.get('/admin/tasks');
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteClick = (id, userEmail) => {
    setDeleteConfirm({ show: true, taskId: id, userEmail: userEmail });
  };

  const confirmDeleteTask = async () => {
    const { taskId, userEmail } = deleteConfirm;
    try {
      await api.delete(`/tasks/id/${taskId}/email/${userEmail}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task', error);
    } finally {
      setDeleteConfirm({ show: false, taskId: null, userEmail: null });
    }
  };


  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-100';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DONE': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'IN_PROGRESS': return 'text-blue-700 bg-blue-50 border-blue-100';
      default: return 'text-amber-700 bg-amber-50 border-amber-100';
    }
  };

  const filteredTasks = tasks.filter(task => 
    (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.userName && task.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.userEmail && task.userEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-[3px] border-purple-100 border-t-purple-600 rounded-full animate-spin" />
        <span className="text-slate-500 font-medium text-sm">Loading system tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="text-purple-600" />
          Manage Tasks
        </h1>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:border-purple-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Task</th>
                <th className="p-4">Assigned User</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/40 transition-colors group">
                  {/* Task details */}
                  <td className="p-4 pl-6 max-w-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors truncate">
                        {task.title}
                      </span>
                      <span className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                        {task.description || 'No description'}
                      </span>
                    </div>
                  </td>

                  {/* Assigned User */}
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {task.userName ? task.userName[0].toUpperCase() : <User size={12} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700 leading-tight">
                          {task.userName || 'Unnamed User'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {task.userEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wider ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wider ${getStatusStyle(task.status)}`}>
                      {task.status === 'DONE' ? 'COMPLETED' : task.status}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="p-4 text-slate-500">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{task.dueDate || 'No Date'}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDeleteClick(task.id, task.userEmail)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all inline-flex"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-slate-300" />
                      <span className="font-medium text-slate-500">No tasks found</span>
                      <span className="text-xs text-slate-400">Try adjusting your search terms or verify system tasks.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100/80 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4 border border-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Task</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this task? This action cannot be undone and will permanently remove the task.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ show: false, taskId: null, userEmail: null })}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-600/10 flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTask;