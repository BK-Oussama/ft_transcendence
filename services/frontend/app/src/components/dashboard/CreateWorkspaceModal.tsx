import { X, Layout, Calendar } from "lucide-react";
import { useState } from "react";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workspaceData: WorkspaceData) => void;
}

export interface WorkspaceData {
  title: string;
  description: string;
  status: string;
  startDate: string;
  dueDate: string;
}

const CreateWorkspaceModal = ({ isOpen, onClose, onSubmit }: CreateWorkspaceModalProps) => {
  const [formData, setFormData] = useState<WorkspaceData>({
    title: '',
    description: '',
    status: 'planning',
    startDate: '',
    dueDate: '',
  });

  const isFormDataValid = 
      formData.title.trim() !== '' && 
      formData.description.trim() !== '' && 
      formData.dueDate !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormDataValid) return;

    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      status: 'planning',
      startDate: '',
      dueDate: '',
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

 return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-blue-500" />

        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Workspace</h2>
                <p className="text-slate-500 text-sm mt-1">Set up your project environment in seconds.</p>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
            >
                <X size={20} />
            </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Project Title */}
            <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                Workspace Name
                </label>
                <div className="relative">
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                        placeholder="e.g. Marketing Q4 Branding"
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                Brief Description
                </label>
                <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 resize-none"
                placeholder="What is this workspace about?"
                />
            </div>

            {/* Grid for Select and Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer text-slate-600 text-sm font-medium"
                >
                    <option value="planning">Planning</option>
                    <option value="in-progress">Active</option>
                    <option value="completed">Done</option>
                </select>
                </div>

                <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Deadline</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none"
                    />
                </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={!isFormDataValid}
                    className={`
                        flex-[1.5] px-6 py-3.5 text-sm font-bold rounded-xl transition-all 
                        ${isFormDataValid 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98]' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'} 
                      `}
                    >
                    Create Workspace
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
