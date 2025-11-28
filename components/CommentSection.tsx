import React, { useState, useMemo } from 'react';
import { Post, Comment as CommentType, User } from '../types';
import LazyImage from './LazyImage';
import { HeartIcon } from './icons';

interface CommentSectionProps {
  post: Post;
  currentUser: User;
  currentTime: number;
  onAddComment: (comment: Omit<CommentType, 'id' | 'author' | 'createdAt' | 'likes'>) => void;
  onSeek: (time: number) => void;
}

const formatTime = (timeInSeconds: number) => {
  if (!isFinite(timeInSeconds)) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Comment: React.FC<{ comment: CommentType; onSeek: (time: number) => void; isAudioPost: boolean; }> = ({ comment, onSeek, isAudioPost }) => {
    const [isLiked, setIsLiked] = useState(false);
    
    return (
        <div className="flex items-start space-x-3 p-3 rounded-lg bg-light-bg/50">
            <LazyImage src={comment.author.avatarUrl} alt={comment.author.name} className="w-9 h-9 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-sm">{comment.author.name}</span>
                    {isAudioPost && (
                      <button 
                          onClick={() => onSeek(comment.timestamp)}
                          className="text-brand-pink font-mono text-sm hover:underline"
                      >
                          {formatTime(comment.timestamp)}
                      </button>
                    )}
                    <span className="text-xs text-light-text-secondary">{comment.createdAt}</span>
                </div>
                <p className="text-sm text-light-text-primary">{comment.content}</p>
                <div className="flex items-center space-x-4 mt-2">
                    <button onClick={() => setIsLiked(l => !l)} className={`flex items-center space-x-1 text-xs text-light-text-secondary hover:text-brand-pink ${isLiked ? 'text-brand-pink': ''}`}>
                        <HeartIcon className="w-4 h-4" />
                        <span>{comment.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button className="text-xs text-light-text-secondary hover:text-light-text-primary font-semibold">Reply</button>
                </div>
            </div>
        </div>
    );
};


const CommentSection: React.FC<CommentSectionProps> = ({ post, currentUser, currentTime, onAddComment, onSeek }) => {
  const [newComment, setNewComment] = useState('');
  const isAudioPost = post.media.mediaType === 'audio';

  const sortedComments = useMemo(() => {
      if (isAudioPost) {
        return [...post.comments].sort((a, b) => a.timestamp - b.timestamp);
      }
      return [...post.comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [post.comments, isAudioPost]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    const commentData = {
      content: newComment,
      timestamp: isAudioPost ? Math.floor(currentTime) : 0,
    };
    onAddComment(commentData);
    setNewComment('');
  };

  return (
    <div className="space-y-4 pt-4 border-t border-light-border">
      {/* Comment Input */}
      <div className="bg-light-bg rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <LazyImage src={currentUser.avatarUrl} alt={currentUser.name} className="w-9 h-9 rounded-full" />
          <input
            type="text"
            placeholder={isAudioPost ? `${formatTime(currentTime)}에 댓글 추가...` : 'Add a comment...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            className="flex-1 bg-light-surface border border-light-border rounded-full h-10 px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>
      </div>

      {/* Comment List */}
      {post.comments.length > 0 && (
        <div>
            <h4 className="font-bold px-2 pb-2">Comments ({sortedComments.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {sortedComments.map(comment => (
                    <Comment key={comment.id} comment={comment} onSeek={onSeek} isAudioPost={isAudioPost} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;