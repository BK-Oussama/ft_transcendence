import { useState, useEffect, useRef } from "react";
import {
  X,
  Paperclip,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { membersApi } from "../../api/members";
import { useQuery } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import api from '../../api/kanbanClient';

interface Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: number;
  assigned_to?: number;
  startDate?: string;
  dueDate?: string;
  start_date?: string;
  due_date?: string;
  attachment_url?: string;
  attachmentUrl?: string;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any, file?: File, onProgress?: (p: number) => void) => Promise<void>;
  taskToEdit?: Task | null;
  defaultStatus: string;
  isReadOnly?: boolean;
  projectId?: number;
}

export default function NewTaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  defaultStatus,
  isReadOnly = false,
  projectId,
}: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: members = [] } = useQuery({
    queryKey: ['members', projectId],
    queryFn: () => membersApi.getAll(projectId!),
    enabled: isOpen && !!projectId,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || "");
        setPriority(taskToEdit.priority || "Medium");
        setAssignedTo(taskToEdit.assignedTo || taskToEdit.assigned_to);
        const rawStart = taskToEdit.startDate || taskToEdit.start_date;
        const rawDue = taskToEdit.dueDate || taskToEdit.due_date;
        setStartDate(rawStart ? String(rawStart).substring(0, 10) : "");
        setDueDate(rawDue ? String(rawDue).substring(0, 10) : "");
        setExistingFile(
          taskToEdit.attachment_url || taskToEdit.attachmentUrl || null,
        );
      } else {
        setTitle("");
        setDescription("");
        setPriority("Medium");
        setAssignedTo(undefined);
        setStartDate("");
        setDueDate("");
        setExistingFile(null);
      }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleDownload = async (fileName: string) => {
    try {
      const response = await api.get(`/tasks/attachments/${fileName}`, {
        responseType: 'blob',
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName); 
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download the file securely.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await onSave(
      {
        id: taskToEdit?.id,
        title,
        description,
        status: taskToEdit ? taskToEdit.status : defaultStatus,
        priority,
        assignedTo,
        startDate,
        dueDate,
        attachmentUrl: existingFile ? existingFile : null,
      },
      selectedFile || undefined,
      (progress) => setUploadProgress(progress)
    );

    onClose();
  } catch (error) {
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large! Max limit is 500MB.");
      e.target.value = "";
      return;
    }

    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type! Upload an image, document, or video.");
      e.target.value = ""; 
      return;
    }

    setSelectedFile(file);
  };



  return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

    {/* Modal */}
    <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      {/* Top accent */}
      <div className="h-1.5 w-full bg-blue-500" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {taskToEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {taskToEdit ? 'Update task details' : 'Add a new task to this board'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-6">

        {/* Title */}
        <input
          disabled={!isReadOnly}
          readOnly={!isReadOnly}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full px-4 py-3 text-base font-semibold text-slate-800 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
        />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Start Date
            </label>
            <div className="relative">
              <CalendarIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                readOnly={!isReadOnly}
                type="date"
                value={startDate || ''}
                max={dueDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Due Date
            </label>
            <div className="relative">
              <CalendarIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                readOnly={!isReadOnly}
                type="date"
                value={dueDate || ''}
                min={startDate || undefined}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Priority
          </label>
          <div className="flex gap-2">
            {['Low', 'Medium', 'High'].map((p) => (
              <button
                disabled={!isReadOnly}
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all
                  ${priority === p
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-slate-50'
                  }
                  ${!isReadOnly ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Assign To */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Assign To
          </label>
          <div className="relative">
            
            <select
              disabled={!isReadOnly}
              value={assignedTo || ''}
              onChange={(e) => setAssignedTo(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.name}
                </option>
              ))}
            </select>
            
            {isReadOnly && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown size={15} />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            disabled={!isReadOnly}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details to this task..."
            rows={4}
            className="w-full px-4 py-3 resize-none text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none placeholder:text-slate-300"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Attachments
          </label>
          {isReadOnly && (
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          )}
          <div
            onClick={isReadOnly && !isUploading ? handleFileClick : undefined}
            className={`border border-dashed rounded-xl p-4 flex items-center justify-center gap-2 transition-colors
              ${selectedFile || existingFile ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-400'}
              ${isReadOnly && !isUploading ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default opacity-70'}`}
          >
            <Paperclip size={15} />
            <span className="text-sm font-medium">
              {selectedFile ? selectedFile.name : existingFile ? existingFile : isReadOnly ? 'Click to attach a file' : 'No attachments'}
            </span>
          </div>

          {isUploading && uploadProgress > 0 && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Uploading File...
                </span>
                <span className="text-xs font-bold text-blue-600">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {!selectedFile && existingFile && !isUploading && (
            <div className="mt-2 flex items-center justify-end gap-3 text-xs">
              {isReadOnly && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setExistingFile(null)} 
                    className="text-red-500 hover:text-red-700 font-bold transition-colors"
                  >
                    Delete File
                  </button>
                  <span className="text-slate-300">|</span>
                </>
              )}

              <button 
                type="button"
                onClick={() => handleDownload(existingFile)}
                className="text-blue-500 hover:text-blue-700 font-bold transition-colors"
              >
                Download
              </button>

            </div>
          )}

          {selectedFile && !isUploading && (
            <div className="mt-2 text-xs text-right">
              <button 
                type="button" 
                onClick={() => setSelectedFile(null)} 
                className="text-red-500 hover:text-red-700 font-bold transition-colors"
              >
                Remove Selection
              </button>
            </div>
          )}

        </div>

        {/* Actions */}
        {isReadOnly && (
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className={`px-5 py-2.5 rounded-xl font-bold transition-colors text-sm
                ${isUploading ? 'text-slate-400 opacity-50 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-500/25
                ${isUploading ? 'opacity-70 cursor-wait' : 'hover:from-blue-600 hover:to-indigo-600 hover:-translate-y-0.5 active:translate-y-0'}
              `}
            >
              {isUploading ? 'Saving...' : (taskToEdit ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        )}
      </form>
    </div>
  </div>
);
}
