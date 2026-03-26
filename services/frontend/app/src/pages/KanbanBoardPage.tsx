// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { Search, Filter, Home, X } from "lucide-react";
// import { Toaster, toast } from "react-hot-toast";
// import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

// // Team's required shared assets
// import api from "../api/kanbanClient";

// import KanbanColumn from "../components/kanban/KanbanColumn";
// import NewTaskModal from "../components/kanban/NewTaskModal";
// import { useSearchParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { projectsApi } from "../api/projects";

// interface Task {
//   id: number;
//   title: string;
//   description?: string;
//   status: string;
//   priority?: string;
//   assignedTo?: number;
//   startDate?: string;
//   dueDate?: string;
//   attachmentUrl?: string;
//   position: number;
// }

// export default function BoardPage() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeStatus, setActiveStatus] = useState("TODO");
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterPriority, setFilterPriority] = useState<string | null>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const [searchParams] = useSearchParams();
//   const PROJECT_ID = Number(searchParams.get('projectId')) || 1;

//   const { data: projects = [] } = useQuery({
//     queryKey: ['projects'],
//     queryFn: projectsApi.getAll,
//   });

//   const projectName = projects.find(p => p.id === PROJECT_ID)?.title;

//   const USER_ROLE = "ADMIN";
//   const canEdit = USER_ROLE === "ADMIN" || USER_ROLE === "PM";
//   // const PROJECT_ID = 1;

//   useEffect(() => {
//     fetchTasks();

//     // Team's new WebSocket Gateway routing
//     const socket = io("https://localhost:8444", {
//       transports: ["websocket"],
//       secure: true,
//     });

//     socket.on("task:created", (newTask: Task) => {
//       setTasks((prevTasks) => {
//         if (prevTasks.some((t) => t.id === newTask.id)) return prevTasks;
//         return [...prevTasks, newTask];
//       });
//     });

//     socket.on("task:updated", (updatedTask: Task) => {
//       setTasks((prevTasks) =>
//         prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
//       );
//     });

//     socket.on("task:deleted", ({ id }: { id: number }) => {
//       setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
//     });

//     socket.on("board:updated", () => {
//       fetchTasks();
//     });

