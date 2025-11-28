import React, { useState, useMemo } from 'react';
import { User, Media } from '../types';
import { posts, users } from '../data';
import ShortFormFeed from './ShortFormFeed';

interface StagePageProps {
  onNavigateToProfile: (userId: string) => void;
  currentUser: User;
  currentTrack: Media | null;
  isPlaying: boolean;
  onSetTrack: (track: Media) => void;
  playbackTime: number;
  playbackDuration: number;
  onSeekToTime: (time: number) => void;
  onNavigateToProject: (projectId: string) => void;
}

const StagePage: React.FC<StagePageProps> = ({
  onNavigateToProfile,
  currentUser,
  currentTrack,
  isPlaying,
  onSetTrack,
  onNavigateToProject,
}) => {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following' | 'trending'>('foryou');

  // 팔로우 중인 유저들
  const followingUsers = useMemo(() => {
    return currentUser.followingIds
      .map(id => users[id])
      .filter(Boolean);
  }, [currentUser.followingIds]);

  // 탭별 포스트 필터링
  const filteredPosts = useMemo(() => {
    switch (activeTab) {
      case 'following':
        return posts.filter(post =>
          currentUser.followingIds.includes(post.author.id)
        );
      case 'trending':
        return [...posts].sort((a, b) => b.likes - a.likes);
      case 'foryou':
      default:
        return posts;
    }
  }, [activeTab, currentUser.followingIds]);

  return (
    <main className="flex-1 max-w-4xl mx-auto md:p-4">
      {/* 탭 네비게이션 */}
      <div className="flex justify-center space-x-6 py-3 bg-light-surface md:bg-transparent md:rounded-t-xl">
        <button
          onClick={() => setActiveTab('foryou')}
          className={`px-4 py-2 font-semibold text-sm transition-colors relative ${
            activeTab === 'foryou'
              ? 'text-brand-pink'
              : 'text-light-text-secondary hover:text-light-text-primary'
          }`}
        >
          추천
          {activeTab === 'foryou' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-pink rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 font-semibold text-sm transition-colors relative ${
            activeTab === 'following'
              ? 'text-brand-pink'
              : 'text-light-text-secondary hover:text-light-text-primary'
          }`}
        >
          팔로잉
          {activeTab === 'following' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-pink rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-2 font-semibold text-sm transition-colors relative ${
            activeTab === 'trending'
              ? 'text-brand-pink'
              : 'text-light-text-secondary hover:text-light-text-primary'
          }`}
        >
          인기
          {activeTab === 'trending' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-pink rounded-full" />
          )}
        </button>
      </div>

      {/* 숏폼 피드 */}
      {filteredPosts.length > 0 ? (
        <ShortFormFeed
          posts={filteredPosts}
          currentUser={currentUser}
          followingUsers={followingUsers}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onSetTrack={onSetTrack}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToProject={onNavigateToProject}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-bold text-light-text-primary mb-2">
            아직 콘텐츠가 없어요
          </h3>
          <p className="text-light-text-secondary">
            {activeTab === 'following'
              ? '팔로우한 아티스트의 새로운 음악이 여기에 표시됩니다.'
              : '새로운 음악을 발견해보세요!'}
          </p>
        </div>
      )}
    </main>
  );
};

export default StagePage;
