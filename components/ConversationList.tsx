import React, { useState, useMemo } from 'react';
import { Conversation, User, Post } from '../types';
import LazyImage from './LazyImage';
import { SearchIcon, PlusIcon } from './icons';

interface ConversationListProps {
  conversations: Conversation[];
  currentUser: User;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewMessage: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentUser,
  activeConversationId,
  onSelectConversation,
  onNewMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getConversationDetails = (convo: Conversation) => {
    const otherParticipants = convo.participants.filter(p => p.id !== currentUser.id);
    const lastMessage = convo.messages[convo.messages.length - 1];
    
    let displayName = "Me";
    if (otherParticipants.length > 0) {
      displayName = otherParticipants.length > 1 
        ? otherParticipants.map(p => p.name).slice(0, 3).join(', ')
        : otherParticipants[0].name;
    }

    let lastMessageText = '';
    if (lastMessage) {
        if (lastMessage.type === 'text') {
            lastMessageText = lastMessage.content as string;
        } else if (lastMessage.type === 'post_share') {
            const post = lastMessage.content as Post;
            lastMessageText = `Shared post: ${post.media.title}`;
        } else if (lastMessage.type === 'prompt_share') {
             lastMessageText = 'Shared a prompt';
        }
    }

    return {
      displayName,
      avatarUrl: otherParticipants.length > 0 ? otherParticipants[0].avatarUrl : currentUser.avatarUrl,
      lastMessageText,
      timestamp: lastMessage?.timestamp || '',
      isGroup: otherParticipants.length > 1,
    };
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(convo =>
      getConversationDetails(convo).displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  // FIX: currentUser.id is not a dependency as it's stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-light-surface">
      <div className="p-4 border-b border-light-border flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Messages</h2>
          <button onClick={onNewMessage} className="p-2 rounded-full hover:bg-light-bg">
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-light-bg border border-light-border rounded-full h-10 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map(convo => {
          const { displayName, avatarUrl, lastMessageText, timestamp } = getConversationDetails(convo);
          const isActive = convo.id === activeConversationId;
          return (
            <button
              key={convo.id}
              onClick={() => onSelectConversation(convo.id)}
              className={`w-full text-left flex items-center p-3 space-x-3 transition-colors ${
                isActive ? 'bg-brand-pink/10' : 'hover:bg-light-bg'
              }`}
            >
              <div className="relative flex-shrink-0">
                <LazyImage src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full" />
                {convo.participants.find(p => p.id !== currentUser.id && p.isOnline) &&
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-light-surface"></span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className={`font-semibold truncate ${isActive ? 'text-light-text-primary' : 'text-light-text-primary'}`}>
                    {displayName}
                  </p>
                  <p className="text-xs text-light-text-secondary flex-shrink-0 ml-2">{timestamp}</p>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-light-text-secondary truncate pr-2">{lastMessageText}</p>
                  {convo.unreadCount > 0 && (
                    <span className="bg-brand-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;