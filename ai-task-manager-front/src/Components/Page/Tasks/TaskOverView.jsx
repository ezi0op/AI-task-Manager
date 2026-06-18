import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';

const TaskOverView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await api.get(`/tasks/${id}/email/${email}`);
        if (response.data.success) {
          setTask(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching task', error);
      }
    };
    fetchTask();
  }, [id]);

  if (!task) return <div className="p-6">Loading task...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <button onClick={() => navigate('/tasks')} className="text-blue-600 mb-4">&larr; Back to Tasks</button>
      <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="flex gap-4 mb-4">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">Status: {task.status}</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">Priority: {task.priority}</span>
        {task.dueDate && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">Due: {task.dueDate}</span>}
      </div>
    </div>
  );
};

export default TaskOverView;