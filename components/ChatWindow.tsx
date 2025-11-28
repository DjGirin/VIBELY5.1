import React, { useState, useEffect, useRef } from 'react';
import { Conversation, User, Media, Message } from '../types';
import LazyImage from './LazyImage';
import { ArrowLeftIcon, MoreHorizontalIcon } from './icons';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (conversationId: string, messageContent: string) => void;
  onBack: () => void; // For mobile view
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);

  const getDisplayName = () => {
    if (otherParticipants.length === 0) return "Me";
    if (otherParticipants.length === 1) return otherParticipants[0].name;
    return otherParticipants.map(p => p.name).slice(0, 3).join(', ');
  };

  const getAvatar = () => {
    if (otherParticipants.length === 0) return currentUser.avatarUrl;
    if (otherParticipants.length === 1) return otherParticipants[0].avatarUrl;
    // For group chats, maybe show a collage or a generic icon, for now just first participant
    return otherParticipants[0].avatarUrl;
  };
  
  const isOnline = otherParticipants.length === 1 && otherParticipants[0].isOnline;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);
  
  const handleLocalSendMessage = (content: string) => {
    onSendMessage(conversation.id, content);

    // Simulate other user typing and replying for demo purposes
    if(otherParticipants.length > 0) {
        setTimeout(() => {
            setTypingUsers([otherParticipants[0]]);
        }, 500);
        setTimeout(() => {
            setTypingUsers([]);
        }, 1500);
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages(prevMessages => 
        prevMessages.map(msg => {
            if (msg.id === messageId) {
                const newReactions = { ...(msg.reactions || {}) };
                if (newReactions[emoji]?.includes(currentUser.id)) {
                    newReactions[emoji] = newReactions[emoji].filter(id => id !== currentUser.id);
                    if (newReactions[emoji].length === 0) {
                        delete newReactions[emoji];
                    }
                } else {
                    newReactions[emoji] = [...(newReactions[emoji] || []), currentUser.id];
                }
                return { ...msg, reactions: newReactions };
            }
            return msg;
        })
    );
  };

  return (
    <div className="flex flex-col h-full bg-light-bg">
      {/* Header */}
      <header className="flex items-center p-3 border-b border-light-border bg-light-surface flex-shrink-0">
        <button onClick={onBack} className="md:hidden p-2 mr-2 -ml-1 text-light-text-primary">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="relative">
            <LazyImage src={getAvatar()} alt={getDisplayName()} className="w-11 h-11 rounded-full" />
            {isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-light-surface"></span>}
        </div>
        <div className="ml-3">
          <p className="font-bold text-light-text-primary">{getDisplayName()}</p>
          {isOnline && <p className="text-sm text-green-500">Online</p>}
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <button className="p-2 text-light-text-secondary hover:text-brand-pink"><MoreHorizontalIcon className="w-6 h-6"/></button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
            const prevMessage = messages[index-1];
            const nextMessage = messages[index+1];
            const isFirst = !prevMessage || prevMessage.senderId !== message.senderId;
            const isLast = !nextMessage || nextMessage.senderId !== message.senderId;

            return (
                <MessageBubble 
                    key={message.id} 
                    message={message} 
                    isOwnMessage={message.senderId === currentUser.id}
                    isFirstInGroup={isFirst}
                    isLastInGroup={isLast}
                    participants={conversation.participants}
                    onToggleReaction={handleToggleReaction}
                    currentUser={currentUser}
                />
            );
        })}
        {typingUsers.map(user => (
            <div key={user.id} className="flex items-end space-x-2">
                 <LazyImage src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full" />
                <div className="bg-light-border px-4 py-2 rounded-2xl">
                    <div className="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSendMessage={handleLocalSendMessage} />
    </div>
  );
};

export default ChatWindow;