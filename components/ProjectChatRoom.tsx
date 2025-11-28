import React, { useState, useRef, useEffect } from 'react';
import { User, StudioProjectMessage } from '../types';
import {
  SendIcon,
  ImageIcon,
  FileAudioIcon,
  SmileIcon,
  PaperclipIcon,
  AtSignIcon,
  HashIcon,
  MoreHorizontalIcon
} from './icons';
import LazyImage from './LazyImage';

interface ProjectChatRoomProps {
  messages: StudioProjectMessage[];
  currentUser: User;
  contributors: { user: User; role: string }[];
  onSendMessage: (text: string) => void;
  projectTitle: string;
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

const formatFullTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

// 빠른 리액션 이모지
const quickReactions = ['👍', '❤️', '🔥', '🎵', '✅', '👀'];

// 메시지 그룹화 헬퍼
const shouldGroupWithPrevious = (
  current: StudioProjectMessage,
  previous: StudioProjectMessage | null
): boolean => {
  if (!previous) return false;
  if (current.user.id !== previous.user.id) return false;
  const timeDiff = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime();
  return timeDiff < 5 * 60 * 1000; // 5분 이내면 그룹화
};

const ProjectChatRoom: React.FC<ProjectChatRoomProps> = ({
  messages,
  currentUser,
  contributors,
  onSendMessage,
  projectTitle
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
    setShowMentionPopup(false);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === '@') {
      setShowMentionPopup(true);
    }
  };

