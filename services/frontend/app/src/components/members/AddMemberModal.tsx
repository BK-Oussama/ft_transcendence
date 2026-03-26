import { useEffect, useState } from "react";
import { Search, UserPlus, X, Loader2, Check } from "lucide-react";
import { membersApi } from "../../api/members";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  existingMemberIds: number[];
}


const AddMemberModal = ({ isOpen, onClose, projectId, existingMemberIds }: AddMemberModalProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [selectedRole, setSelectedRole] = useState<{ [userId: number]: string }>({});
    const [isSearching, setIsSearching] = useState(false);
    const [addedUsers, setAddedUsers] = useState<number[]>([]);
    const queryClient = useQueryClient();

    const addMemberMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: number; role: string }) =>
            membersApi.add(projectId, userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', projectId] });
        },
    });

    useEffect(() => {
        setAddedUsers([]);
    }, [existingMemberIds]);

    // filter out already existing members and search query
    // search users with debounce
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
        setUsers([]);
        return;
        }

        const timeout = setTimeout(async () => {
        setIsSearching(true);
        try {
            const results = await apiClient<User[]>(
            `/projects/users/search/?search=${searchQuery}`
            );
            setUsers(results.filter(u => !existingMemberIds.includes(u.id)));
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setIsSearching(false);
        }
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchQuery, existingMemberIds]);

    const handleAdd = (userId: number) => {
        const role = selectedRole[userId] || "MEMBER";
        addMemberMutation.mutate({ userId, role });
        setAddedUsers((prev) => [...prev, userId]);
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                {/* Top accent */}
                <div className="h-1.5 w-full bg-blue-500" />

                <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Add Member
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Search and add people to this workspace
                    </p>
                    </div>
                    <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                    >
                    <X size={20} />
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" size={16} />
                    )}
                    <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type a name or email to search..."
                    autoFocus
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                    />
                </div>

                {/* Users List */}
                <div className="max-h-80 overflow-y-auto space-y-2">
                    {searchQuery.trim().length < 2 ? (
                    <div className="text-center py-10 text-slate-400">
                        <Search size={36} className="mx-auto mb-3 text-slate-200" />
                        <p className="font-semibold text-sm">Start typing to search</p>
                        <p className="text-xs mt-1">Enter at least 2 characters</p>
                    </div>
                    ) : users.length > 0 ? (
                    users.map((user) => (
                        <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user.avatar
                            ? <img src={user.avatar} className="w-full h-full rounded-xl object-cover" />
                            : getInitials(user.name)
                            }
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>

                        {/* Role selector */}
                        <select
                            value={selectedRole[user.id] || "MEMBER"}
                            onChange={(e) =>
                            setSelectedRole({ ...selectedRole, [user.id]: e.target.value })
                            }
                            disabled={addedUsers.includes(user.id)}
                            className="text-xs px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none cursor-pointer text-slate-600 font-medium disabled:opacity-50"
                        >
                            <option value="VIEWER">Viewer</option>
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                        </select>

                        {/* Add button */}
                        <button
                            onClick={() => handleAdd(user.id)}
                            disabled={addedUsers.includes(user.id) || addMemberMutation.isPending}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 disabled:cursor-default
                            ${addedUsers.includes(user.id)
                                ? 'bg-green-50 text-green-600 border-green-100'
                                : 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border-blue-100 hover:border-transparent'
                            }`}
                        >
                            {addedUsers.includes(user.id) ? (
                            <><Check size={13} />Added</>
                            ) : addMemberMutation.isPending ? (
                            <Loader2 size={13} className="animate-spin" />
                            ) : (
                            <><UserPlus size={13} />Add</>
                            )}
                        </button>
                        </div>
                    ))
                    ) : !isSearching ? (
                    <div className="text-center py-10 text-slate-400">
                        <Search size={36} className="mx-auto mb-3 text-slate-200" />
                        <p className="font-semibold text-sm">No users found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400">
                    {users.length > 0
                        ? `${users.length} user${users.length !== 1 ? 's' : ''} found`
                        : 'Search to find people'}
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;