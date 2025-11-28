import React from 'react';
import { Project, Task } from '../types';
// FIX: The CalendarIcon and FlagIcon components were imported but not defined in icons.tsx.
// They have now been added to icons.tsx and implemented in the UI below.
// The unused MessageSquareIcon import has been removed.
import { XIcon, UserIcon, CalendarIcon, FlagIcon } from './icons';
import LazyImage from './LazyImage';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  project: Project;
}

const priorityStyles: Record<Task['priority'], { bg: string; text: string; }> = {
    low: { bg: 'bg-green-100', text: 'text-green-800' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    high: { bg: 'bg-red-100', text: 'text-red-800' },
};

const statusStyles: Record<Task['status'], { bg: string; text: string; }> = {
    todo: { bg: 'bg-gray-100', text: 'text-gray-800' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800' },
    completed: { bg: 'bg-green-100', text: 'text-green-800' },
};

// FIX: Updated DetailItem to accept and display an icon for better UI clarity.
const DetailItem: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div>
        <h4 className="flex items-center space-x-2 text-sm font-semibold text-light-text-secondary mb-2">
            {icon}
            <span>{label}</span>
        </h4>
        {children}
    </div>
);

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, project }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-xl w-full max-w-2xl border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-start">
          <div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[task.status].bg} ${statusStyles[task.status].text}`}>
                {task.status.replace('-', ' ')}
            </span>
            <h2 className="text-xl font-bold mt-2">{task.title}</h2>
            <p className="text-sm text-light-text-secondary">in project <span className="font-semibold text-brand-purple">{project.title}</span></p>
          </div>
          <button onClick={onClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg flex-shrink-0">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h3 className="font-bold mb-2 text-light-text-primary">Description</h3>
                    <p className="text-light-text-secondary whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
                </div>
                 <div>
                    <h3 className="font-bold mb-2 text-light-text-primary">Comments ({task.comments.length})</h3>
                    <div className="space-y-3">
                        {task.comments.map((comment, index) => (
                            <div key={index} className="flex items-start space-x-2">
                                <LazyImage src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full" />
                                <div className="bg-light-bg p-3 rounded-lg text-sm w-full">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{comment.user.name}</p>
                                        <p className="text-xs text-light-text-muted">{new Date(comment.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p className="mt-1">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Sidebar */}
            <aside className="space-y-4">
                 {/* FIX: Using the updated DetailItem component with icons for Assignees, Due Date, and Priority. */}
                 <DetailItem icon={<UserIcon className="w-4 h-4" />} label="Assignees">
                     <div className="space-y-2 pl-6">
                        {task.assignees.map(user => (
                           <div key={user.id} className="flex items-center space-x-2">
                               <LazyImage src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                               <span className="font-medium text-sm">{user.name}</span>
                           </div>
                        ))}
                     </div>
                 </DetailItem>
                 <DetailItem icon={<CalendarIcon className="w-4 h-4" />} label="Due Date">
                    <p className="text-sm font-medium pl-6">{new Date(task.dueDate).toLocaleDateString('en-CA')}</p>
                 </DetailItem>
                 <DetailItem icon={<FlagIcon className="w-4 h-4" />} label="Priority">
                    <div className="pl-6">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${priorityStyles[task.priority].bg} ${priorityStyles[task.priority].text}`}>
                            {task.priority}
                        </span>
                    </div>
                 </DetailItem>
            </aside>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;