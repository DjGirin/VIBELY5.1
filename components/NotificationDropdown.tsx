import React from 'react';
import { activityNotifications } from '../data';
import { ActivityNotification } from '../types';
import { DollarSignIcon, UserPlusIcon, MessageCircleIcon, HeartIcon, Share2Icon, BellIcon, XIcon } from './icons';
import LazyImage from './LazyImage';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const notifications: ActivityNotification[] = activityNotifications;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSignIcon className="w-5 h-5 text-green-500" />;
      case 'follow': return <UserPlusIcon className="w-5 h-5 text-blue-500" />;
      case 'message': return <MessageCircleIcon className="w-5 h-5 text-purple-500" />;
      case 'like': return <HeartIcon className="w-5 h-5 text-red-500" />;
      case 'music_shared': return <Share2Icon className="w-5 h-5 text-orange-500" />;
      default: return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderNotificationContent = (notification: ActivityNotification) => {
    const baseClasses = "flex items-center space-x-3";
    
    switch (notification.type) {
      case 'revenue':
        return (
          <div className={baseClasses}>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.title}</p>
              <p className="text-sm text-light-text-secondary">{notification.message}</p>
              <p className="text-xs text-light-text-muted mt-1">{notification.timestamp}</p>
            </div>
          </div>
        );
      
      case 'follow':
      case 'message':
      case 'like':
      case 'music_shared':
        return (
          <div className={baseClasses}>
            <LazyImage 
              src={notification.metadata?.avatarUrl || ''} 
              className="w-10 h-10 rounded-full flex-shrink-0"
              alt="User avatar"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-light-text-primary">{notification.title}</p>
              <p className="text-sm text-light-text-secondary">{notification.message}</p>
              <p className="text-xs text-light-text-muted mt-1">{notification.timestamp}</p>
            </div>
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={baseClasses}>
            <div className="w-10 h-10 bg-light-bg rounded-full flex items-center justify-center flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.title}</p>
              <p className="text-sm text-light-text-secondary">{notification.message}</p>
              <p className="text-xs text-light-text-muted mt-1">{notification.timestamp}</p>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-light-surface rounded-lg shadow-xl border border-light-border z-50 animate-fade-in-up">
      <div className="p-4 border-b border-light-border flex justify-between items-center">
        <h3 className="font-bold text-lg">알림</h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <span className="text-xs bg-brand-pink-accent text-white px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-light-text-secondary">
            <BellIcon className="w-12 h-12 mx-auto mb-4 text-light-border" />
            <p>새로운 알림이 없습니다</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`relative p-3 hover:bg-light-bg cursor-pointer border-b border-light-border/50 last:border-b-0 ${
                !notification.isRead ? 'bg-light-bg/50' : ''
              }`}
            >
              {renderNotificationContent(notification)}
              {!notification.isRead && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-light-border bg-light-bg/50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <button className="text-sm text-brand-pink hover:underline">
            모두 읽음으로 표시
          </button>
          <button className="text-sm text-light-text-secondary hover:text-light-text-primary">
            알림 설정
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;