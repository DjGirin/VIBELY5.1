import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon } from './icons';
import LazyImage from './LazyImage';
import NotificationDropdown from './NotificationDropdown';
import { activityNotifications } from '../data';

interface HeaderProps {
  onNavigateToMyProfile: () => void;
  onNavigateToHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToMyProfile, onNavigateToHome }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = activityNotifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-light-surface/80 backdrop-blur-sm border-b border-light-border sticky top-0 z-40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <h1
                        className="text-xl md:text-2xl font-bold text-brand-pink-accent cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={onNavigateToHome}
                    >
                        Vibely
                    </h1>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="hidden md:block relative w-full max-w-xs lg:max-w-sm">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary"/>
                      <input type="text" placeholder="음악, 아티스트, 프롬프트 검색..." className="w-full bg-light-bg border border-light-border rounded-full h-10 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"/>
                    </div>
                    
                    <button className="p-2 rounded-full hover:bg-light-bg md:hidden" aria-label="검색">
                      <SearchIcon className="w-6 h-6 text-light-text-secondary"/>
                    </button>
                    
                    <div ref={notificationRef} className="relative">
                        <button 
                            onClick={() => setIsNotificationOpen(prev => !prev)}
                            className="relative p-2 rounded-full hover:bg-light-bg" 
                            aria-label="알림"
                        >
                            <BellIcon className="w-6 h-6 text-light-text-secondary"/>
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-brand-pink-accent ring-2 ring-light-surface"></span>
                            )}
                        </button>
                        <NotificationDropdown isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                    </div>

                    <button onClick={onNavigateToMyProfile} aria-label="내 프로필 보기">
                      <LazyImage src="https://picsum.photos/seed/currentuser/40/40" alt="내 프로필" className="h-10 w-10 rounded-full cursor-pointer"/>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);