import React, { useState } from 'react';
import { XIcon, UsersIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';
import { Team } from '../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (teamData: Omit<Team, 'id' | 'members' | 'projectIds' | 'createdAt'>) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { addNotification } = useNotifications();

  const resetState = () => {
    setName('');
    setDescription('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      addNotification({ type: 'error', message: 'Team name is required.' });
      return;
    }
    onCreate({ name, description });
    addNotification({ type: 'success', message: `Team "${name}" created successfully!` });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-xl w-full max-w-lg border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Create New Team</h2>
          <button onClick={handleClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold mb-2">Team Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="e.g., Synthwave Syndicate"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-light-bg border border-light-border rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple"
              placeholder="What is this team about?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Invite Members</label>
            <div className="relative">
                 <input
                    type="text"
                    className="w-full bg-light-bg border border-light-border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    placeholder="Search by name or @handle..."
                />
                <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary"/>
            </div>
             <p className="text-xs text-light-text-secondary mt-1">You can invite more members after creating the team.</p>
          </div>
        </div>

        <div className="p-4 border-t border-light-border flex justify-end items-center space-x-3">
          <button onClick={handleClose} className="px-6 py-2 rounded-lg bg-light-bg hover:bg-light-border border border-light-border">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-brand-purple text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700">
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;