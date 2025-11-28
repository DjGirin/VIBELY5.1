import React, { useState, useMemo } from 'react';
import { users as allUsersData } from '../data';
import { User } from '../types';
import { CheckIcon, UserPlusIcon } from './icons';
import LazyImage from './LazyImage';

const UserCard: React.FC<{ user: User }> = React.memo(({ user }) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing);

    const handleFollow = () => {
        // In a real app, this would be an API call
        setIsFollowing(!isFollowing);
    };

    return (
        <div className="bg-light-surface rounded-xl border border-light-border p-4 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="relative">
                <LazyImage src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mb-4 ring-2 ring-light-border" />
                {user.isOnline && <span className="absolute bottom-5 right-1 block h-4 w-4 rounded-full bg-green-400 ring-2 ring-light-surface"></span>}
            </div>
            <h3 className="font-bold text-lg text-light-text-primary">{user.name}</h3>
            <p className="text-sm text-brand-pink mb-2">{user.handle}</p>
            <div className="flex flex-wrap justify-center gap-1 mb-3">
                {user.genreTags.map(tag => (
                    <span key={tag} className="text-xs bg-light-bg px-2 py-1 rounded-full text-light-text-secondary">{tag}</span>
                ))}
            </div>
            <p className="text-xs text-light-text-secondary h-8 line-clamp-2 mb-4">{user.bio}</p>
            <div className="flex text-sm space-x-4 mb-4 text-light-text-secondary">
                <div><strong className="text-light-text-primary">{user.followersCount}</strong> Followers</div>
                <div><strong className="text-light-text-primary">{user.followingCount}</strong> Following</div>
            </div>
             <button 
                onClick={handleFollow}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isFollowing 
                    ? 'bg-light-bg text-light-text-secondary hover:bg-red-100 hover:text-red-500' 
                    : 'bg-brand-pink text-white hover:bg-brand-pink-accent'
                }`}
            >
                {isFollowing ? <CheckIcon className="w-5 h-5" /> : <UserPlusIcon className="w-5 h-5" />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
        </div>
    );
});

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <section>
        <h2 className="text-2xl font-bold mb-4 text-light-text-primary">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {children}
        </div>
    </section>
);


const FriendsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'recommended' | 'following' | 'followers'>('recommended');
    const allUsers: User[] = useMemo(() => Object.values(allUsersData), []);
    const currentUser = allUsers.find(u => u.id === 'user1'); // Assuming user1 is logged in

    const following = useMemo(() => allUsers.filter(u => currentUser?.followingIds?.includes(u.id)), [allUsers, currentUser]);
    const followers = useMemo(() => allUsers.filter(u => u.followingIds?.includes(currentUser?.id ?? '')), [allUsers, currentUser]);


    const renderContent = () => {
        switch (activeTab) {
            case 'following':
                return <Section title="Following">{following.map(user => <UserCard key={user.id} user={user} />)}</Section>;
            case 'followers':
                return <Section title="Followers">{followers.map(user => <UserCard key={user.id} user={user} />)}</Section>;
            case 'recommended':
            default:
                return (
                    <div className="space-y-12">
                         <Section title="Similar Genres For You">
                            {/* FIX: Added optional chaining to prevent runtime error if currentUser or currentUser.genreTags is undefined */}
                            {allUsers.filter(u => u.id !== currentUser?.id && u.genreTags.some(t => currentUser?.genreTags?.includes(t))).slice(0, 4).map(user => <UserCard key={user.id} user={user} />)}
                        </Section>
                        <Section title="Popular Contributors">
                             {allUsers.filter(u => u.isContributor && u.id !== currentUser?.id).slice(0, 8).map(user => <UserCard key={user.id} user={user} />)}
                        </Section>
                        <Section title="New Creators">
                             {allUsers.sort((a,b) => b.followersCount - a.followersCount).slice(-4).map(user => <UserCard key={user.id} user={user} />)}
                        </Section>
                    </div>
                );
        }
    };

    const TabButton: React.FC<{tabId: typeof activeTab, label: string}> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-lg font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === tabId 
                ? 'text-brand-pink border-brand-pink' 
                : 'text-light-text-secondary border-transparent hover:border-light-border hover:text-light-text-primary'
            }`}
        >
            {label}
        </button>
    );

    return (
        <main className="flex-1 max-w-7xl mx-auto p-4 md:p-6">
            <div className="border-b border-light-border mb-6">
                <TabButton tabId="recommended" label="추천" />
                <TabButton tabId="following" label="팔로잉" />
                <TabButton tabId="followers" label="팔로워" />
            </div>
            {renderContent()}
        </main>
    );
};

export default FriendsPage;