import React, { useState } from 'react';
import { PlusCircleIcon, PaperclipIcon, MicIcon, SmileIcon, SendIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-light-surface border-t border-light-border flex items-center space-x-2 flex-shrink-0">
      <button className="p-2 text-light-text-secondary hover:text-brand-pink">
        <PlusCircleIcon className="w-6 h-6" />
      </button>
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지 보내기..."
          className="w-full bg-light-bg border border-light-border rounded-full h-11 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-light-text-secondary hover:text-brand-pink">
          <SmileIcon className="w-6 h-6" />
        </button>
      </div>
      {message.trim() ? (
        <button
          onClick={handleSend}
          className="bg-brand-pink text-white rounded-full w-11 h-11 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      ) : (
        <div className="flex items-center space-x-1">
          <button className="p-2 text-light-text-secondary hover:text-brand-pink">
            <PaperclipIcon className="w-6 h-6" />
          </button>
          <button className="p-2 text-light-text-secondary hover:text-brand-pink">
            <MicIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
