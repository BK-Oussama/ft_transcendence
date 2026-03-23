import { Eye, Pencil, Trash2, Users } from 'lucide-react';
import { type Project } from "../../../api/projects";
import { getProjectStyle } from '../../../utils/projectStyles';
import { useNavigate } from 'react-router-dom';

interface WorkspaceCardProps {
    project: Project;
    onDelete: (projectId: number) => void;
    onEdit: (project: Project) => void;
    currentUserRole: string | null
}

const WorkspaceCard = ({ project, onDelete, onEdit, currentUserRole }: WorkspaceCardProps) => {
    const navigate = useNavigate();
    const { icon: Icon, iconBgColor, iconColor } = getProjectStyle(project.id);

    const canDelete = currentUserRole === 'OWNER';
    const canManage   = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

    return (
        <div 
            onClick={() => navigate(`/board?projectId=${project.id}`)}
            className="group bg-white border border-gray-100 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 cursor-pointer relative"
        >
            <div className="absolute top-4 right-4 flex items-center gap-1">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                    className="p-1.5 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                >
                    {canManage ? <Pencil size={16} /> : <Eye size={16} />}
                </button>

                {canDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                        className="p-1.5 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-red-600 transition-all duration-200 cursor-pointer"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                <Icon size={24} className={iconColor} />
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                    Owner: <span className="text-gray-600">{project.owner?.name || 'Unknown'}</span>
                </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    <span className="text-xs font-medium">{(Array.isArray(project.members) ? project.members.length : 1)} members</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-300">
                    Shared
                </div>
            </div>
        </div>
    );
};

export default WorkspaceCard;
