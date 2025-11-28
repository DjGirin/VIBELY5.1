import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Comment } from '../types';
import LazyImage from './LazyImage';

interface RealtimeCommentOverlayProps {
  comments: Comment[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

interface DisplayComment extends Comment {
  // Unique key for re-triggering animation
  displayId: string;
  top: number;
  animationDuration: number;
}

const RealtimeCommentOverlay: React.FC<RealtimeCommentOverlayProps> = ({ comments, currentTime, isPlaying }) => {
  const [visibleComments, setVisibleComments] = useState<DisplayComment[]>([]);
  const shownCommentIds = useRef(new Set<string>());
  
  const sortedComments = useMemo(() => [...comments].sort((a, b) => a.timestamp - b.timestamp), [comments]);

  useEffect(() => {
    if (!isPlaying) {
      // If paused, don't do anything but don't clear comments immediately
      return;
    }
    if (currentTime < 1) {
      // If playback resets, clear shown comments
      shownCommentIds.current.clear();
      setVisibleComments([]);
    }

    const newComments = sortedComments.filter(c => 
      c.timestamp >= currentTime - 1 &&
      c.timestamp <= currentTime + 1 &&
      !shownCommentIds.current.has(c.id)
    );

    if (newComments.length > 0) {
      const displayComments: DisplayComment[] = newComments.map(c => {
        shownCommentIds.current.add(c.id);
        return {
          ...c,
          displayId: `${c.id}-${Date.now()}`,
          top: Math.random() * 80 + 5, // Random vertical position from 5% to 85%
          animationDuration: Math.random() * 3 + 5, // 5-8 seconds duration
        }
      });
      setVisibleComments(prev => [...prev, ...displayComments]);
    }
  }, [currentTime, isPlaying, sortedComments]);

  const handleAnimationEnd = (displayId: string) => {
    setVisibleComments(prev => prev.filter(c => c.displayId !== displayId));
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {visibleComments.map(comment => (
        <div
          key={comment.displayId}
          onAnimationEnd={() => handleAnimationEnd(comment.displayId)}
          className="absolute right-0 flex items-center space-x-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full pr-4 animate-slide-in-left"
          style={{
            top: `${comment.top}%`,
            transform: 'translateX(100%)',
            animationDuration: `${comment.animationDuration}s`,
          }}
        >
          <LazyImage src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full" />
          <div className="text-white">
            <p className="text-sm font-bold leading-tight">{comment.author.name}</p>
            <p className="text-xs leading-tight truncate max-w-[200px]">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(RealtimeCommentOverlay);