  const insertMention = (user: User) => {
    setNewMessage(prev => prev + `@${user.name} `);
    setShowMentionPopup(false);
    inputRef.current?.focus();
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // 날짜 구분선 확인
  const shouldShowDateDivider = (
    current: StudioProjectMessage,
    previous: StudioProjectMessage | null
  ): boolean => {
    if (!previous) return true;
    const currentDate = new Date(current.createdAt).toDateString();
    const previousDate = new Date(previous.createdAt).toDateString();
    return currentDate !== previousDate;
  };

  const formatDateDivider = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return '오늘';
    if (date.toDateString() === yesterday.toDateString()) return '어제';
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-light-surface rounded-2xl border border-light-border overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-light-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 rounded-xl flex items-center justify-center">
            <HashIcon className="w-5 h-5 text-brand-pink" />
          </div>
          <div>
            <h3 className="font-semibold text-light-text-primary">{projectTitle}</h3>
            <p className="text-xs text-light-text-secondary">
              {contributors.length}명의 팀원 · {messages.length}개의 메시지
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* 온라인 멤버 아바타 */}
          <div className="flex -space-x-2">
            {contributors.slice(0, 3).map((c) => (
              <LazyImage
                key={c.user.id}
                src={c.user.avatarUrl}
                alt={c.user.name}
                className="w-7 h-7 rounded-full border-2 border-white"
              />
            ))}
            {contributors.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-light-bg border-2 border-white flex items-center justify-center text-xs font-medium text-light-text-secondary">
                +{contributors.length - 3}
              </div>
            )}
          </div>
          <button className="p-2 hover:bg-light-bg rounded-lg">
            <MoreHorizontalIcon className="w-5 h-5 text-light-text-secondary" />
          </button>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-light-bg rounded-full flex items-center justify-center mb-4">
              <SendIcon className="w-8 h-8 text-light-text-muted" />
            </div>
            <h4 className="font-semibold text-light-text-primary mb-2">대화를 시작하세요!</h4>
            <p className="text-sm text-light-text-secondary max-w-xs">
              팀원들과 아이디어를 공유하고 프로젝트에 대해 논의해보세요.
            </p>
          </div>
        ) : (
          messages.map((message, idx) => {
            const prevMessage = idx > 0 ? messages[idx - 1] : null;
            const isGrouped = shouldGroupWithPrevious(message, prevMessage);
            const showDateDivider = shouldShowDateDivider(message, prevMessage);
            const isOwnMessage = message.user.id === currentUser.id;

            return (
              <React.Fragment key={message.id}>
                {/* 날짜 구분선 */}
                {showDateDivider && (
                  <div className="flex items-center justify-center my-4">
                    <div className="flex-1 h-px bg-light-border" />
                    <span className="px-3 text-xs text-light-text-muted">
                      {formatDateDivider(message.createdAt)}
                    </span>
                    <div className="flex-1 h-px bg-light-border" />
                  </div>
                )}

                {/* 메시지 */}
                <div
                  className={`flex items-start space-x-3 group ${
                    isGrouped ? 'mt-1' : 'mt-4'
                  } ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* 아바타 */}
                  {!isGrouped ? (
                    <LazyImage
                      src={message.user.avatarUrl}
                      alt={message.user.name}
                      className="w-9 h-9 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 flex-shrink-0" />
                  )}

                  {/* 메시지 내용 */}
                  <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
                    {/* 이름과 시간 */}
                    {!isGrouped && (
                      <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <span className="font-medium text-sm text-light-text-primary">
                          {message.user.name}
                        </span>
                        <span className="text-xs text-light-text-muted">
                          {formatFullTime(message.createdAt)}
                        </span>
                      </div>
                    )}

                    {/* 메시지 버블 */}
                    <div className={`inline-block max-w-[80%] ${isOwnMessage ? 'text-left' : ''}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-brand-pink to-brand-purple text-white'
                            : 'bg-light-bg text-light-text-primary'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                      </div>

                      {/* 빠른 리액션 (호버시 표시) */}
                      <div className={`opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center space-x-1 ${
                        isOwnMessage ? 'justify-end' : ''
                      }`}>
                        {quickReactions.slice(0, 4).map((emoji) => (
                          <button
                            key={emoji}
                            className="p-1 hover:bg-light-bg rounded text-sm"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-light-border">
        {/* 멘션 팝업 */}
        {showMentionPopup && (
          <div className="mb-2 bg-white border border-light-border rounded-xl shadow-lg p-2 max-h-48 overflow-y-auto">
            <p className="text-xs text-light-text-muted px-2 py-1">팀원 멘션</p>
            {contributors.map((c) => (
              <button
                key={c.user.id}
                onClick={() => insertMention(c.user)}
                className="flex items-center space-x-2 w-full p-2 hover:bg-light-bg rounded-lg transition-colors"
              >
                <LazyImage
                  src={c.user.avatarUrl}
                  alt={c.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-light-text-primary">{c.user.name}</p>
                  <p className="text-xs text-light-text-secondary">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 이모지 피커 */}
        {showEmojiPicker && (
          <div className="mb-2 bg-white border border-light-border rounded-xl shadow-lg p-3">
            <div className="grid grid-cols-8 gap-2">
              {['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👏', '🔥', '❤️', '💜', '🎵', '🎤', '🎧', '🎹', '🎸'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="text-2xl hover:bg-light-bg rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          {/* 첨부 버튼들 */}
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-light-bg rounded-lg text-light-text-secondary transition-colors">
              <PaperclipIcon className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-light-bg rounded-lg text-light-text-secondary transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-light-bg rounded-lg text-light-text-secondary transition-colors">
              <FileAudioIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 입력 필드 */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요... (@로 멘션)"
              className="w-full bg-light-bg border border-light-border rounded-xl px-4 py-2.5 pr-20 focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <button
                onClick={() => {
                  setShowMentionPopup(!showMentionPopup);
                  setShowEmojiPicker(false);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  showMentionPopup ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-light-border text-light-text-secondary'
                }`}
              >
                <AtSignIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowMentionPopup(false);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  showEmojiPicker ? 'bg-brand-pink/10 text-brand-pink' : 'hover:bg-light-border text-light-text-secondary'
                }`}
              >
                <SmileIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 전송 버튼 */}
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 bg-gradient-to-r from-brand-pink to-brand-purple text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 타이핑 인디케이터 (데모용) */}
        <div className="mt-2 h-4">
          {/* 실제 구현에서는 여기에 타이핑 중인 사용자 표시 */}
        </div>
      </div>
    </div>
  );
};

export default ProjectChatRoom;
