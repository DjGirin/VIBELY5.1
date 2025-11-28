import React, { useState, useMemo } from 'react';
import { Post } from '../types';
import { posts as allPosts } from '../data';
import LazyImage from './LazyImage';
import { XIcon, SearchIcon, CheckCircleIcon } from './icons';

interface PostSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (post: Post) => void;
}

const PostSelectorModal: React.FC<PostSelectorModalProps> = ({ isOpen, onClose, onSelectPost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const myPosts = useMemo(() => allPosts.filter(p => p.author.id === 'user1'), []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) {
      return myPosts;
    }
    return myPosts.filter(post => 
      post.media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, myPosts]);

  if (!isOpen) return null;

  const handleSelect = (post: Post) => {
    onSelectPost(post);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-xl w-full max-w-lg border border-light-border shadow-xl flex flex-col max-h-[80vh] animate-fade-in-up">
        <div className="p-4 border-b border-light-border flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold">Attach Music Post</h2>
          <button onClick={onClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg"><XIcon className="w-6 h-6"/></button>
        </div>
        
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary" />
            <input
              type="text"
              placeholder="Search your posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-light-bg border border-light-border rounded-full h-10 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto px-4 pb-4 space-y-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div 
                key={post.id} 
                onClick={() => handleSelect(post)} 
                className="border border-light-border rounded-lg p-3 flex items-center space-x-4 cursor-pointer hover:bg-light-bg hover:border-brand-pink/50 transition-colors"
              >
                <LazyImage src={post.media.albumArtUrl} alt={post.media.title} className="w-12 h-12 rounded-md flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-light-text-primary">{post.media.title}</p>
                  <p className="text-sm text-light-text-secondary truncate">{post.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-light-text-secondary">
                <p>No posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostSelectorModal;