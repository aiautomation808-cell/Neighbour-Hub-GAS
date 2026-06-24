import React from 'react';
import { Shield, ShieldAlert, BarChart2, ListTodo, Users, AlertOctagon, CheckSquare, Trash2, Ban, Eye, FileText, CheckCircle } from 'lucide-react';
import { Report, AuditLog, User, Post } from '../types';

interface AdminSectionProps {
  reports: Report[];
  auditLogs: AuditLog[];
  currentUser: User;
  posts: Post[];
  onResolveReport: (reportId: string, actionType: 'dismiss' | 'remove_item' | 'ban_user') => void;
}

export default function AdminSection({
  reports,
  auditLogs,
  currentUser,
  posts,
  onResolveReport,
}: AdminSectionProps) {
  // Check permissions
  if (!['moderator', 'admin'].includes(currentUser.role)) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-red-150">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Access Denied</h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          The Admin & Moderator Dashboard is restricted to authorized community roles. Please use the <span className="font-bold text-indigo-600">Switch Test Role</span> toggle in the black status bar at the top to change your profile to Moderator or Admin!
        </p>
      </div>
    );
  }

  const pendingReports = reports.filter(r => r.status === 'pending');
  const dismissedReportsCount = reports.filter(r => r.status === 'dismissed').length;

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Banner controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
            <Shield className="text-indigo-600" size={20} />
            NeighborHub Moderator Panel
          </h2>
          <p className="text-xs text-slate-500">Welcome, {currentUser.name}. Manage community complaints, audit files, and review flagged content.</p>
        </div>

        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-150 uppercase tracking-wide">
          Authorized {currentUser.role.toUpperCase()} Key
        </span>
      </div>

      {/* Analytics Widget Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Reports</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-800">{reports.length}</span>
            <span className="text-[10px] text-slate-400">filed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending Action</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-black ${pendingReports.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {pendingReports.length}
            </span>
            <span className="text-[10px] text-slate-400">issues</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Verified Posts</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-800">{posts.length}</span>
            <span className="text-[10px] text-slate-400">live</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Dismissed Reports</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-green-600">{dismissedReportsCount}</span>
            <span className="text-[10px] text-slate-400">handled</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flagged Content Complaints Feed - Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertOctagon size={16} className="text-red-500" />
            Reported Items Queue ({pendingReports.length})
          </h3>

          <div className="space-y-4">
            {pendingReports.length === 0 ? (
              <div className="bg-white p-12 text-center text-slate-400 border border-slate-150 rounded-2xl">
                <CheckSquare size={32} className="mx-auto text-green-500 mb-2" />
                <p className="font-bold text-sm text-slate-700">Moderation queue empty</p>
                <p className="text-xs">No neighbors have flagged any content recently. Good job!</p>
              </div>
            ) : (
              pendingReports.map((rep) => (
                <div 
                  key={rep.id}
                  className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded">
                        Flagged {rep.itemType}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Reported by: <span className="font-bold text-slate-600">{rep.reportedBy}</span></p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">June 24, 2026</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1.5">
                    <p className="font-bold text-slate-800">Target Item Title:</p>
                    <p className="italic text-slate-600">"{rep.itemTitle}"</p>
                    <p className="pt-2 border-t border-slate-200 text-red-700 font-semibold">
                      Reason for Complaint: <span className="font-normal text-slate-600">{rep.reason}</span>
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => onResolveReport(rep.id, 'dismiss')}
                      className="px-3.5 py-1.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      Dismiss Complaint
                    </button>
                    <button
                      onClick={() => onResolveReport(rep.id, 'remove_item')}
                      className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      Remove Content
                    </button>
                    <button
                      onClick={() => onResolveReport(rep.id, 'ban_user')}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Ban size={13} />
                      Ban User Account
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Moderation Audit Log - Right Column */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <ListTodo size={16} className="text-indigo-600" />
            Moderator Action Log
          </h3>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-sm border border-slate-800 font-mono text-[11px] h-[360px] overflow-y-auto space-y-3 text-left">
            <div className="border-b border-slate-800 pb-2 mb-1">
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Session Audit Trace</p>
              <p className="text-[10px] text-green-400">Status: Connection Secure</p>
            </div>

            {auditLogs.length === 0 ? (
              <p className="text-slate-500 italic">No administrative actions executed in this session.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="space-y-0.5 border-b border-slate-800/40 pb-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-indigo-400 font-bold">@{log.moderatorName}</span>
                    <span>10:14</span>
                  </div>
                  <p className="text-white font-semibold">{log.action}</p>
                  <p className="text-slate-400 truncate text-[10px]">Target: {log.targetItem}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
