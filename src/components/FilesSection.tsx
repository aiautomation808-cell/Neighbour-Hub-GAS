import React, { useState } from 'react';
import { FileText, Download, Search, Image as ImageIcon, Sparkles, Filter, Info, Trash2, ShieldAlert } from 'lucide-react';
import { FileAttachment, User } from '../types';

interface FilesSectionProps {
  files: FileAttachment[];
  currentUser: User;
  onRemoveFile: (id: string) => void;
  onTriggerCreatePost: () => void;
}

export default function FilesSection({
  files,
  currentUser,
  onRemoveFile,
  onTriggerCreatePost,
}: FilesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fileSearch, setFileSearch] = useState('');

  const filteredFiles = files.filter((f) => {
    // Category check
    if (selectedCategory !== 'all' && f.category !== selectedCategory) {
      return false;
    }
    // Search check
    if (fileSearch.trim()) {
      const q = fileSearch.toLowerCase();
      return f.name.toLowerCase().includes(q) || (f.category?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'Forms', label: '📄 Registration Forms' },
    { id: 'Notices', label: '📣 AGM Notices' },
    { id: 'Guides', label: '📖 Local Guides' },
    { id: 'Rules', label: '⚖️ Community Rules' },
    { id: 'Event flyers', label: '🎨 Event Flyers' },
    { id: 'Safety documents', label: '⚠️ Safety Manuals' }
  ];

  const getFileIcon = (type: FileAttachment['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="text-emerald-500" size={18} />;
      default: return <FileText className="text-indigo-600" size={18} />;
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Header controls banner */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">Shared Neighborhood Document Vault</h2>
          <p className="text-xs text-slate-500">Download registered HOA agreements, registration forms, trash guides, and event posters.</p>
        </div>

        <button
          onClick={onTriggerCreatePost}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer shrink-0"
        >
          + Upload File
        </button>
      </div>

      {/* Local search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search document vault by name (e.g., Summer, Guidelines, HOA)..."
            value={fileSearch}
            onChange={(e) => setFileSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.8 border border-slate-200 rounded-xl text-xs focus:outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Category List selection */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.8 text-xs font-bold rounded-full border whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document vault grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFiles.length === 0 ? (
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-12 text-center text-slate-400 border">
            <FileText className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="font-bold text-sm text-slate-700">No documents cataloged</p>
            <p className="text-xs">Select another category or upload your own document files.</p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div 
              key={file.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left flex gap-4 items-center justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* File Classification icon */}
                <div className="p-3 bg-slate-50 border rounded-2xl shrink-0">
                  {getFileIcon(file.type)}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-400">
                    <span className="bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded uppercase tracking-wide">
                      {file.category || 'Shared'}
                    </span>
                    <span>• {file.size}</span>
                  </div>
                </div>
              </div>

              {/* Download / Management commands */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert(`Simulated document downloads: ${file.name}`); }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-xl transition-colors shrink-0"
                  title="Download Document"
                >
                  <Download size={15} />
                </a>

                {/* Moderator or admin can delete any files */}
                {['moderator', 'admin'].includes(currentUser.role) && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this shared file?")) {
                        onRemoveFile(file.id);
                      }
                    }}
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors shrink-0"
                    title="Delete File"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Safety Notice Bottom card */}
      <div className="p-4 rounded-2xl bg-indigo-50/35 border border-indigo-100 text-xs text-indigo-950 flex gap-2.5 items-start">
        <Info className="text-indigo-600 shrink-0 mt-0.5" size={16} />
        <div>
          <p className="font-bold">File Upload Guidelines</p>
          <p className="text-slate-600 text-[11px] mt-0.5">
            Files uploaded here are instantly moderated for safety. Only upload standard documents (PDF, DOCX) and community posters (JPEG, PNG). Do not upload private records or files containing credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
