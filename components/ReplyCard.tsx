import React, { useState } from 'react';
import { Reply, User } from '../types';
import LazyImage from './LazyImage';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface ReplyCardProps {
    reply: Reply;
    currentUser: User;
    onAddReply: (content: string, parentReplyId: string) => void;
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

const ReplyVoteButtons: React.FC<{ reply: Reply }> = ({ reply }) => {
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
    const initialScore = reply.votes.up - reply.votes.down;
    const [score, setScore] = useState(initialScore);

    const handleVote = (type: 'up' | 'down') => {
        let scoreChange = 0;
        if (voteStatus === type) { // un-voting
            setVoteStatus(null);
            scoreChange = type === 'up' ? -1 : 1;
        } else { // new vote or changing vote
            scoreChange = type === 'up' ? 1 : -1;
            if (voteStatus) { // if already voted, the change is doubled
                scoreChange *= 2;
            }
            setVoteStatus(type);
        }
        setScore(prev => prev + scoreChange);
    };
    
    // This is just a simulation. In a real app, you'd get the vote count from state/props.
    const upVotes = reply.votes.up + (voteStatus === 'up' ? 1 : 0) - (voteStatus === 'down' && voteStatus !== null ? 1: 0);


    return (
        <div className="flex items-center space-x-2 text-xs text-light-text-secondary">
            <button onClick={() => handleVote('up')} className={`flex items-center space-x-1 ${voteStatus === 'up' ? 'text-brand-pink' : 'hover:text-brand-pink'}`}>
                <ArrowUpIcon className="w-4 h-4"/>
                <span>{upVotes}</span>
            </button>
            <button onClick={() => handleVote('down')} className={`flex items-center space-x-1 ${voteStatus === 'down' ? 'text-blue-500' : 'hover:text-blue-500'}`}>
                <ArrowDownIcon className="w-4 h-4"/>
            </button>
        </div>
    );
};


const ReplyCard: React.FC<ReplyCardProps> = ({ reply, currentUser, onAddReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleSubmitReply = () => {
        if (!replyContent.trim()) return;
        onAddReply(replyContent, reply.id);
        setReplyContent('');
        setShowReplyForm(false);
    };

    return (
        <div className="flex items-start space-x-3 p-3">
            <LazyImage src={reply.author.avatarUrl} alt={reply.author.name} className="w-9 h-9 rounded-full mt-1 flex-shrink-0" />
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-sm">{reply.author.name}</span>
                    <span className="text-xs text-light-text-secondary">• {timeAgo(reply.createdAt)}</span>
                </div>
                <p className="text-sm text-light-text-primary whitespace-pre-wrap">{reply.content}</p>
                <div className="flex items-center space-x-4 mt-2">
                    <ReplyVoteButtons reply={reply} />
                    <button onClick={() => setShowReplyForm(prev => !prev)} className="text-xs text-light-text-secondary hover:text-light-text-primary font-semibold">Reply</button>
                </div>

                {showReplyForm && (
                    <div className="mt-3 flex items-start space-x-3">
                        <LazyImage src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full mt-1" />
                        <div className="flex-1">
                             <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="w-full bg-light-bg border border-light-border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
                                placeholder={`Replying to ${reply.author.name}...`}
                                rows={2}
                            />
                            <div className="flex justify-end mt-2 space-x-2">
                                <button onClick={() => setShowReplyForm(false)} className="px-3 py-1 text-xs rounded-lg hover:bg-light-bg">Cancel</button>
                                <button onClick={handleSubmitReply} disabled={!replyContent.trim()} className="bg-brand-pink text-white px-3 py-1 text-xs rounded-lg font-semibold hover:bg-brand-pink-accent disabled:opacity-50">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {reply.replies && reply.replies.length > 0 && (
                    <div className="mt-3 pt-2 border-l-2 border-light-border/50">
                        {reply.replies
                            .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                            .map(nestedReply => (
                            <ReplyCard key={nestedReply.id} reply={nestedReply} currentUser={currentUser} onAddReply={onAddReply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReplyCard;