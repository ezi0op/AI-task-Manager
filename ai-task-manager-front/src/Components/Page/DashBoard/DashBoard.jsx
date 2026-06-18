import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { isGuestUser } from '../../../App';
import {
  ClipboardList, CheckCircle2, Clock, TrendingUp, Calendar, Sparkles, Bot,
  FileText, ChevronRight, Plus, Zap, ArrowUpRight, BarChart3, Target, Lock,
  Users, Activity, BarChart2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DashBoard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });
  const [adminStats, setAdminStats] = useState({
    usersCount: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    aiGeneratedTasks: 0,
    aiSuggestionsCount: 0,
    aiSummariesCount: 0
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isGuest = isGuestUser();
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';
  const [dashboardMode, setDashboardMode] = useState(() => {
    if (!isAdmin) return 'user';
    const saved = localStorage.getItem('workspaceMode');
    if (saved) return saved;
    return 'admin';
  });

  useEffect(() => {
    const handleWorkspaceChange = () => {
      const saved = localStorage.getItem('workspaceMode') || (isAdmin ? 'admin' : 'user');
      setDashboardMode(saved);
    };
    window.addEventListener('workspaceModeChange', handleWorkspaceChange);
    return () => window.removeEventListener('workspaceModeChange', handleWorkspaceChange);
  }, [isAdmin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem('email');
        const promises = [
          api.get(`/tasks/dashboard/${email}`),
          api.get(`/tasks/email/${email}`)
        ];

        if (isAdmin) {
          promises.push(api.get('/admin/stats'));
        }

        const results = await Promise.all(promises);
        
        if (results[0].data.success) setStats(results[0].data.data);
        if (results[1].data.success) setTasks(results[1].data.data.slice(0, 5));
        
        if (isAdmin && results[2] && results[2].data.success) {
          setAdminStats(results[2].data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const pendingTasks = stats.todoTasks + stats.inProgressTasks;
  const completionRate = stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(0) : 0;

  const chartData = [
    { name: 'Completed', value: stats.completedTasks || 0, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgressTasks || 0, color: '#6366f1' },
    { name: 'To Do', value: stats.todoTasks || 1, color: '#F59E0B' }
  ];

  const adminChartData = [
    { name: 'Completed', value: adminStats.doneTasks || 0, color: '#10B981' },
    { name: 'In Progress', value: adminStats.inProgressTasks || 0, color: '#6366f1' },
    { name: 'To Do', value: adminStats.todoTasks || 0, color: '#F59E0B' }
  ];

  const adminBarData = [
    { name: 'To Do', Count: adminStats.todoTasks },
    { name: 'In Progress', Count: adminStats.inProgressTasks },
    { name: 'Completed', Count: adminStats.doneTasks }
  ];

  const handleProtectedAction = (path) => {
    if (isGuest) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('isGuest');
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500 bg-red-50 border-red-100';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DONE': return { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
      case 'IN_PROGRESS': return { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' };
      default: return { dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-slate-500 font-medium text-sm">Loading your workspace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* ═══ Seamless Toggle Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-4 rounded-2xl border border-slate-100/80 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {dashboardMode === 'admin' ? 'Admin Control Center' : 'My Personal Workspace'}
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">
            {dashboardMode === 'admin' ? 'Global system health, AI stats & task distributions' : 'Track your personal tasks and productivity details'}
          </p>
        </div>
        {isAdmin && (
          <div className="bg-slate-100/80 p-1 rounded-xl flex gap-1 shadow-sm border border-slate-200/40">
            <button
              onClick={() => {
                localStorage.setItem('workspaceMode', 'user');
                setDashboardMode('user');
                window.dispatchEvent(new Event('workspaceModeChange'));
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                dashboardMode === 'user'
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.setItem('workspaceMode', 'admin');
                setDashboardMode('admin');
                window.dispatchEvent(new Event('workspaceModeChange'));
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                dashboardMode === 'admin'
                  ? 'bg-indigo-600 text-white shadow shadow-indigo-600/10'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Admin Dashboard
            </button>
          </div>
        )}
      </div>

      {dashboardMode === 'admin' ? (
        /* ════════════════ ADMIN DASHBOARD MODE ════════════════ */
        <div className="space-y-8">
          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Total Registered Users', value: adminStats.usersCount, subtext: 'System scale',
                icon: <Users className="w-6 h-6" />,
                gradient: 'from-blue-500 to-indigo-600',
              },
              {
                title: 'Total Tasks Managed', value: adminStats.totalTasks, subtext: 'Active user tasks',
                icon: <ClipboardList className="w-6 h-6" />,
                gradient: 'from-violet-500 to-fuchsia-600',
              },
              {
                title: 'AI Generated Tasks', value: adminStats.aiGeneratedTasks,
                subtext: `${adminStats.totalTasks > 0 ? ((adminStats.aiGeneratedTasks / adminStats.totalTasks) * 100).toFixed(0) : 0}% of all tasks`,
                icon: <Bot className="w-6 h-6" />,
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                title: 'AI Insights Triggered', value: adminStats.aiSuggestionsCount + adminStats.aiSummariesCount,
                subtext: `${adminStats.aiSuggestionsCount} Sug. | ${adminStats.aiSummariesCount} Sum.`,
                icon: <Sparkles className="w-6 h-6" />,
                gradient: 'from-amber-500 to-orange-500',
              },
            ].map((stat) => (
              <div key={stat.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-indigo-600/5`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-slate-400 mt-1.5">{stat.subtext}</p>
              </div>
            ))}
          </div>

          {/* Admin Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Task Ratios Pie Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-slate-800">Global Task Ratios</h2>
                <Activity className="w-4 h-4 text-slate-300" />
              </div>
              
              <div className="flex flex-col items-center gap-6">
                <div className="w-40 h-40 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={adminChartData}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {adminChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-slate-800">{adminStats.totalTasks}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tasks</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 w-full border-t border-slate-50 pt-4">
                  {[
                    { label: 'Completed', value: adminStats.doneTasks, color: 'bg-emerald-500' },
                    { label: 'In Progress', value: adminStats.inProgressTasks, color: 'bg-indigo-500' },
                    { label: 'To Do', value: adminStats.todoTasks, color: 'bg-amber-400' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Volume Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-slate-800">Task Status Distribution</h2>
                <BarChart2 className="w-4 h-4 text-slate-300" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Inter' }} />
                    <Bar dataKey="Count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ════════════════ USER DASHBOARD MODE ════════════════ */
        <div className="space-y-8">
          {/* Guest Banner */}
          {isGuest && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 shadow-xl shadow-indigo-600/10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Welcome to AI Task Manager!</h3>
                    <p className="text-indigo-100/80 text-sm mt-0.5">Sign in to create tasks, get AI suggestions, and unlock all features.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    localStorage.removeItem('role');
                    localStorage.removeItem('isGuest');
                    navigate('/login');
                  }}
                  className="bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 flex-shrink-0"
                >
                  Sign In
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Total Tasks', value: stats.totalTasks, subtext: 'All your tasks',
                icon: <ClipboardList className="w-6 h-6" />,
                gradient: 'from-indigo-500 to-indigo-600',
              },
              {
                title: 'Completed', value: stats.completedTasks, subtext: 'Tasks done',
                icon: <CheckCircle2 className="w-6 h-6" />,
                gradient: 'from-emerald-500 to-emerald-600',
              },
              {
                title: 'Pending', value: pendingTasks, subtext: 'Tasks remaining',
                icon: <Clock className="w-6 h-6" />,
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                title: 'Completion Rate', value: `${completionRate}%`,
                subtext: Number(completionRate) >= 50 ? 'Great progress!' : 'Keep going!',
                subtextColor: Number(completionRate) >= 50 ? 'text-emerald-600' : 'text-amber-600',
                icon: <TrendingUp className="w-6 h-6" />,
                gradient: 'from-blue-500 to-cyan-500',
              },
            ].map((stat) => (
              <div key={stat.title} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-${stat.gradient.split('-')[1]}/20`}>
                    {stat.icon}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</p>
                <p className={`text-xs font-medium mt-1.5 ${stat.subtextColor || 'text-slate-400'}`}>{stat.subtext}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Area: My Tasks */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-slate-50">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Recent Tasks</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Your latest task activity</p>
                </div>
                <button onClick={() => navigate('/tasks')} className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                  View All
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-slate-50 p-6 rounded-2xl mb-4">
                    <Target className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-slate-700 font-bold mb-1">No tasks yet</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-xs">Get started by creating your first task or let AI generate one for you.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleProtectedAction('/add-task')}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/15"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                      {isGuest && <Lock className="w-3 h-3 opacity-60" />}
                    </button>
                    <button
                      onClick={() => navigate('/ai-generate')}
                      className="flex items-center gap-2 bg-violet-50 text-violet-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-colors"
                    >
                      <Bot className="w-4 h-4" />
                      AI Generate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-slate-50">
                  {tasks.map(task => {
                    const statusStyle = getStatusStyle(task.status);
                    return (
                      <div key={task.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${statusStyle.dot}`} />
                          <div className="min-w-0">
                            <h3 className="text-slate-800 font-semibold text-sm mb-0.5 truncate group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                            <p className="text-slate-400 text-xs line-clamp-1">{task.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider border ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium w-24">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{task.dueDate || 'No Date'}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Area: Task Overview */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base font-bold text-slate-800">Task Overview</h2>
                  <BarChart3 className="w-4 h-4 text-slate-300" />
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-28 h-28 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%" cy="50%"
                          innerRadius={36} outerRadius={54}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-lg font-extrabold text-slate-800">{completionRate}%</span>
                      <span className="text-[9px] font-medium text-slate-400">Done</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 flex-1">
                    {[
                      { label: 'Completed', value: stats.completedTasks, color: 'bg-emerald-500' },
                      { label: 'In Progress', value: stats.inProgressTasks, color: 'bg-indigo-500' },
                      { label: 'To Do', value: stats.todoTasks, color: 'bg-amber-400' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-xs font-medium text-slate-500">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;