//     socket.on("notification", (data: { message: string }) => {
//       toast(data.message, {
//         icon: "🔔",
//         position: "top-left",
//         style: {
//           border: "1px solid #3b82f6",
//           padding: "16px",
//           color: "#3b82f6",
//         },
//       });
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const fetchTasks = () => {
//     // Fixed the teammate's 'res.data' bug by safely extracting the array
//     api
//       .get(`/boards/tasks?projectId=${PROJECT_ID}&timestamp=${Date.now()}`)
//       .then((res) => {
//         const taskData = res.data || res; // Handles both Axios and custom unwrapped clients
//         setTasks(Array.isArray(taskData) ? taskData : []);
//         setLoading(false);
//       })
//       .catch((err) => console.error(err));
//   };

//   const openNewTaskModal = (status: string) => {
//     setActiveStatus(status);
//     setEditingTask(null);
//     setIsModalOpen(true);
//   };

//   const openEditTaskModal = (task: Task) => {
//     setEditingTask(task);
//     setIsModalOpen(true);
//   };

//   // RESTORED YOUR FULL SAVING LOGIC
//   const handleSaveTask = async (taskData: Partial<Task>, file?: File) => {
//     try {
//       let dataToSend: any;
//       let config = {};

//       if (file) {
//         const formData = new FormData();
//         formData.append("title", taskData.title || "");
//         formData.append("description", taskData.description || "");
//         formData.append("status", taskData.status || "TODO");
//         formData.append("priority", taskData.priority || "Medium");
//         formData.append("projectId", String(PROJECT_ID));
//         if (taskData.assignedTo)
//           formData.append("assignedTo", String(taskData.assignedTo));
//         if (taskData.startDate)
//           formData.append("startDate", taskData.startDate);
//         if (taskData.dueDate) formData.append("dueDate", taskData.dueDate);
//         formData.append("file", file);

//         dataToSend = formData;
//         config = { headers: { "Content-Type": "multipart/form-data" } };
//       } else {
//         dataToSend = {
//           title: taskData.title,
//           description: taskData.description,
//           status: taskData.status,
//           priority: taskData.priority,
//           projectId: PROJECT_ID,
//           assignedTo: taskData.assignedTo ? Number(taskData.assignedTo) : null,
//           startDate: taskData.startDate,
//           dueDate: taskData.dueDate,
//         };
//         config = { headers: { "Content-Type": "application/json" } };
//       }

//       if (taskData.id) {
//         await api.patch(`/boards/tasks/${taskData.id}`, dataToSend, config);
//         toast.success("Task updated successfully!");
//       } else {
//         await api.post("/boards/tasks", dataToSend, config);
//         toast.success("New task created!");
//       }
//       setIsModalOpen(false);
//       setEditingTask(null);
//       fetchTasks();
//     } catch (error) {
//       console.error("Error saving task:", error);
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   const handleDeleteTask = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this task?")) return;
//     try {
//       await api.delete(`/boards/tasks/${id}`);
//       toast.success("Task deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete task:", error);
//       toast.error("Could not delete task. Please try again.");
//     }
//   };

//   // RESTORED YOUR BULLETPROOF DRAG AND DROP LOGIC
//   const onDragEnd = async (result: DropResult) => {
//     const { destination, source, draggableId } = result;
//     if (!destination) return;
//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     )
//       return;

//     const movedTaskId = parseInt(draggableId);

//     if (source.droppableId === destination.droppableId) {
//       const columnId = source.droppableId;
//       const columnTasks = getTasksByStatus(columnId);
//       const newColumnTasks = Array.from(columnTasks);

//       const [movedTask] = newColumnTasks.splice(source.index, 1);
//       newColumnTasks.splice(destination.index, 0, movedTask);

//       const updatedColumnTasks = newColumnTasks.map((t, index) => ({
//         ...t,
//         position: index,
//       }));
//       const otherTasks = tasks.filter((t) => t.status !== columnId);
//       setTasks([...otherTasks, ...updatedColumnTasks]);

//       try {
//         const taskIds = updatedColumnTasks.map((t) => t.id);
//         await api.patch("/boards/tasks/reorder", { taskIds });
//       } catch (error) {
//         console.error("Failed to reorder:", error);
//         toast.error("Failed to save new order. Please try again.");
//         fetchTasks();
//       }
//       return;
//     }

//     const newStatus = destination.droppableId;
//     const oldStatus = source.droppableId;

//     const sourceColumnTasks = getTasksByStatus(oldStatus);
//     const destColumnTasks = getTasksByStatus(newStatus);

//     const newSourceTasks = Array.from(sourceColumnTasks);
//     const [movedTask] = newSourceTasks.splice(source.index, 1);
//     const updatedTask = { ...movedTask, status: newStatus };

//     const newDestTasks = Array.from(destColumnTasks);
//     newDestTasks.splice(destination.index, 0, updatedTask);

//     const finalizedSourceTasks = newSourceTasks.map((t, index) => ({
//       ...t,
//       position: index,
//     }));
//     const finalizedDestTasks = newDestTasks.map((t, index) => ({
//       ...t,
//       position: index,
//     }));

//     const otherTasks = tasks.filter(
//       (t) => t.status !== oldStatus && t.status !== newStatus,
//     );
//     setTasks([...otherTasks, ...finalizedSourceTasks, ...finalizedDestTasks]);

//     try {
//       await api.patch(`/boards/tasks/${movedTaskId}`, { status: newStatus });
//       const destTaskIds = finalizedDestTasks.map((t) => t.id);
//       await api.patch(`/boards/tasks/reorder`, { taskIds: destTaskIds });
//     } catch (error) {
//       console.error("Failed to move task:", error);
//       fetchTasks();
//     }
//   };

//   const getTasksByStatus = (status: string) => {
//     if (!Array.isArray(tasks)) return [];
//     return tasks
//       .filter((task) => task.status === status)
//       .sort((a, b) => a.position - b.position)
//       .filter((task) => {
//         if (!searchQuery) return true;
//         const searchLower = searchQuery.toLowerCase();
//         return (
//           task.title.toLowerCase().includes(searchLower) ||
//           (task.description &&
//             task.description.toLowerCase().includes(searchLower))
//         );
//       })
//       .filter((task) => {
//         if (!filterPriority) return true;
//         return task.priority === filterPriority;
//       });
//   };

//   // return (
//   //   <div className="flex-1 flex flex-col overflow-hidden bg-white">
//   //     <Toaster position="bottom-right" />

//   //     {/* Search Header */}
//   //     <header className="h-16 flex items-center justify-between px-8 border-b border-gray-100">
//   //       <div className="flex items-center gap-3 text-sm text-gray-400">
//   //         <Home size={16} />
//   //         <span>/</span>
//   //         <span className="text-gray-900 font-medium">Product Launch</span>
//   //       </div>
//   //       <div className="relative">
//   //         <Search
//   //           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//   //           size={18}
//   //         />
//   //         <input
//   //           type="text"
//   //           placeholder="Search tasks..."
//   //           value={searchQuery}
//   //           onChange={(e) => setSearchQuery(e.target.value)}
//   //           className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 transition-all"
//   //         />
//   //       </div>
//   //     </header>

//   //     {/* Board Content */}
//   //     <div className="flex-1 p-8 overflow-hidden flex flex-col">
//   //       <div className="flex justify-between items-end mb-8">
//   //         <h1 className="text-3xl font-bold text-gray-900">Product Launch</h1>
//   //         <div className="relative">
//   //           <button
//   //             onClick={() => setIsFilterOpen(!isFilterOpen)}
//   //             className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm ${filterPriority ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white"}`}
//   //           >
//   //             <Filter size={16} />{" "}
//   //             {filterPriority ? `${filterPriority} Priority` : "Filter"}
//   //             {filterPriority && (
//   //               <X
//   //                 size={14}
//   //                 className="ml-1"
//   //                 onClick={(e) => {
//   //                   e.stopPropagation();
//   //                   setFilterPriority(null);
//   //                 }}
//   //               />
//   //             )}
//   //           </button>

//   //           {isFilterOpen && (
//   //             <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
//   //               {["High", "Medium", "Low"].map((p) => (
//   //                 <button
//   //                   key={p}
//   //                   onClick={() => {
//   //                     setFilterPriority(p);
//   //                     setIsFilterOpen(false);
//   //                   }}
//   //                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
//   //                 >
//   //                   <span
//   //                     className={`w-2 h-2 rounded-full ${p === "High" ? "bg-red-500" : p === "Medium" ? "bg-amber-500" : "bg-emerald-500"}`}
//   //                   />
//   //                   {p}
//   //                 </button>
//   //               ))}
//   //             </div>
//   //           )}
//   //         </div>
//   //       </div>

//   //       <DragDropContext onDragEnd={onDragEnd}>
//   //         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto">
//   //           {["TODO", "IN_PROGRESS", "REVIEW", "DONE"].map((status) => (
//   //             <KanbanColumn
//   //               key={status}
//   //               id={status}
//   //               title={status.replace("_", " ")}
//   //               count={getTasksByStatus(status).length}
//   //               tasks={getTasksByStatus(status)}
//   //               onAdd={() => openNewTaskModal(status)}
//   //               onDelete={handleDeleteTask}
//   //               onEdit={openEditTaskModal}
//   //               isLoading={loading}
//   //               isReadOnly={canEdit}
//   //             />
//   //           ))}
//   //         </div>
//   //       </DragDropContext>
//   //     </div>

//   //     <NewTaskModal
//   //       isOpen={isModalOpen}
//   //       onClose={() => setIsModalOpen(false)}
//   //       onSave={handleSaveTask}
//   //       taskToEdit={editingTask}
//   //       defaultStatus={activeStatus}
//   //       isReadOnly={canEdit}
//   //     />
//   //   </div>
//   // );

//   return (
//   <div className="flex-1 flex flex-col overflow-hidden">
//     <Toaster position="bottom-right" />

//     {/* Board Content */}
//     <div className="p-8 flex-1 overflow-hidden flex flex-col">

//       {/* Header row */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <p className="text-xs text-gray-400 font-medium mb-1">Project</p>
//           <h1 className="text-3xl font-bold text-gray-900">
//             {projectName ?? 'Board'}
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Search */}
//           <div className="relative">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="Search tasks..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56 transition-all"
//             />
//           </div>

