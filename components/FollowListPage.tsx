import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { users as allUsersData } from '../data';
import { ArrowLeftIcon, SearchIcon } from './icons';
import UserListItem from './UserListItem';

interface FollowListPageProps {
    userId: string;
    initialType: 'followers' | 'following';
    onBackToProfile: () => void;
    onNavigateToProfile: (userId: string) => void;
}

const FollowListPage: React.FC<FollowListPageProps> = ({ userId, initialType, onBackToProfile, onNavigateToProfile }) => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialType);
    const [searchQuery, setSearchQuery] = useState('');

    const profileUser = useMemo(() => allUsersData[userId], [userId]);
    const allUsers = useMemo(() => Object.values(allUsersData), []);

    const { followers, following } = useMemo(() => {
        if (!profileUser) return { followers: [], following: [] };
        
        const followingList = allUsers.filter(u => profileUser.followingIds.includes(u.id));
        const followerList = allUsers.filter(u => u.followingIds.includes(profileUser.id));

        return { followers: followerList, following: followingList };
    }, [profileUser, allUsers]);

    const displayedUsers = useMemo(() => {
        const list = activeTab === 'followers' ? followers : following;
        if (!searchQuery) return list;
        return list.filter(u => 
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.handle.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeTab, followers, following, searchQuery]);

    if (!profileUser) {
        return (
            <main className="flex-1 max-w-2xl mx-auto p-4 md:p-6 text-center">
                User not found.
                <button onClick={onBackToProfile} className="text-brand-pink hover:underline mt-4">Go Back</button>
            </main>
        );
    }

    const TabButton: React.FC<{ tabId: 'followers' | 'following', label: string, count: number }> = ({ tabId, label, count }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`w-1/2 py-3 text-center font-semibold border-b-2 transition-colors ${
                activeTab === tabId
                ? 'text-brand-pink border-brand-pink'
                : 'text-light-text-secondary border-transparent hover:text-light-text-primary'
            }`}
        >
            {label} <span className="text-sm font-normal">{count}</span>
        </button>
    );

    return (
        <main className="flex-1 max-w-2xl mx-auto">
            <div className="sticky top-16 bg-light-surface/80 backdrop-blur-sm z-10 border-b border-light-border">
                <div className="flex items-center p-3">
                    <button onClick={onBackToProfile} className="p-2 rounded-full hover:bg-light-bg mr-2">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">{profileUser.name}</h1>
                        <p className="text-sm text-light-text-secondary">{profileUser.handle}</p>
                    </div>
                </div>
                <div className="flex">
                    <TabButton tabId="followers" label="Followers" count={followers.length} />
                    <TabButton tabId="following" label="Following" count={following.length} />
                </div>
            </div>

            <div className="p-4">
                <div className="relative mb-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={`Search in ${activeTab}...`}
                        className="w-full bg-light-surface border border-light-border rounded-full h-11 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    />
                </div>

                <div className="space-y-2">
                    {displayedUsers.length > 0 ? (
                        displayedUsers.map(user => (
                            <UserListItem 
                                key={user.id} 
                                user={user} 
                                onNavigateToProfile={onNavigateToProfile} 
                            />
                        ))
                    ) : (
                        <p className="text-center text-light-text-secondary py-12">No users found.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default FollowListPage;
