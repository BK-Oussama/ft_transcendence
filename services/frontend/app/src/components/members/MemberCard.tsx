import { MoreVertical, Calendar, Trash2, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { type Member } from '../../types/member';
import { useAuth } from '../../hooks/useAuth';

interface MemberCardProps {
    member: Member;
    onDelete: (memberId: number) => void;
    onChangeRole: (memberID: number, newRole: Member['role']) => void;
}

const roleStyles: Record<string, string> = {
    owner: 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm shadow-rose-20',
    admin: 'bg-blue-50 border-blue-100 text-blue-600',
    member: 'bg-slate-50 border-slate-100 text-slate-500',
    viewer: 'bg-slate-50 border-slate-100 text-slate-500',
};

const MemberCard = ({ member, onDelete, onChangeRole }: MemberCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    

    const getInitials = (name: string) => {
        return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
       <div 
            style={{ isolation: 'isolate' }}
            className={`group bg-white border border-gray-100 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 cursor-pointer relative ${
                isMenuOpen ? 'z-[100]' : 'z-10'
            }`}
        >
            <div className="absolute top-5 right-5" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    className={`p-2 rounded-xl transition-all ${
                        isMenuOpen 
                            ? 'bg-slate-100 text-slate-900 opacity-100' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                >
                    <MoreVertical size={18} />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 py-2 z-[110] animate-in fade-in zoom-in duration-200">
                        <div className=" my-2"></div>

                        <div className="px-2 pb-1">
                            <p className="text-[10px] font-bold text-slate-400 px-3 mb-2 uppercase tracking-widest">Change Role</p>
                            {(['admin', 'member', 'viewer'] as const).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => { onChangeRole(member.id, role); setIsMenuOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-colors capitalize font-medium ${
                                        member.role === role ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-slate-50 my-2"></div>

                        <button
                            onClick={() => { onDelete(member.id); setIsMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                            <Trash2 size={16} />
                            <span>Remove from Team</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                    <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/20">





                        {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            getInitials(member.name)
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-extrabold text-slate-900 truncate tracking-tight">
                            {member.name}
                        </h3>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border uppercase tracking-wide ${
                            roleStyles[member.role] || roleStyles.member}`}>
                            {member.role}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium mb-3">
                        <Mail size={14} />
                        <span className="truncate">{member.email}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-300" />
                            <span>Since {new Date(member.joined_at).getFullYear()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberCard;