//           {/* Filter */}
//           <div className="relative">
//             <button
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//               className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
//                 filterPriority
//                   ? 'bg-blue-50 border-blue-200 text-blue-600'
//                   : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
//               }`}
//             >
//               <Filter size={15} />
//               {filterPriority ? `${filterPriority} Priority` : 'Filter'}
//               {filterPriority && (
//                 <X
//                   size={13}
//                   className="ml-1"
//                   onClick={(e) => { e.stopPropagation(); setFilterPriority(null); }}
//                 />
//               )}
//             </button>

//             {isFilterOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-1.5 z-50">
//                 {['High', 'Medium', 'Low'].map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => { setFilterPriority(p); setIsFilterOpen(false); }}
//                     className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
//                   >
//                     <span className={`w-2 h-2 rounded-full ${
//                       p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
//                     }`} />
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Kanban columns */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto">
//           {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((status) => (
//             <KanbanColumn
//               key={status}
//               id={status}
//               title={status.replace('_', ' ')}
//               count={getTasksByStatus(status).length}
//               tasks={getTasksByStatus(status)}
//               onAdd={() => openNewTaskModal(status)}
//               onDelete={handleDeleteTask}
//               onEdit={openEditTaskModal}
//               isLoading={loading}
//               isReadOnly={canEdit}
//             />
//           ))}
//         </div>
//       </DragDropContext>
//     </div>

