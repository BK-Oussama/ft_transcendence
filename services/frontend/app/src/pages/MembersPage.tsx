import { useState } from 'react';
import { type Member } from '../types/member';
import { Filter, Search, UserPlus, Users } from 'lucide-react';
import MemberCard from '../components/members/MemberCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '../api/members';
import AddMemberModal from '../components/members/AddMemberModal';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectsApi, type Project } from '../api/projects';

// const TEMP_PROJECT_ID = 1;

const MembersPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ filterRole, setFilterRole ] = useState<string>('all');
    const queryClient = useQueryClient();
    const location = useLocation();
    const projectId = Number(new URLSearchParams(location.search).get('projectId')) || 1;
    const { user } = useAuth();
 
    //FETCH members
    const {data: members = [], isLoading, error} = useQuery({
        queryKey: ['members', projectId],
        queryFn: () => membersApi.getAll(projectId),
    });

    const getUserRole = (membersList: Member[]): string | null => {
        if (!user || !membersList) return null;    
        // Search the members array for the entry matching the current user's ID
        const member = membersList.find(m => m.userId === Number(user.id));
        return member?.role ?? null;
    };

    const canAddMember = !(getUserRole(members)?.toUpperCase() === 'MEMBER');

    // REMOVE member
    const removeMutation = useMutation({
        mutationFn: (userId: number) => membersApi.remove(projectId, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members', projectId] }),
    });

    // UPDATE role
    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: number; role: string }) =>
            membersApi.updateRole(projectId, userId, role),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members', projectId] }),
    });


    const handleAddMember = (userId: number) => {
        const role = "MEMBER";
  
        console.log(`Adding user ${userId} with role ${role}`);
        alert(`✅ Added user ${userId} as ${role}`);
    
    };

    const handleDeleteMemeber = (memberId: number) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            removeMutation.mutate(memberId);
            console.log('Member deleted:', memberId);
        }
    };

    const handleChangeRole = (memberId: number, newRole: Member['role']) => {
        updateRoleMutation.mutate({ userId: memberId, role: newRole.toUpperCase() });
        console.log(`Member ${memberId} role changed to ${newRole}`);
    };

    const filteredMembers = members.filter((member) => {
        const matchesSearch = 
            member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || member.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                   <Users className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
                                <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-semibold">Failed to load members</p>
                    <p className="text-red-400 text-sm mt-1">Make sure your backend is running</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="text-blue-600" size={32} />
                Team Members
            </h1>
            <p className="text-gray-500 mt-2">
                Manage your workspace members and their permissions
            </p>
            </div>

            {canAddMember && (
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                    <UserPlus size={16} />
                    Add Member
                </button>
            )}


        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
                <p className="text-xs text-gray-400 font-medium mb-1">Total Members</p>
                <p className="text-3xl font-bold text-gray-900">{members.length}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
                <p className="text-xs text-gray-400 font-medium mb-1">Admins</p>
                <p className="text-3xl font-bold text-gray-900">
                {members.filter((m) => m.role === 'ADMIN' || m.role === 'OWNER').length}
                </p>
            </div>
        </div>


        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            {/* Search Input Container */}
            <div className="flex-1 relative">
                <Search 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" 
                    size={18} 
                />
                <input
                    type="text"
                    placeholder="Search members by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400"
                />
            </div>

            {/* Filter Select Container */}
            <div className="relative">
                <Filter 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
                    size={18} 
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-11 pr-10 py-3 bg-slate-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:bg-white outline-none appearance-none cursor-pointer text-slate-700 font-medium min-w-[160px] transition-all"
                >
                    <option className='w-full text-left px-3 py-2 text-sm rounded-xl transition-colors capitalize font-medium' value="all">All Roles</option>
                    <option className='w-full text-left px-3 py-2 text-sm rounded-xl transition-colors capitalize font-medium' value="OWNER">Owner</option>
                    <option className='w-full text-left px-3 py-2 text-sm rounded-xl transition-colors capitalize font-medium ' value="ADMIN">Admin</option>
                    <option className='w-full text-left px-3 py-2 text-sm rounded-xl transition-colors capitalize font-medium' value="MEMBER">Member</option>
                    <option className='w-full text-left px-3 py-2 text-sm rounded-xl transition-colors capitalize font-medium' value="VIEWER">Viewer</option>
                </select>
                {/* Custom Chevron for the select */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
                <MemberCard
                    key={member.userId}
                    member={{
                        id: member.userId,
                        name: member.user.name,
                        email: member.user.email,
                        role: member.role.toLowerCase() as any,
                        joined_at: member.joinedAt,
                        avatar: member.user.avatar ? `https://localhost${member.user.avatar}` : null,
                    }}
                    onDelete={handleDeleteMemeber}
                    onChangeRole={handleChangeRole}
                    currentUserRole={getUserRole(members)}
                />

            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                    <Users size={32} className="text-slate-300" />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    No muching members
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Try adjusting your search or filters.
                </p>
            </div>
        )}

        <AddMemberModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            projectId={projectId}
            existingMemberIds={members.map((m) => m.userId)}
        />

        </div>
    );
};

export default MembersPage;
