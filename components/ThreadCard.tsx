import React, { useState } from 'react';
import { Thread } from '../types';
import LazyImage from './LazyImage';
import { ArrowUpIcon, ArrowDownIcon, MessageCircleIcon } from './icons';

interface ThreadCardProps {
    thread: Thread;
    onNavigateToThread: (threadId: string) => void;
}

const categoryStyles = {
    collaboration: 'border-brand-pink',
    challenge: 'border-brand-pink-accent',
    feedback: 'border-blue-500',
    showcase: 'border-green-500',
    general: 'border-gray-500',
};

const categoryLabels = {
    collaboration: '협업구함',
    challenge: '챌린지',
    feedback: '피드백',
    showcase: '작품 공유',
    general: '자유 토론',
};


const VoteButtons: React.FC<{ thread: Thread }> = ({ thread }) => {
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
    const [score, setScore] = useState(thread.votes.up - thread.votes.down);

    const handleVote = (type: 'up' | 'down') => {
        if (type === voteStatus) { // Unvote
            setVoteStatus(null);
            setScore(score + (type === 'up' ? -1 : 1));
        } else { // New vote or change vote
            let scoreChange = 0;
            if (voteStatus === 'up') scoreChange = -1;
            if (voteStatus === 'down') scoreChange = 1;

            if (type === 'up') scoreChange += 1;
            if (type === 'down') scoreChange -= 1;
            
            setScore(score + scoreChange);
            setVoteStatus(type);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start p-2 bg-light-bg/50 rounded-l-lg">
            <button onClick={() => handleVote('up')} className={`p-1 rounded-full ${voteStatus === 'up' ? 'text-brand-pink' : 'text-light-text-secondary hover:text-brand-pink'}`}>
                <ArrowUpIcon className="w-5 h-5"/>
            </button>
            <span className="font-bold text-sm my-1 text-light-text-primary">{score}</span>
            <button onClick={() => handleVote('down')} className={`p-1 rounded-full ${voteStatus === 'down' ? 'text-blue-500' : 'text-light-text-secondary hover:text-blue-500'}`}>
                 <ArrowDownIcon className="w-5 h-5"/>
            </button>
        </div>
    );
};


const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onNavigateToThread }) => {
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <article className={`bg-light-surface rounded-lg flex hover:shadow-md transition-shadow border ${categoryStyles[thread.category] || 'border-light-border'} border-l-4`}>
            <VoteButtons thread={thread} />
            <div className="p-4 flex-1 cursor-pointer min-w-0" onClick={() => onNavigateToThread(thread.id)}>
                <div className="flex items-center text-xs text-light-text-secondary mb-2">
                    <span className={`font-bold text-xs px-2 py-0.5 rounded-full bg-light-bg mr-2`}>{categoryLabels[thread.category]}</span>
                    <span>Posted by</span>
                    <LazyImage src={thread.author.avatarUrl} alt={thread.author.name} className="w-5 h-5 rounded-full mx-1.5" />
                    <span className="font-semibold text-light-text-primary">{thread.author.name}</span>
                    <span className="mx-1.5">•</span>
                    <span>{timeAgo(thread.createdAt)}</span>
                </div>
                
                <h3 className="text-lg font-bold text-light-text-primary mb-2 truncate">{thread.title}</h3>

                {thread.category === 'collaboration' && thread.collaborationDetails && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {thread.collaborationDetails.roles.map(role => (
                            <span key={role} className="px-2 py-1 bg-brand-pink/10 text-brand-pink rounded text-xs font-semibold">
                                🎵 {role} 구함
                            </span>
                        ))}
                         <span className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded text-xs font-semibold">
                            💸 {thread.collaborationDetails.compensation}
                        </span>
                    </div>
                )}
                
                <p className="text-sm text-light-text-secondary line-clamp-2">
                    {thread.content}
                </p>

                {thread.attachment && (
                    <div className="mt-3 border border-light-border rounded-md p-2 flex items-center space-x-3 hover:bg-light-bg transition-colors">
                        <LazyImage src={thread.attachment.media.albumArtUrl} alt={thread.attachment.media.title} className="w-10 h-10 rounded flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="font-semibold text-sm truncate text-light-text-primary">{thread.attachment.media.title}</p>
                            <p className="text-xs text-light-text-secondary truncate">by {thread.attachment.author.name}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-light-text-secondary mt-3">
                    <div className="flex items-center space-x-1">
                        <MessageCircleIcon className="w-4 h-4" />
                        <span>{thread.replies.length} Comments</span>
                    </div>
                    <span>{thread.viewCount} Views</span>
                </div>
            </div>
        </article>
    );
};

export default ThreadCard;