import React from 'react';
import { Message, User, Post } from '../types';
import LazyImage from './LazyImage';
import { PlayIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  participants: User[];
  onToggleReaction: (messageId: string, emoji: string) => void;
  currentUser: User;
}

const ReactionPill: React.FC<{ emoji: string; count: number; reacted: boolean; onClick: () => void }> = ({ emoji, count, reacted, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-2 py-0.5 rounded-full text-xs flex items-center space-x-1 transition-colors ${reacted ? 'bg-brand-pink/20 border-brand-pink text-brand-pink' : 'bg-light-border/80 border-transparent text-light-text-secondary'} border`}
    >
        <span>{emoji}</span>
        <span>{count}</span>
    </button>
);


const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, isFirstInGroup, isLastInGroup, participants, onToggleReaction, currentUser }) => {
  const sender = participants.find(p => p.id === message.senderId);

  const bubbleStyles = isOwnMessage
    ? 'bg-brand-pink text-white'
    : 'bg-light-surface text-light-text-primary';

  const roundingStyles = isOwnMessage
    ? `rounded-3xl ${isLastInGroup ? 'rounded-br-lg' : ''}`
    : `rounded-3xl ${isLastInGroup ? 'rounded-bl-lg' : ''}`;

  const renderContent = () => {
    switch (message.type) {
      case 'post_share':
        const post = message.content as Post;
        return (
          <div className={`rounded-lg overflow-hidden w-64 ${isOwnMessage ? 'bg-white/10' : 'bg-light-surface border border-light-border'}`}>
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <LazyImage src={post.author.avatarUrl} alt={post.author.name} className="w-6 h-6 rounded-full" />
                <span className={`text-sm font-semibold ${isOwnMessage ? 'text-white' : 'text-light-text-primary'}`}>{post.author.name}</span>
              </div>
              <p className={`text-xs italic mb-3 line-clamp-2 ${isOwnMessage ? 'text-white/80' : 'text-light-text-secondary'}`}>"{post.description}"</p>
            </div>
            <div className={`flex items-center p-2 space-x-3 ${isOwnMessage ? 'bg-black/20' : 'bg-light-bg'}`}>
              <LazyImage src={post.media.albumArtUrl} alt={post.media.title} className="w-12 h-12 rounded-md flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className={`font-bold truncate text-sm ${isOwnMessage ? 'text-white' : 'text-light-text-primary'}`}>{post.media.title}</p>
                <p className={`text-xs truncate ${isOwnMessage ? 'text-white/80' : 'text-light-text-secondary'}`}>{post.media.artist}</p>
              </div>
              {post.media.mediaType === 'audio' && (
                <button className={`p-2 rounded-full ${isOwnMessage ? 'bg-white/20 hover:bg-white/30' : 'bg-light-surface hover:bg-light-border'}`}>
                    <PlayIcon className={`w-5 h-5 ${isOwnMessage ? 'text-white' : 'text-light-text-primary'}`} />
                </button>
              )}
            </div>
          </div>
        );
       case 'prompt_share':
        const { promptText } = message.content as { promptText: string };
        return (
            <div className={`p-3 rounded-lg w-64 ${isOwnMessage ? 'bg-white/10' : 'bg-light-bg'}`}>
                <p className="text-xs font-semibold text-brand-pink-accent mb-1">PROMPT</p>
                <p className="text-sm italic">"{promptText}"</p>
            </div>
        );
      case 'text':
      default:
        return <p>{message.content as string}</p>;
    }
  };

  const handleDoubleClick = () => {
    onToggleReaction(message.id, '❤️');
  };

  return (
    <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2' : 'mt-0.5'}`}>
      {!isOwnMessage && isLastInGroup && sender && (
        <LazyImage src={sender.avatarUrl} alt={sender.name} className="w-7 h-7 rounded-full flex-shrink-0" />
      )}
      {!isOwnMessage && !isLastInGroup && <div className="w-7 flex-shrink-0" />}

      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div
          onDoubleClick={handleDoubleClick}
          className={`px-4 py-2 max-w-sm md:max-w-md relative group ${bubbleStyles} ${roundingStyles}`}
        >
          {renderContent()}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
             <div className="absolute -bottom-3 right-2 flex space-x-1">
                {Object.entries(message.reactions).map(([emoji, userIds]) => (
                    // FIX: Explicitly cast `userIds` to `string[]` to resolve TypeScript inference error.
                    <ReactionPill 
                        key={emoji} 
                        emoji={emoji} 
                        count={(userIds as string[]).length}
                        reacted={(userIds as string[]).includes(currentUser.id)}
                        onClick={() => onToggleReaction(message.id, emoji)}
                    />
                ))}
             </div>
          )}
        </div>
        {isLastInGroup && (
             <p className="text-xs text-light-text-muted mt-1 px-2">{message.timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;