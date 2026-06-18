import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Sparkles, CheckCircle2, Clock } from 'lucide-react';

const AiSmart = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await api.get(`/ai/summary/${email}`);
        if (response.data.success) {
          setSummary(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching summary', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const formatMarkdown = (text) => {
    if (!text) return null;

    let normalizedText = text;
    if (!text.includes('\n')) {
      const splitPoints = text.split(/(?=\d+\.\s+)/);
      if (splitPoints.length > 1) {
        normalizedText = splitPoints.join('\n');
      }
    }

    const lines = normalizedText.split(/\r?\n/);

    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
          const isNumbered = /^\d+\.\s+/.test(trimmed);

          let cleanText = trimmed;
          if (isBullet) {
            const bulletMatch = trimmed.match(/^([-*•])\s+(.*)$/);
            if (bulletMatch) {
              cleanText = bulletMatch[2];
            } else if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
              cleanText = trimmed.substring(1).trim();
            }
          } else if (isNumbered) {
            cleanText = trimmed.replace(/^\d+\.\s+/, '').trim();
          }

          // Balance mismatched asterisks at start/end of cleanText
          let balancedText = cleanText;
          if (balancedText.startsWith('*') && !balancedText.startsWith('**') && balancedText.endsWith('**')) {
            balancedText = '*' + balancedText;
          } else if (balancedText.startsWith('**') && balancedText.endsWith('*') && !balancedText.endsWith('**')) {
            balancedText = balancedText + '*';
          }

          const isHeader = balancedText.startsWith('#');
          let headerLevel = 0;
          if (isHeader) {
            const match = balancedText.match(/^(#+)\s+(.*)$/);
            if (match) {
              headerLevel = match[1].length;
              balancedText = match[2];
            }
          }

          const parts = balancedText.split(/(\*\*.*?\*\*|\*.*?\*)/g);
          const parsedContent = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            } else if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-800">
                  {part.slice(1, -1)}
                </strong>
              );
            }
            return part;
          });

          if (headerLevel > 0) {
            const headerClasses = 
              headerLevel === 1 ? "text-xl font-black text-indigo-950 mt-2 mb-1" :
              headerLevel === 2 ? "text-lg font-bold text-indigo-900 mt-2 mb-1" :
              "text-base font-bold text-indigo-800 mt-1";
            return React.createElement(`h${Math.min(headerLevel, 6)}`, { key: index, className: headerClasses }, parsedContent);
          }

          if (isBullet && (trimmed.startsWith('-') || trimmed.startsWith('•') || (trimmed.startsWith('*') && trimmed.match(/^\*\s+/)))) {
            return (
              <div key={index} className="flex items-start gap-2.5 pl-2 text-sm text-slate-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0" />
                <div className="flex-1">{parsedContent}</div>
              </div>
            );
          }

          if (isNumbered) {
            const numMatch = trimmed.match(/^(\d+)\.\s+/);
            const num = numMatch ? numMatch[1] : index + 1;
            return (
              <div key={index} className="flex items-start gap-3.5 text-sm leading-relaxed text-slate-600 bg-white p-4 rounded-xl border border-indigo-50/50 shadow-sm hover:border-indigo-200 transition-colors">
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-indigo-100/70 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  {num}
                </span>
                <div className="flex-1 text-slate-600">{parsedContent}</div>
              </div>
            );
          }

          return (
            <p key={index} className="text-sm leading-relaxed text-slate-600">
              {parsedContent}
            </p>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Generating your smart summary...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-indigo-500" />
          Smart Insights
        </h1>
        <p className="text-gray-500 mt-1">An AI-generated executive summary of your current progress.</p>
      </div>

      {!summary ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No summary available.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-emerald-100 p-4 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{summary.completedTasks}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-yellow-100 p-4 rounded-xl">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{summary.pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/40 via-white to-white p-8 rounded-2xl border border-indigo-100/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
            <h2 className="text-lg font-bold text-indigo-950 flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              AI Analysis & Productivity Report
            </h2>
            <div className="text-slate-700 leading-relaxed text-sm bg-indigo-50/10 p-5 rounded-xl border border-indigo-50/30">
              {formatMarkdown(summary.summary)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSmart;