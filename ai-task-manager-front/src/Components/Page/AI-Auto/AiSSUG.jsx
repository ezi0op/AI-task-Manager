import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { Lightbulb, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const AiSSUG = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await api.get(`/ai/suggestions/${email}`);
        if (response.data.success) {
          setSuggestions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching suggestions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const getRiskIcon = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'HIGH': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'MEDIUM': return <Info className="w-5 h-5 text-amber-500" />;
      case 'LOW': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'HIGH': return 'border-red-100 bg-red-50/50';
      case 'MEDIUM': return 'border-amber-100 bg-amber-50/40';
      case 'LOW': return 'border-green-100 bg-green-50/50';
      default: return 'border-blue-100 bg-blue-50/50';
    }
  };

  const formatSuggestionText = (text) => {
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
      <div className="space-y-4 mt-4">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
          const isNumbered = /^\d+\.\s+/.test(trimmed);

          let cleanText = trimmed;
          if (isBullet) {
            cleanText = trimmed.substring(1).trim();
          } else if (isNumbered) {
            cleanText = trimmed.replace(/^\d+\.\s+/, '').trim();
          }

          const isHeader = trimmed.startsWith('#');
          let headerLevel = 0;
          if (isHeader) {
            const match = trimmed.match(/^(#+)\s+(.*)$/);
            if (match) {
              headerLevel = match[1].length;
              cleanText = match[2];
            }
          }

          const parts = cleanText.split(/(\*\*.*?\*\*)/g);
          const parsedContent = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-slate-800">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (headerLevel > 0) {
            const headerClasses = 
              headerLevel === 1 ? "text-lg font-black text-slate-900 mt-2 mb-1" :
              headerLevel === 2 ? "text-base font-bold text-slate-800 mt-2 mb-1" :
              "text-sm font-bold text-slate-700 mt-1";
            return React.createElement(`h${Math.min(headerLevel, 6)}`, { key: index, className: headerClasses }, parsedContent);
          }

          if (isBullet) {
            return (
              <div key={index} className="flex items-start gap-2.5 pl-2 text-[13px] text-slate-600 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <p className="flex-1">{parsedContent}</p>
              </div>
            );
          }

          if (isNumbered) {
            const numMatch = trimmed.match(/^(\d+)\.\s+/);
            const num = numMatch ? numMatch[1] : index + 1;
            return (
              <div key={index} className="flex items-start gap-3.5 text-[13px] leading-relaxed text-slate-600 bg-white/80 p-4 rounded-xl border border-slate-100 shadow-sm hover:border-amber-200 transition-colors">
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold text-xs">
                  {num}
                </span>
                <p className="flex-1 text-slate-600">{parsedContent}</p>
              </div>
            );
          }

          return (
            <p key={index} className="text-[13px] leading-relaxed text-slate-600">
              {parsedContent}
            </p>
          );
        })}
      </div>
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-[3px] border-amber-100 border-t-amber-500 rounded-full animate-spin" />
        <span className="text-slate-500 font-medium text-sm">Analyzing your tasks for suggestions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
          <Lightbulb className="text-amber-500 w-7 h-7" />
          Smart Suggestions
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-medium">AI-powered recommendations based on your current task workload.</p>
      </div>

      <div className="grid gap-6">
        {suggestions.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400">
            No suggestions at this time. Keep up the good work!
          </div>
        ) : (
          suggestions.map((sug, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border ${getRiskColor(sug.riskLevel)}`}>
              <div className="flex items-center justify-between border-b border-slate-100/30 pb-3">
                <div className="flex items-center gap-2.5">
                  {getRiskIcon(sug.riskLevel)}
                  <h3 className="font-bold text-slate-800 text-sm">Task Analysis Report</h3>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white/80 text-[10px] font-bold text-slate-600 border border-slate-100/50 shadow-sm uppercase tracking-wider">
                  Risk Level: {sug.riskLevel || 'Unknown'}
                </div>
              </div>
              {formatSuggestionText(sug.suggestion)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AiSSUG;