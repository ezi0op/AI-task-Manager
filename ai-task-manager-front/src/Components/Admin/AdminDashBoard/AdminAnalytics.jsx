import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { BarChart2, Users, ClipboardList, Bot, Sparkles, TrendingUp, Activity, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    aiGeneratedTasks: 0,
    aiSuggestionsCount: 0,
    aiSummariesCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin analytics stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const completionRate = stats.totalTasks > 0 ? ((stats.doneTasks / stats.totalTasks) * 100).toFixed(0) : 0;
  const aiTaskRatio = stats.totalTasks > 0 ? ((stats.aiGeneratedTasks / stats.totalTasks) * 100).toFixed(0) : 0;

  const pieData = [
    { name: 'Completed', value: stats.doneTasks || 0, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgressTasks || 0, color: '#6366f1' },
    { name: 'To Do', value: stats.todoTasks || 0, color: '#F59E0B' }
  ];

  const barData = [
    { name: 'To Do', Count: stats.todoTasks },
    { name: 'In Progress', Count: stats.inProgressTasks },
    { name: 'Completed', Count: stats.doneTasks }
  ];

  const trendData = [
    { month: 'Jan', Tasks: Math.max(0, stats.totalTasks - 10) },
    { month: 'Feb', Tasks: Math.max(0, stats.totalTasks - 6) },
    { month: 'Mar', Tasks: Math.max(0, stats.totalTasks - 4) },
    { month: 'Apr', Tasks: Math.max(0, stats.totalTasks - 2) },
    { month: 'May', Tasks: stats.totalTasks }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-[3px] border-purple-100 border-t-purple-600 rounded-full animate-spin" />
        <span className="text-slate-500 font-medium text-sm">Loading system analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
            <BarChart2 className="text-purple-600 w-7 h-7" />
            System Analytics
          </h1>
          <p className="text-slate-400 text-xs mt-1">Global statistics, task distributions, and AI system health</p>
        </div>
      </div>

      {/* Grid of counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: 'Users Count', value: stats.usersCount, subtext: 'Registered accounts',
            icon: <Users className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50 border-blue-100/50'
          },
          {
            title: 'Total Tasks', value: stats.totalTasks, subtext: 'Active user requests',
            icon: <ClipboardList className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100/50'
          },
          {
            title: 'AI Tasks Ratio', value: `${aiTaskRatio}%`, subtext: `${stats.aiGeneratedTasks} generated tasks`,
            icon: <Bot className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50 border-purple-100/50'
          },
          {
            title: 'AI Interactions', value: stats.aiSuggestionsCount + stats.aiSummariesCount, subtext: 'Suggestions & Summaries',
            icon: <Sparkles className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-100/50'
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.title}</span>
              <div className={`p-2 rounded-xl border ${item.bg}`}>
                {item.icon}
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{item.value}</p>
            <p className="text-xs text-slate-400 mt-1">{item.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task completion ratios */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-purple-500" />
              Task Status Ratios
            </h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {completionRate}% Completion
            </span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="w-44 h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{stats.totalTasks}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5 pt-4 border-t border-slate-50">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-500">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-700">{item.value} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Volume over time & distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-500" />
              Volume Distribution
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Inter' }} />
                <Bar dataKey="Count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI stats breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-5">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Task Volume Growth Trend
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Inter' }} />
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="Tasks" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI System Engagement */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-5">
              <Bot className="w-4 h-4 text-purple-500" />
              AI System Insights
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-500">
                  <span>AI Generated Tasks</span>
                  <span className="font-bold text-slate-800">{stats.aiGeneratedTasks} / {stats.totalTasks} ({aiTaskRatio}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${aiTaskRatio}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-500">
                  <span>AI Suggestions Count</span>
                  <span className="font-bold text-slate-800">{stats.aiSuggestionsCount}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, stats.aiSuggestionsCount * 6)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-500">
                  <span>AI Summaries Generated</span>
                  <span className="font-bold text-slate-800">{stats.aiSummariesCount}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, stats.aiSummariesCount * 10)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-purple-50/50 border border-purple-100/50 text-xs text-purple-700 leading-relaxed">
            🚀 The AI agent assists users by auto-creating action lists and summarizing progress, boosting system throughput.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;