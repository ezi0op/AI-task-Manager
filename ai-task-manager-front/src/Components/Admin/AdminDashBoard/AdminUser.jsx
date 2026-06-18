import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Users, Trash2, Shield, User, AlertTriangle } from 'lucide-react';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, userId: null });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, userId: id });
  };

  const confirmDeleteUser = async () => {
    const { userId } = deleteConfirm;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user', error);
    } finally {
      setDeleteConfirm({ show: false, userId: null });
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.patch(`/admin/users/${id}/role/${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role', error);
    }
  };


  if (loading) {
    return <div className="p-6 text-gray-500">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-blue-600" />
          Manage Users
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.name ? user.name[0].toUpperCase() : <User size={16} />}
                      </div>
                      <span className="font-medium text-gray-800">{user.name || 'Unnamed User'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'ADMIN' ? (
                        <>
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-700">Admin</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">User</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {user.role !== 'ADMIN' ? (
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-purple-600 font-semibold px-2.5 py-1 bg-purple-50 border border-purple-100/50 rounded-lg select-none">
                        Protected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No users found.
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete User</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user and their tasks.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ show: false, userId: null })}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
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

export default AdminUser;