import React, { useState, useEffect, useMemo } from 'react';
import { sampleThreads } from '../data';
import { Thread, Reply, User } from '../types';
import LazyImage from './LazyImage';
import ReplyCard from './ReplyCard';
import AttachedPostCard from './AttachedPostCard';
import { ArrowUpIcon, ArrowDownIcon, MessageCircleIcon, ArrowLeftIcon } from './icons';

interface ThreadDetailPageProps {
    threadId: string;
    currentUser: User;
    onBack: () => void;
}

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

const VoteButtons: React.FC<{ initialScore: number; onVote: (type: 'up' | 'down') => void }> = ({ initialScore, onVote }) => {
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
    const [score, setScore] = useState(initialScore);

    const handleVote = (type: 'up' | 'down') => {
        let newVoteStatus = voteStatus;
        let scoreChange = 0;
        if(voteStatus === type){
            newVoteStatus = null;
            scoreChange = type === 'up' ? -1 : 1;
        } else {
            if(voteStatus === 'up') scoreChange = -1;
            if(voteStatus === 'down') scoreChange = 1;
            newVoteStatus = type;
            scoreChange += type === 'up' ? 1 : -1;
        }
        setVoteStatus(newVoteStatus);
        setScore(prev => prev + scoreChange);
    };

    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => handleVote('up')} className={`p-1 rounded-full ${voteStatus === 'up' ? 'bg-brand-pink/20 text-brand-pink' : 'text-light-text-secondary hover:bg-light-bg'}`}>
                <ArrowUpIcon className="w-5 h-5"/>
            </button>
            <span className="font-bold text-sm text-light-text-primary">{score}</span>
            <button onClick={() => handleVote('down')} className={`p-1 rounded-full ${voteStatus === 'down' ? 'bg-blue-500/20 text-blue-500' : 'text-light-text-secondary hover:bg-light-bg'}`}>
                <ArrowDownIcon className="w-5 h-5"/>
            </button>
        </div>
    );
};


const ThreadDetailPage: React.FC<ThreadDetailPageProps> = ({ threadId, currentUser, onBack }) => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [newReply, setNewReply] = useState('');

    useEffect(() => {
        const foundThread = sampleThreads.find(t => t.id === threadId);
        setThread(foundThread || null);
    }, [threadId]);

    const handleAddReply = (content: string, parentReplyId?: string) => {
        if (!content.trim() || !thread) return;

        const newReply: Reply = {
            id: `reply-${Date.now()}`,
            author: currentUser,
            content: content,
            createdAt: new Date().toISOString(),
            votes: { up: 0, down: 0 },
            parentReplyId: parentReplyId,
            replies: [],
        };

        if (parentReplyId) {
            // This is a nested reply
            const addNestedReply = (replies: Reply[]): Reply[] => {
                return replies.map(r => {
                    if (r.id === parentReplyId) {
                        return { ...r, replies: [...(r.replies || []), newReply] };
                    }
                    if (r.replies) {
                        return { ...r, replies: addNestedReply(r.replies) };
                    }
                    return r;
                });
            };
            setThread(prev => prev ? { ...prev, replies: addNestedReply(prev.replies) } : null);
        } else {
            // This is a top-level reply
            setThread(prev => prev ? { ...prev, replies: [newReply, ...prev.replies] } : null);
        }
    };

    const handleMainReplySubmit = () => {
        handleAddReply(newReply);
        setNewReply('');
    };

    if (!thread) {
        return <div className="p-8 text-center">Thread not found or loading...</div>;
    }

    return (
        <main className="flex-1 max-w-4xl mx-auto p-4 md:p-6">
            <button onClick={onBack} className="flex items-center space-x-2 text-sm text-light-text-secondary hover:text-light-text-primary mb-4">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Community</span>
            </button>
            
            <div className="bg-light-surface rounded-xl border border-light-border">
                <div className="p-5">
                    <div className="flex items-center text-sm text-light-text-secondary mb-3">
                        <LazyImage src={thread.author.avatarUrl} alt={thread.author.name} className="w-6 h-6 rounded-full mr-2" />
                        <span className="font-semibold text-light-text-primary">{thread.author.name}</span>
                        <span className="mx-1.5">•</span>
                        <span>{timeAgo(thread.createdAt)}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-light-text-primary mb-4">{thread.title}</h1>
                    
                    {thread.category === 'collaboration' && thread.collaborationDetails && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {thread.collaborationDetails.roles.map(role => (
                                <span key={role} className="px-2 py-1 bg-brand-pink/10 text-brand-pink rounded text-sm font-semibold">
                                    🎵 {role} 구함
                                </span>
                            ))}
                             <span className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded text-sm font-semibold">
                                💸 {thread.collaborationDetails.compensation}
                            </span>
                        </div>
                    )}

                    <p className="text-light-text-primary leading-relaxed whitespace-pre-wrap">{thread.content}</p>
                    
                    {thread.attachment && <AttachedPostCard post={thread.attachment} />}
                
                    <div className="flex flex-wrap gap-2 my-4">
                        {thread.tags.map(tag => (
                            <span key={tag} className="bg-light-bg px-3 py-1 text-xs rounded-full text-light-text-secondary">#{tag}</span>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <VoteButtons initialScore={thread.votes.up - thread.votes.down} onVote={() => {}} />
                        <div className="flex items-center space-x-1 text-light-text-secondary">
                            <MessageCircleIcon className="w-5 h-5" />
                            <span>{thread.replies.length} Comments</span>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-light-border">
                     <div className="flex items-start space-x-3">
                        <LazyImage src={currentUser.avatarUrl} alt={currentUser.name} className="w-9 h-9 rounded-full mt-1" />
                        <div className="flex-1">
                             <textarea
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                className="w-full bg-light-bg border border-light-border rounded-lg p-3 h-24 resize-y focus:outline-none focus:ring-2 focus:ring-brand-pink"
                                placeholder={`Replying as ${currentUser.name}...`}
                            />
                            <div className="flex justify-end mt-2">
                                <button onClick={handleMainReplySubmit} disabled={!newReply.trim()} className="bg-brand-pink text-white px-5 py-2 rounded-lg font-semibold hover:bg-brand-pink-accent disabled:opacity-50">
                                    Reply
                                </button>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="border-t border-light-border">
                    {thread.replies.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(reply => (
                        <div key={reply.id} className="border-b border-light-border last:border-b-0">
                            <ReplyCard reply={reply} currentUser={currentUser} onAddReply={handleAddReply} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ThreadDetailPage;