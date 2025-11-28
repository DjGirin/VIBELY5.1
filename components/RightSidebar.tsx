import React from 'react';
import { User } from '../types';
import { users, activityNotifications } from '../data';
import LazyImage from './LazyImage';
import { HeartIcon, UserPlusIcon } from './icons';

const SidebarCard: React.FC<{ title: string; children: React.ReactNode }> = React.memo(({ title, children }) => (
  <div className="bg-light-surface rounded-xl p-4 shadow-sm border border-light-border">
    <h3 className="text-lg font-bold mb-4 text-light-text-primary">{title}</h3>
    {children}
  </div>
));

const LiveActivityItem: React.FC<{ user: User; action: string; time: string }> = React.memo(({ user, action, time }) => (
  <div className="flex items-center space-x-3 text-sm">
    <LazyImage src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
    <div className="flex-1">
      <p className="text-light-text-secondary">
        <span className="font-semibold text-light-text-primary">{user.name}</span> {action}
      </p>
    </div>
    <span className="text-xs text-light-text-muted">{time}</span>
  </div>
));

const CreatorItem: React.FC<{ user: User }> = React.memo(({ user }) => (
  <div className="flex items-center space-x-3">
    <LazyImage src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
    <div className="flex-1">
      <p className="font-semibold text-sm">{user.name}</p>
      <p className="text-xs text-light-text-secondary">{user.handle}</p>
    </div>
    <button className="bg-light-bg px-3 py-1 text-sm rounded-full hover:bg-brand-pink hover:text-white transition-colors">팔로우</button>
  </div>
));

const GenreChartItem: React.FC<{ rank: number; title: string; artist: string }> = React.memo(({ rank, title, artist }) => (
    <div className="flex items-center space-x-3">
        <span className="font-bold text-brand-pink w-4">{rank}.</span>
        <div>
            <p className="font-semibold text-sm truncate">{title}</p>
            <p className="text-xs text-light-text-secondary truncate">{artist}</p>
        </div>
    </div>
));


const RightSidebar: React.FC = () => {
  return (
    <aside className="hidden xl:block w-80 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto space-y-6">
        <SidebarCard title="Live Feed">
            <div className="space-y-4">
                <LiveActivityItem user={users.user2} action="followed you." time="2m" />
                <LiveActivityItem user={users.user4} action="liked Neon Sunset Drive." time="5m" />
                <LiveActivityItem user={users.user5} action="started following you." time="1h" />
            </div>
        </SidebarCard>
        
        <SidebarCard title="Genre Chart: Lofi">
            <div className="space-y-3">
                <GenreChartItem rank={1} title="Rainy Day Study" artist="Lofi Girl" />
                <GenreChartItem rank={2} title="Midnight Jazz" artist="Lofi Girl" />
                <GenreChartItem rank={3} title="Floating Textures" artist="Ambient Dreamer" />
            </div>
        </SidebarCard>

        <SidebarCard title="추천 크리에이터">
            <div className="space-y-4">
                <CreatorItem user={users.user2} />
                <CreatorItem user={users.user3} />
                <CreatorItem user={users.user5} />
            </div>
        </SidebarCard>

        <SidebarCard title="트렌딩 태그">
            <div className="flex flex-wrap gap-2">
                {['#Lofi', '#Cinematic', '#Ambient', '#Jazz', '#80s', '#Hyperpop'].map(tag => (
                    <span key={tag} className="bg-light-bg px-3 py-1 text-sm rounded-full cursor-pointer hover:bg-brand-pink transition-colors text-light-text-secondary hover:text-white">{tag}</span>
                ))}
            </div>
        </SidebarCard>
        
        <SidebarCard title="이달의 챌린지">
          <div className="bg-cover bg-center h-24 rounded-lg p-3 flex flex-col justify-end" style={{ backgroundImage: `url('https://picsum.photos/seed/challenge/300/100')` }}>
            <h4 className="text-white font-bold text-md shadow-lg">크리스마스 BGM 만들기</h4>
            <p className="text-white text-xs shadow-md">따뜻한 연말 분위기를 연출해보세요.</p>
          </div>
        </SidebarCard>

        <SidebarCard title="수익화 현황">
            <div className="bg-light-bg p-3 rounded-lg text-center">
                <p className="text-light-text-secondary text-sm">이번 달 예상 수익</p>
                <p className="text-2xl font-bold text-brand-pink mt-1">$1,234.56</p>
                <p className="text-xs text-green-500 mt-1">+12.5% vs 지난 달</p>
            </div>
        </SidebarCard>
    </aside>
  );
};

export default React.memo(RightSidebar);