import React, { useState } from 'react';
import { User } from '../types';
import LazyImage from './LazyImage';
import { CheckIcon, UserPlusIcon } from './icons';

interface UserListItemProps {
    user: User;
    onNavigateToProfile: (userId: string) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onNavigateToProfile }) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing);

    const handleFollowToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when clicking the button
        setIsFollowing(prev => !prev);
    };

    return (
        <div 
            onClick={() => onNavigateToProfile(user.id)}
            className="flex items-center p-3 bg-light-surface rounded-lg border border-light-border hover:bg-light-bg/50 cursor-pointer"
        >
            <LazyImage src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1 ml-4">
                <p className="font-bold text-light-text-primary">{user.name}</p>
                <p className="text-sm text-light-text-secondary">{user.handle}</p>
            </div>
            {user.id !== 'user1' && ( // Don't show follow button for the current user
                <button
                    onClick={handleFollowToggle}
                    className={`w-28 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                        isFollowing
                        ? 'bg-light-bg text-light-text-secondary hover:bg-red-100 hover:text-red-500'
                        : 'bg-brand-pink text-white hover:bg-brand-pink-accent'
                    }`}
                >
                    {isFollowing ? <CheckIcon className="w-5 h-5" /> : <UserPlusIcon className="w-5 h-5" />}
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
            )}
        </div>
    );
};

export default UserListItem;
