import React, { useState, useMemo, useCallback } from 'react';
import { User } from '../types';
import { users as allUsers } from '../data';
import LazyImage from './LazyImage';
import { SearchIcon, XIcon, CheckIcon } from './icons';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onStartConversation: (participants: User[], message: string) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ isOpen, onClose, currentUser, onStartConversation }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const availableUsers = useMemo(() => {
    return Object.values(allUsers).filter(user =>
      user.id !== currentUser.id &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.handle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, currentUser.id]);

  const handleUserToggle = useCallback((user: User) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  }, []);

  const handleStart = () => {
    if (selectedUsers.length === 0 || !message.trim()) return;
    onStartConversation(selectedUsers, message.trim());
    resetState();
  };
  
  const resetState = () => {
    setSelectedUsers([]);
    setMessage('');
    setSearchQuery('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-light-surface rounded-xl max-w-md w-full border border-light-border shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-bold">New Message</h3>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-light-bg"><XIcon className="w-5 h-5"/></button>
        </div>

        <div className="p-4 relative flex-shrink-0">
          <SearchIcon className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary"/>
          <input
            type="text"
            placeholder="Search for people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-light-bg border border-light-border rounded-lg h-11 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="px-4 pb-2 border-b border-light-border flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-2 bg-brand-pink/10 rounded-full px-2 py-1">
                  <LazyImage src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-medium text-brand-pink">{user.name}</span>
                  <button onClick={() => handleUserToggle(user)}>
                    <XIcon className="w-4 h-4 text-brand-pink" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-y-auto px-2 py-2">
          {availableUsers.map(user => (
            <div
              key={user.id}
              onClick={() => handleUserToggle(user)}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedUsers.find(u => u.id === user.id) ? 'bg-brand-pink/10' : 'hover:bg-light-bg'
              }`}
            >
              <LazyImage src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-light-text-secondary">{user.handle}</p>
              </div>
              {selectedUsers.find(u => u.id === user.id) && <CheckIcon className="w-5 h-5 text-brand-pink" />}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-light-border mt-auto flex-shrink-0">
          <textarea
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-light-bg border border-light-border rounded-lg p-3 mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          <button
            onClick={handleStart}
            disabled={selectedUsers.length === 0 || !message.trim()}
            className="w-full bg-brand-pink text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-pink-accent"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
