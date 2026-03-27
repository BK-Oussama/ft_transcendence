import { useState } from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';

interface WorkspaceCalendarProps {
    tasks: Task[];
}

interface Task {
    id: number;
    title: string;
    description: string;
    start_date: string;
    due_date: string;
    status: string;
    color: string;
    workspace_id: number;
    projectName?: string;
}

export default function WorkspaceCalendar({ tasks }: WorkspaceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calendar Helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  // Generate blank spaces for days before the 1st of the month
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {monthName} <span className="text-slate-400 font-medium">{currentDate.getFullYear()}</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-b border-slate-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-50 last:border-0">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[120px]">
        {/* Render Blanks */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="bg-slate-50/30 border-r border-b border-slate-50" />
        ))}

        {days.map(day => {
  // 1. Identify Today
  const isToday = 
    day === new Date().getDate() && 
    currentDate.getMonth() === new Date().getMonth() && 
    currentDate.getFullYear() === new Date().getFullYear();

  const dayTasks = tasks.filter(t => 
    new Date(t.due_date).getDate() === day && 
    new Date(t.due_date).getMonth() === currentDate.getMonth()
  );
  
  return (
    <div 
      key={day} 
      className={`p-2 border-r border-b border-slate-50 transition-colors group relative
        ${isToday ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`} // Today's Box Color
    >
      <span className={`text-xs font-bold transition-colors 
        ${isToday ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900'}`}>
        {day}
      </span>
      
      <div className="mt-1 space-y-1">
       {dayTasks.slice(0, 3).map((task, idx) => (
          <div
            key={idx}
            title={`${task.title}${task.projectName ? ` · ${task.projectName}` : ''}`}
            className={`px-2 py-1 rounded-md text-[10px] font-bold truncate cursor-default ${task.color || 'bg-blue-50 text-blue-700'}`}
          >
            {task.title}
          </div>
        ))}
        {dayTasks.length > 3 && (
          <div className="px-2 py-0.5 text-[9px] font-bold text-slate-400">
            +{dayTasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}