//     <NewTaskModal
//       isOpen={isModalOpen}
//       onClose={() => setIsModalOpen(false)}
//       onSave={handleSaveTask}
//       taskToEdit={editingTask}
//       defaultStatus={activeStatus}
//       isReadOnly={canEdit}
//     />
//   </div>
// );
// }


import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Search, Filter, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import api from "../api/kanbanClient";
import KanbanColumn from "../components/kanban/KanbanColumn";
import NewTaskModal from "../components/kanban/NewTaskModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects";
import { useAuth } from '../hooks/useAuth';
import { useSearchParams } from "react-router-dom";
import { membersApi } from "../api/members";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: number;
  startDate?: string;
  dueDate?: string;
  attachmentUrl?: string;
  position: number;
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState("TODO");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const PROJECT_ID = Number(searchParams.get('projectId')) || 1;

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  // const projectName = projects.find(p => p.id === PROJECT_ID)?.title;

  // const USER_ROLE = "ADMIN";
  // const canEdit = USER_ROLE === "ADMIN" || USER_ROLE === "PM";

  const currentProject = projects.find(p => p.id === PROJECT_ID);
  const projectName = currentProject?.title;
  const currentMember = currentProject?.members?.find(
    (member: any) => member.userId === Number(user?.id)
  );
  const USER_ROLE = currentMember?.role;
  const isOwner = currentProject?.owner?.id === Number(user?.id);
  const canEdit = isOwner || USER_ROLE === "ADMIN" || USER_ROLE === "OWNER";

  useEffect(() => {
    fetchTasks();


    const socket = io("https://localhost", {
      path: '/api/socket.io/',
      transports: ["websocket"],
      secure: true,
    });

    // const socket = io("https://localhost:8444", {
    //   transports: ["websocket"],
    //   secure: true,
    // });

    socket.on("task:created", (newTask: Task) => {
      setTasks((prevTasks) => {
        if (prevTasks.some((t) => t.id === newTask.id)) return prevTasks;
        return [...prevTasks, newTask];
      });
    });

    socket.on("task:updated", (updatedTask: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    });

    socket.on("task:deleted", ({ id }: { id: number }) => {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    });

    socket.on("board:updated", () => {
      fetchTasks();
    });

    socket.on("notification", (data: { message: string }) => {
      toast(data.message, {
        icon: "🔔",
        position: "top-left",
        style: {
          border: "1px solid #3b82f6",
          padding: "16px",
          color: "#3b82f6",
        },
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchTasks = () => {
    api
      .get(`/tasks/?projectId=${PROJECT_ID}&timestamp=${Date.now()}`)
      .then((res) => {
        const taskData = res.data || res;
        setTasks(Array.isArray(taskData) ? taskData : []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const openNewTaskModal = (status: string) => {
    setActiveStatus(status);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>, file?: File) => {
    try {
      let dataToSend: any;
      let config = {};

      if (file) {
        const formData = new FormData();
        formData.append("title", taskData.title || "");
        formData.append("description", taskData.description || "");
        formData.append("status", taskData.status || "TODO");
        formData.append("priority", taskData.priority || "Medium");
        formData.append("projectId", String(PROJECT_ID));
        formData.append("createdBy", String(Number(user?.id) || 1));
        if (taskData.assignedTo)
          formData.append("assignedTo", String(taskData.assignedTo));
        if (taskData.startDate)
          formData.append("startDate", taskData.startDate);
        if (taskData.dueDate) formData.append("dueDate", taskData.dueDate);
        formData.append("file", file);
        dataToSend = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        dataToSend = {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          projectId: PROJECT_ID,
          createdBy: Number(user?.id) || 1, 
          assignedTo: taskData.assignedTo ? Number(taskData.assignedTo) : null,
          startDate: taskData.startDate || undefined,
          dueDate: taskData.dueDate || undefined,
        };
        config = { headers: { "Content-Type": "application/json" } };
      }

      if (taskData.id) {
        if (dataToSend instanceof FormData)
          dataToSend.delete("createdBy");
        else
          delete dataToSend.createdBy;
        await api.patch(`/tasks/${taskData.id}/`, dataToSend, config);
        queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        toast.success("Task updated successfully!");
      } else {
        await api.post("/tasks/", dataToSend, config);
        toast.success("New task created!");
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}/`);
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Could not delete task. Please try again.");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const movedTaskId = parseInt(draggableId);

    if (source.droppableId === destination.droppableId) {
      const columnId = source.droppableId;
      const columnTasks = getTasksByStatus(columnId);
      const newColumnTasks = Array.from(columnTasks);
      const [movedTask] = newColumnTasks.splice(source.index, 1);
      newColumnTasks.splice(destination.index, 0, movedTask);
      const updatedColumnTasks = newColumnTasks.map((t, index) => ({ ...t, position: index }));
      const otherTasks = tasks.filter((t) => t.status !== columnId);
      setTasks([...otherTasks, ...updatedColumnTasks]);
      try {
        const taskIds = updatedColumnTasks.map((t) => t.id);
        await api.patch("/tasks/reorder/", { taskIds });
      } catch (error) {
        console.error("Failed to reorder:", error);
        toast.error("Failed to save new order. Please try again.");
        fetchTasks();
      }
      return;
    }

    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;
    const sourceColumnTasks = getTasksByStatus(oldStatus);
    const destColumnTasks = getTasksByStatus(newStatus);
    const newSourceTasks = Array.from(sourceColumnTasks);
    const [movedTask] = newSourceTasks.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: newStatus };
    const newDestTasks = Array.from(destColumnTasks);
    newDestTasks.splice(destination.index, 0, updatedTask);
    const finalizedSourceTasks = newSourceTasks.map((t, index) => ({ ...t, position: index }));
    const finalizedDestTasks = newDestTasks.map((t, index) => ({ ...t, position: index }));
    const otherTasks = tasks.filter((t) => t.status !== oldStatus && t.status !== newStatus);
    setTasks([...otherTasks, ...finalizedSourceTasks, ...finalizedDestTasks]);

    try {
      await api.patch(`/tasks/${movedTaskId}`, { status: newStatus });
      const destTaskIds = finalizedDestTasks.map((t) => t.id);
      await api.patch(`/tasks/reorder/`, { taskIds: destTaskIds });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    } catch (error) {
      console.error("Failed to move task:", error);
      fetchTasks();
    }
  };

  const getTasksByStatus = (status: string) => {
    if (!Array.isArray(tasks)) return [];
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position)
      .filter((task) => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
        );
      })
      .filter((task) => {
        if (!filterPriority) return true;
        return task.priority === filterPriority;
      });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Toaster position="bottom-right" />

      <div className="p-8 flex-1 overflow-hidden flex flex-col">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Project</p>
            <h1 className="text-3xl font-bold text-gray-900">
              {projectName ?? 'Board'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
                  filterPriority
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <Filter size={15} />
                {filterPriority ? `${filterPriority} Priority` : 'Filter'}
                {filterPriority && (
                  <X size={13} className="ml-1" onClick={(e) => { e.stopPropagation(); setFilterPriority(null); }} />
                )}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-1.5 z-50">
                  {['High', 'Medium', 'Low'].map((p) => (
                    <button
                      key={p}
                      onClick={() => { setFilterPriority(p); setIsFilterOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kanban columns */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto">
            {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((status) => (
              <KanbanColumn
                key={status}
                id={status}
                title={status.replace('_', ' ')}
                count={getTasksByStatus(status).length}
                tasks={getTasksByStatus(status)}
                onAdd={() => openNewTaskModal(status)}
                onDelete={handleDeleteTask}
                onEdit={openEditTaskModal}
                isLoading={loading}
                isReadOnly={canEdit}
                projectId={PROJECT_ID}
                userRole={USER_ROLE}
                currentUserId={Number(user?.id)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        defaultStatus={activeStatus}
        isReadOnly={canEdit}
      /> */}
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        defaultStatus={activeStatus}
        isReadOnly={canEdit}
        projectId={PROJECT_ID}
      />
    </div>
  );
}
