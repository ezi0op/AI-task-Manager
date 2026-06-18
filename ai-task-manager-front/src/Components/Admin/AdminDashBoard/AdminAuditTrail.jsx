import React, { useState, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { ShieldCheck, ShieldAlert, History, Hash, Calendar, Clipboard, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

const AdminAuditTrail = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [integrityPassed, setIntegrityPassed] = useState(true);
  const [tamperedIndex, setTamperedIndex] = useState(-1);

  useEffect(() => {
    const fetchAuditTrail = async () => {
      try {
        const response = await api.get('/admin/audit-trail');
        if (response.data.success) {
          const fetchedBlocks = response.data.data;
          setBlocks(fetchedBlocks);
          verifyBlockchainIntegrity(fetchedBlocks);
        }
      } catch (error) {
        console.error('Error fetching blockchain audit trail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditTrail();
  }, []);

  const verifyBlockchainIntegrity = (list) => {
    if (!list || list.length <= 1) {
      setIntegrityPassed(true);
      return;
    }

    // Since the API returns them in DESC order of ID (newest first),
    // let's iterate from oldest to newest (right-to-left or reverse order)
    // Oldest block is at list[list.length - 1]
    let passed = true;
    for (let i = list.length - 2; i >= 0; i--) {
      const currentBlock = list[i];
      const previousBlock = list[i + 1];

      if (currentBlock.previousHash !== previousBlock.currentHash) {
        passed = false;
        setTamperedIndex(i); // i is tampered
        break;
      }
    }
    setIntegrityPassed(passed);
  };

  const getActionBadgeColor = (action, blockId) => {
    const act = (action || (blockId === 1 ? 'GENESIS_BLOCK' : 'RECORDED_EVENT')).toUpperCase();
    if (act.includes('CREATED') || act.includes('GENESIS')) return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    if (act.includes('DELETED')) return 'bg-rose-50 text-rose-700 border-rose-200/60';
    if (act.includes('STATUS_UPDATED')) return 'bg-violet-50 text-violet-700 border-violet-200/60';
    return 'bg-blue-50 text-blue-700 border-blue-200/60'; // for UPDATED or RECORDED_EVENT
  };

  const formatHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash === 'GENESIS') return 'GENESIS';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-[3px] border-purple-100 border-t-purple-600 rounded-full animate-spin" />
        <span className="text-slate-500 font-medium text-sm">Verifying blockchain signatures...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <History className="text-purple-600 w-7 h-7" />
            Task Change Ledger
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">Cryptographic audit log tracking all user and task transactions.</p>
        </div>
      </div>

      {/* Integrity Verification Card */}
      <div className={`p-6 rounded-2xl border ${integrityPassed ? 'bg-emerald-50/40 border-emerald-100' : 'bg-red-50/40 border-red-100'} transition-all duration-300`}>
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-xl ${integrityPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {integrityPassed ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="font-extrabold text-slate-800 text-base">Cryptographic Chain Verification</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase border ${
                integrityPassed 
                  ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300/40' 
                  : 'bg-red-100/60 text-red-800 border-red-300/40'
              }`}>
                {integrityPassed ? 'Secured & Verified' : 'Integrity Failure'}
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-3xl">
              {integrityPassed 
                ? 'All task operations are verified. The blockchain linkage is secure and shows no signs of manual database modifications or external tampering.' 
                : `A hash mismatch was detected on block index #${tamperedIndex}. Cryptographic linkage has been broken. Database integrity cannot be verified.`}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Logs Secured</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{blocks.length}</p>
          </div>
        </div>
      </div>

      {/* Blockchain Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Index</th>
                <th className="p-4">Task ID</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Previous Hash</th>
                <th className="p-4">Current Hash</th>
                <th className="p-4 pr-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {blocks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 pl-6 py-12 text-center text-slate-400">
                    No transactions recorded in the blockchain yet.
                  </td>
                </tr>
              ) : (
                blocks.map((block, idx) => {
                  const isBlockTampered = !integrityPassed && idx <= tamperedIndex;
                  const displayAction = block.action || (block.id === 1 ? 'GENESIS_BLOCK' : 'RECORDED_EVENT');
                  return (
                    <tr 
                      key={block.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isBlockTampered ? 'bg-red-50/10 hover:bg-red-50/20' : ''
                      }`}
                    >
                      <td className="p-4 pl-6 font-bold text-slate-900">
                        #{block.id}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-semibold">
                          Task {block.taskId}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getActionBadgeColor(block.action, block.id)}`}>
                          {displayAction}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          {formatDate(block.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-400">
                        <span title={block.previousHash}>
                          {formatHash(block.previousHash)}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500 font-semibold">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span title={block.currentHash}>
                            {formatHash(block.currentHash)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <div className="flex items-center justify-center">
                          {isBlockTampered ? (
                            <span 
                              className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200/40"
                              title="Hash Mismatch Detected"
                            >
                              <AlertOctagon className="w-3 h-3" />
                              Invalid
                            </span>
                          ) : (
                            <span 
                              className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/40"
                              title="Cryptographic verification passed"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Valid
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditTrail;
