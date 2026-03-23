import { X, Layout, Calendar, Users, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { type Project } from "../../../api/projects";

interface EditWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description: string; dueDate: string }) => void;
    project: Project | null;
    readOnly?: boolean;
}

const EditWorkspaceModal = ({ isOpen, onClose, onSubmit, project, readOnly = false }: EditWorkspaceModalProps) => {
    const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title ?? '',
                description: project.description ?? '',
                dueDate: project.dueDate ? String(project.dueDate).substring(0, 10) : '',
            });
        }
    }, [project]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    // READ-ONLY VIEW (members)
    if (readOnly) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="h-1.5 w-full bg-blue-500" />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project Details</p>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{project?.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">

                        {/* Description */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Layout size={14} className="text-slate-400" />
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">
                            {project?.description || <span className="text-slate-400 italic">No description provided</span>}
                            </p>
                        </div>

                        {/* Owner */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={14} className="text-slate-400" />
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Owner</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                                    {project?.owner?.name?.[0] ?? '?'}
                                </div>
                                <p className="text-sm font-semibold text-slate-700">{project?.owner?.name ?? 'Unknown'}</p>
                            </div>
                        </div>

                        {/* Status + Due date side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag size={14} className="text-slate-400" />
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                    project?.status === 'completed'    ? 'bg-green-50 text-green-600' :
                                    project?.status === 'in-progress'  ? 'bg-blue-50 text-blue-600'  :
                                    'bg-amber-50 text-amber-600'
                                }`}>
                                    {project?.status ?? 'Planning'}
                                </span>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Due Date</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {project?.dueDate
                                    ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : <span className="text-slate-400 italic text-xs">Not set</span>
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Members count */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={14} className="text-slate-400" />
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Members</p>
                            </div>
                            <p className="text-sm font-semibold text-slate-700">
                                {Array.isArray(project?.members) ? project.members.length : 0} member{project?.members?.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="w-full mt-6 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all"
                    >
                        Close
                    </button>
                </div>
                </div>
            </div>
        );
    }

    // EDIT FORM (owner / admin)
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="h-1.5 w-full bg-blue-500" />
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                    <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Workspace</h2>
                    <p className="text-slate-500 text-sm mt-1">Update your project details.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Workspace Name</label>
                    <div className="relative">
                        <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" required value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700"
                            placeholder="Workspace name" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 resize-none"
                        placeholder="Project description" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Deadline</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input type="date" value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none" />
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                    <button type="button" onClick={onClose}
                        className="flex-1 px-6 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button type="submit"
                        className="flex-[1.5] px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]">
                        Save Changes
                    </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );


};

export default EditWorkspaceModal;
