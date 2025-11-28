import React, { useState } from 'react';
import { Project, Task, User } from '../types';
import { XIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';
import LazyImage from './LazyImage';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'comments' | 'status'>) => void;
  project: Project;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, project }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignees, setAssignees] = useState<User[]>([]);
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const resetState = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setAssignees([]);
    setPriority('medium');
  };

  const handleToggleAssignee = (user: User) => {
    setAssignees(prev => 
        prev.some(a => a.id === user.id) 
        ? prev.filter(a => a.id !== user.id)
        : [...prev, user]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      addNotification({ type: 'error', message: 'Task title is required.' });
      return;
    }
    onAddTask({ title, description, dueDate, assignees, priority });
    addNotification({ type: 'success', message: 'Task added!' });
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-xl w-full max-w-lg border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Task</h2>
          <button onClick={onClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold mb-2">Title <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-light-bg border border-light-border rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
            </div>
             <div>
              <label className="block text-sm font-semibold mb-2">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple appearance-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
             <label className="block text-sm font-semibold mb-2">Assignees</label>
             <div className="flex flex-wrap gap-2">
                {project.contributors.map(c => (
                    <button key={c.user.id} onClick={() => handleToggleAssignee(c.user)} className={`flex items-center space-x-2 p-1 pr-3 rounded-full border ${assignees.some(a=>a.id === c.user.id) ? 'bg-brand-purple/10 border-brand-purple' : 'bg-light-bg border-light-border'}`}>
                        <LazyImage src={c.user.avatarUrl} alt={c.user.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-medium">{c.user.name}</span>
                    </button>
                ))}
             </div>
          </div>
        </div>
        <div className="p-4 border-t border-light-border flex justify-end items-center space-x-3">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-light-bg hover:bg-light-border">Cancel</button>
          <button onClick={handleSubmit} className="bg-brand-purple text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700">Add Task</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;