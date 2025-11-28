import React, { useState, useMemo, useCallback } from 'react';
import { Conversation, User, Media, Message } from '../types';
import { conversations as initialConversations } from '../data';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import EmptyState from './EmptyState';
import NewMessageModal from './NewMessageModal';

interface MessagesPageProps {
  currentUser: User;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ currentUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isNewMessageModalOpen, setNewMessageModalOpen] = useState(false);

  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId);
  }, [conversations, activeConversationId]);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    // Mark messages as read
    setConversations(prev => prev.map(c => c.id === id ? {...c, unreadCount: 0} : c));
  }, []);

  const handleSendMessage = useCallback((conversationId: string, content: string) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      conversationId: conversationId,
      senderId: currentUser.id,
      content: content,
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setConversations(prev => {
      const updatedConversations = prev.map(convo => {
        if (convo.id === conversationId) {
          return { ...convo, messages: [...convo.messages, newMessage] };
        }
        return convo;
      });
      // Move updated conversation to the top
      const currentConvo = updatedConversations.find(c => c.id === conversationId);
      const otherConvos = updatedConversations.filter(c => c.id !== conversationId);
      return currentConvo ? [currentConvo, ...otherConvos] : updatedConversations;
    });
  }, [currentUser.id]);

  const handleStartConversation = (participants: User[], message: string) => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
        id: newConversationId,
        participants: [currentUser, ...participants],
        messages: [{
            id: `m-${Date.now()}`,
            conversationId: newConversationId,
            senderId: currentUser.id,
            content: message,
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
        }],
        unreadCount: 0,
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setNewMessageModalOpen(false);
  };

  return (
    <main className="flex h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)] border-t border-light-border">
      <div className={`w-full md:w-96 flex-shrink-0 border-r border-light-border ${activeConversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
        <ConversationList
          conversations={conversations}
          currentUser={currentUser}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewMessage={() => setNewMessageModalOpen(true)}
        />
      </div>
      <div className={`flex-1 ${activeConversationId ? 'block' : 'hidden md:block'}`}>
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveConversationId(null)}
          />
        ) : (
          <EmptyState 
            title="대화를 선택하세요"
            message="새로운 채팅을 시작하거나 대화 목록에서 선택하세요."
          />
        )}
      </div>
      <NewMessageModal 
        isOpen={isNewMessageModalOpen}
        onClose={() => setNewMessageModalOpen(false)}
        currentUser={currentUser}
        onStartConversation={handleStartConversation}
      />
    </main>
  );
};

export default MessagesPage;