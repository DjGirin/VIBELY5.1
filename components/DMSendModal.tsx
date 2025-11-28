import React, { useState, useMemo, useCallback } from 'react';
import { Post, User } from '../types';
import { users } from '../data';
import LazyImage from './LazyImage';
import { SearchIcon, XIcon, CheckIcon } from './icons';

interface DMSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onSend: (selectedUsers: User[], message?: string) => void;
}

const DMSendModal: React.FC<DMSendModalProps> = ({ isOpen, onClose, post, onSend }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const availableUsers = useMemo(() => {
    return Object.values(users).filter(user =>
      user.id !== 'user1' && // Exclude self
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.handle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleUserToggle = useCallback((user: User) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  }, []);

  const handleSend = () => {
    if (selectedUsers.length === 0) return;
    onSend(selectedUsers, message);
    setSelectedUsers([]);
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-light-surface rounded-xl max-w-md w-full border border-light-border shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-light-border flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-bold">Share Post</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-light-bg"><XIcon className="w-5 h-5"/></button>
        </div>

        {/* Search */}
        <div className="p-4 relative flex-shrink-0">
          <SearchIcon className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary"/>
          <input
            type="text"
            placeholder="사용자 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-light-bg border border-light-border rounded-lg h-11 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>

        {/* Selected Users */}
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

        {/* User List */}
        <div className="overflow-y-auto px-2 py-2">
          {availableUsers.map(user => (
            <div
              key={user.id}
              onClick={() => handleUserToggle(user)}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedUsers.find(u => u.id === user.id)
                  ? 'bg-brand-pink/10'
                  : 'hover:bg-light-bg'
              }`}
            >
              <LazyImage src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-light-text-secondary">{user.handle}</p>
              </div>
              {selectedUsers.find(u => u.id === user.id) && (
                <CheckIcon className="w-5 h-5 text-brand-pink" />
              )}
            </div>
          ))}
        </div>

        {/* Message Input & Actions */}
        <div className="p-4 border-t border-light-border mt-auto flex-shrink-0">
          <textarea
            placeholder="메시지 추가 (선택사항)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-light-bg border border-light-border rounded-lg p-3 mb-4 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
          <div className="flex justify-end items-center space-x-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-light-bg hover:bg-light-border border border-light-border font-semibold">
              취소
            </button>
            <button
              onClick={handleSend}
              disabled={selectedUsers.length === 0}
              className="bg-brand-pink text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-pink-accent"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMSendModal;