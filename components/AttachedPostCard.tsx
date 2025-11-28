import React from 'react';
import { Post } from '../types';
import LazyImage from './LazyImage';
import { PlayIcon, HeartIcon } from './icons';

interface AttachedPostCardProps {
  post: Post;
}

const AttachedPostCard: React.FC<AttachedPostCardProps> = ({ post }) => {
  const { author, media, description, likes } = post;
  
  return (
    <div className="border border-light-border rounded-lg overflow-hidden my-4 bg-light-bg/50 hover:bg-light-surface/50 transition-colors">
      <div className="flex items-center space-x-4 p-3">
        <div className="relative flex-shrink-0 group">
          <LazyImage src={media.albumArtUrl} alt={media.title} className="w-20 h-20 rounded-md" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-md">
            <PlayIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-light-text-primary truncate">{media.title}</p>
          <p className="text-sm text-light-text-secondary truncate">by {author.name}</p>
          <p className="text-sm text-light-text-secondary mt-1 line-clamp-2">{description}</p>
          <div className="flex items-center space-x-1 text-xs text-light-text-secondary mt-2">
            <HeartIcon className="w-4 h-4" />
            <span>{likes.toLocaleString()} likes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachedPostCard;
