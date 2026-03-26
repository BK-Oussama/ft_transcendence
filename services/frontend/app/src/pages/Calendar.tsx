import { Calendar } from "lucide-react";
import WorkspaceCalendar from "../components/calendar/WorkspaceCalendar";
import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks";
import { projectsApi } from "../api/projects";

const PROJECT_COLORS = [
    { bg: 'bg-blue-50',   text: 'text-blue-700'   },
    { bg: 'bg-green-50',  text: 'text-green-700'  },
    { bg: 'bg-amber-50',  text: 'text-amber-700'  },
    { bg: 'bg-purple-50', text: 'text-purple-700' },
    { bg: 'bg-rose-50',   text: 'text-rose-700'   },
    { bg: 'bg-cyan-50',   text: 'text-cyan-700'   },
    { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    { bg: 'bg-pink-50',   text: 'text-pink-700'   },
];

const CalendarPage = () => {
    const { data: rawTasks = [], isLoading } = useQuery({
        queryKey: ['my-tasks'],
        queryFn: tasksApi.getMyTasks,
    });

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: projectsApi.getAll,
    });

    // Map tasks to the format WorkspaceCalendar expects
    const tasks = rawTasks
        .filter(t => t.due_date) // only tasks with a due date
        .map(t => {
        const colorSet = PROJECT_COLORS[t.project_id % PROJECT_COLORS.length];
        const projectTitle = projects.find(p => p.id === t.project_id)?.title ?? `Project #${t.project_id}`;
        return {
            id: t.id,
            title: t.title,
            description: t.description,
            start_date: t.due_date!,
            due_date: t.due_date!,
            status: t.status,
            color: `${colorSet.bg} ${colorSet.text}`,
            workspace_id: t.project_id,
            projectName: projectTitle,
        };
    });

    return (
        <div className="p-8">
            
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Calendar className="text-blue-600" size={32} />
                    Calendar
                </h1>
                <p className="text-gray-500 mt-2">View all your tasks and deadlines</p>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 animate-pulse">
                    <div className="h-6 bg-gray-100 rounded w-48 mb-6" />
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="h-24 bg-gray-50 rounded-lg" />
                        ))}
                    </div>
                </div>
            ) : (
                <WorkspaceCalendar tasks={tasks} />
            )}
        
        </div>
    );
};

export default CalendarPage;