import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { XIcon, PaperclipIcon } from './icons';
import { ThreadCategory, Post } from '../types';
import PostSelectorModal from './PostSelectorModal';
import AttachedPostCard from './AttachedPostCard';


interface ThreadComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: { id: ThreadCategory; label: string }[] = [
    { id: 'feedback', label: '🎧 피드백' },
    { id: 'showcase', label: '✨ 작품공유' },
    { id: 'collaboration', label: '🤝 협업구함' },
    { id: 'challenge', label: '🏆 챌린지' },
    { id: 'general', label: '💬 자유토론' },
];

const ThreadComposerModal: React.FC<ThreadComposerModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ThreadCategory>('feedback');
  const [roles, setRoles] = useState('');
  const [compensation, setCompensation] = useState('');
  const [attachedPost, setAttachedPost] = useState<Post | null>(null);
  const [isPostSelectorOpen, setIsPostSelectorOpen] = useState(false);
  const { addNotification } = useNotifications();

  const resetState = () => {
    setTitle('');
    setContent('');
    setCategory('feedback');
    setRoles('');
    setCompensation('');
    setAttachedPost(null);
    setIsPostSelectorOpen(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      addNotification({ type: 'error', message: 'Title and content are required.' });
      return;
    }
    // In a real app, this would send data to a server
    console.log({
      title,
      content,
      category,
      attachment: attachedPost,
      ...(category === 'collaboration' && { roles: roles.split(','), compensation }),
    });
    addNotification({ type: 'success', message: 'Thread posted successfully!' });
    handleClose();
  };
  
  const handleSelectPost = (post: Post) => {
    setAttachedPost(post);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-light-surface rounded-xl w-full max-w-2xl border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
          <div className="p-4 border-b border-light-border flex justify-between items-center">
            <h2 className="text-xl font-bold">Create a new post</h2>
            <button onClick={handleClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg">
              <XIcon className="w-6 h-6"/>
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ThreadCategory)}
                className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-pink"
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Enter a descriptive title"
                maxLength={150}
              />
            </div>

            {category === 'collaboration' && (
              <div className="p-4 bg-brand-pink/5 rounded-lg border border-brand-pink/20 space-y-4">
                <h3 className="font-bold text-brand-pink">Collaboration Details</h3>
                <div>
                  <label className="block text-sm font-semibold mb-2">Roles Needed</label>
                  <input
                    type="text"
                    value={roles}
                    onChange={(e) => setRoles(e.target.value)}
                    className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="e.g., Vocalist, Producer, Lyricist"
                  />
                  <p className="text-xs text-light-text-secondary mt-1">Separate roles with a comma.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Compensation</label>
                  <input
                    type="text"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="e.g., Revenue Share 50/50, $200 Flat Fee"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Content <span className="text-red-500">*</span></label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-light-bg border border-light-border rounded-lg p-3 h-40 resize-y focus:outline-none focus:ring-2 focus:ring-brand-pink"
                placeholder="Tell us more... (Markdown supported)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Attachment</label>
              {attachedPost ? (
                  <div className="relative">
                      <AttachedPostCard post={attachedPost} />
                      <button 
                        onClick={() => setAttachedPost(null)} 
                        className="absolute top-2 right-2 bg-light-surface/50 backdrop-blur-sm p-1 rounded-full text-light-text-secondary hover:bg-light-bg hover:text-light-text-primary"
                        aria-label="Remove attachment"
                      >
                          <XIcon className="w-4 h-4" />
                      </button>
                  </div>
              ) : (
                  <button onClick={() => setIsPostSelectorOpen(true)} className="w-full flex items-center justify-center space-x-2 p-3 bg-light-bg border-2 border-dashed border-light-border rounded-lg hover:border-brand-pink transition-colors text-light-text-secondary">
                      <PaperclipIcon className="w-5 h-5" />
                      <span>Attach Music Post</span>
                  </button>
              )}
            </div>

          </div>

          <div className="p-4 border-t border-light-border flex justify-end items-center space-x-3">
            <button onClick={handleClose} className="px-6 py-2 rounded-lg bg-light-bg hover:bg-light-border border border-light-border">
              Cancel
            </button>
            <button onClick={handleSubmit} className="bg-brand-pink text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-pink-accent">
              Post Thread
            </button>
          </div>
        </div>
      </div>
      <PostSelectorModal 
          isOpen={isPostSelectorOpen}
          onClose={() => setIsPostSelectorOpen(false)}
          onSelectPost={handleSelectPost}
      />
    </>
  );
};

export default ThreadComposerModal;