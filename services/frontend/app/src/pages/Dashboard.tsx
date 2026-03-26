import WorkspaceCard from "../components/dashboard/WorkspaceCard";
import CreateWorkspaceCard from "../components/dashboard/CreateWorkspaceCard";
import CreateWorkspaceModal, { type WorkspaceData } from '../components/dashboard/CreateWorkspaceModal';
import { Megaphone, Settings, Rocket, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { projectsApi, type Project } from "../api/projects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import EditWorkspaceModal from '../components/dashboard/EditWorkspaceModal';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);   


    // add update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            projectsApi.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    const handleEditProject = (project: Project) => {
        setProjectToEdit(project);
        setIsEditModalOpen(true);
    };

    const handleUpdateProject = (data: { title: string; description: string; dueDate: string }) => {
        if (!projectToEdit) return;
        updateMutation.mutate({ id: projectToEdit.id, data });
    };

    // helper to get current user's role in a project
    const getUserRole = (project: Project): string | null => {
        if (!user) return null;
        const member = project.members.find(m => m.userId === Number(user.id));
        return member?.role ?? null;
    };



    // FETCH all projects
    const { data: projects = [], isLoading, error } = useQuery({
        queryKey: ['projects'],
        queryFn: projectsApi.getAll,
    });

    // CREATE project
    const createMutation = useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsModalOpen(false);
        },
    });

    // DELETE project
    const deleteMutation = useMutation({
        mutationFn: projectsApi.delete,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    // const [workspaces, setWorkspaces] = useState([
    //     {
    //         id: 1,
    //         title: 'Marketing Campaign',
    //         owner: 'Sarah Smith',
    //         icon: Megaphone,
    //         iconBgColor: 'bg-orange-100',
    //     },
    //     {
    //         id: 2,
    //         title: 'Engineering Sprint',
    //         owner: 'Engineering Team',
    //         icon: Settings,
    //         iconBgColor: 'bg-blue-100',
    //         members: 8,
    //     },
    //     {
    //         id: 3,
    //         title: 'Product Launch',
    //         owner: 'John Doe',
    //         icon: Rocket,
    //         iconBgColor: 'bg-pink-100',
    //         members: 5,
    //     },
    // ]);
    
    const handleCreateProject = (formData: WorkspaceData) => {
        console.log('New project created:', formData);
        createMutation.mutate({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            dueDate: formData.dueDate,
        });
    };

    const handleDeleteProject = (projectId: number) => {
        if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
            // setWorkspaces(workspaces.filter((ws) => ws.id !== projectId));
            deleteMutation.mutate(projectId);
            console.log('Project deleted:', projectId);
        }
    };


    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <LayoutDashboard className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-bold text-gray-900">Your Workspaces</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 animate-pulse">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl mb-5" />
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
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
                    <p className="text-red-600 font-semibold">Failed to load workspaces</p>
                    <p className="text-red-400 text-sm mt-1">Make sure your backend is running</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <LayoutDashboard className="text-blue-600" size={32} />
                    Your Workspaces
                </h1>
                <p className="text-gray-500 mb-8">
                    Manage your projects and collaborate with your team in one place
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <WorkspaceCard
                        key={project.id}
                        project={project}
                        onDelete={handleDeleteProject}
                        onEdit={handleEditProject}
                        currentUserRole={getUserRole(project)}
                    />
                ))}
                <CreateWorkspaceCard onClick={() => setIsModalOpen(true)} />
            </div>
            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
            />
            <EditWorkspaceModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setProjectToEdit(null); }}
                onSubmit={handleUpdateProject}
                project={projectToEdit}
                readOnly={projectToEdit ? !['OWNER', 'ADMIN'].includes(getUserRole(projectToEdit) ?? '') : true}
            />
        </div>
        
    );
};

export default Dashboard;