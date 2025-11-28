import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Post, Media, User } from '../types';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  MessageCircleIcon,
  Share2Icon,
  BookmarkIcon,
  Volume2Icon,
  VolumeXIcon,
  MaximizeIcon,
  PlayIcon,
  PauseIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from './icons';

interface ShortFormFeedProps {
  posts: Post[];
  currentUser: User;
  followingUsers: User[];
  currentTrack: Media | null;
  isPlaying: boolean;
  onSetTrack: (track: Media) => void;
  onNavigateToProfile: (userId: string) => void;
  onNavigateToProject: (projectId: string) => void;
}

// 숫자 포맷팅 (1000 -> 1천, 10000 -> 1만)
const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천`;
  }
  return count.toString();
};

// 아티스트 스토리 원형 컴포넌트
const ArtistStoryCircle: React.FC<{
  artist: User;
  onClick: () => void;
  isActive?: boolean;
}> = ({ artist, onClick, isActive }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center flex-shrink-0 group"
  >
    <div className={`w-16 h-16 rounded-full p-0.5 ${
      isActive
        ? 'bg-gradient-to-r from-brand-pink to-brand-purple'
        : 'bg-light-border'
    }`}>
      <img
        src={artist.avatarUrl}
        alt={artist.name}
        className="w-full h-full rounded-full object-cover border-2 border-light-surface"
      />
    </div>
    <span className="text-xs text-light-text-secondary mt-1 truncate w-16 text-center group-hover:text-light-text-primary">
      {artist.name.length > 6 ? artist.name.slice(0, 6) + '..' : artist.name}
    </span>
  </button>
);

// 인터랙션 버튼 컴포넌트
const InteractionButton: React.FC<{
  icon: React.ReactNode;
  count?: string;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ icon, count, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center transition-transform hover:scale-110 active:scale-95 ${
      isActive ? 'text-brand-pink' : 'text-white'
    }`}
  >
    <div className="w-12 h-12 flex items-center justify-center">
      {icon}
    </div>
    {count && <span className="text-xs font-semibold mt-1">{count}</span>}
    {label && !count && <span className="text-xs mt-1">{label}</span>}
  </button>
);

// 개별 숏폼 아이템 컴포넌트
const ShortFormItem: React.FC<{
  post: Post;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onLike: () => void;
  onDislike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  onNavigateToProfile: (userId: string) => void;
  onNavigateToProject: (projectId: string) => void;
  isLiked: boolean;
  isSaved: boolean;
  currentTrack: Media | null;
  isPlaying: boolean;
  onSetTrack: (track: Media) => void;
}> = ({
  post,
  isActive,
  isMuted,
  onToggleMute,
  onLike,
  onDislike,
  onComment,
  onShare,
  onSave,
  onNavigateToProfile,
  onNavigateToProject,
  isLiked,
  isSaved,
  currentTrack,
  isPlaying,
  onSetTrack
}) => {
  const isThisTrackPlaying = currentTrack?.id === post.media.id && isPlaying;

  const handlePlayPause = useCallback(() => {
    if (post.media.mediaType === 'audio') {
      onSetTrack(post.media);
    }
  }, [post.media, onSetTrack]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* 배경 이미지/비디오 */}
      <div className="absolute inset-0">
        {post.media.mediaType === 'video' ? (
          <video
            src={post.media.fileUrl}
            className="w-full h-full object-cover"
            autoPlay={isActive}
            loop
            muted={isMuted}
            playsInline
          />
        ) : (
          <img
            src={post.media.albumArtUrl}
            alt={post.media.title}
            className="w-full h-full object-cover blur-sm opacity-60"
          />
        )}
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      </div>

      {/* 오디오인 경우 앨범 아트 중앙에 표시 */}
      {post.media.mediaType === 'audio' && (
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl ${
              isThisTrackPlaying ? 'animate-pulse' : ''
            }`}
          >
            <img
              src={post.media.albumArtUrl}
              alt={post.media.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* 재생/일시정지 버튼 */}
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              {isThisTrackPlaying ? (
                <PauseIcon className="w-8 h-8 text-white" />
              ) : (
                <PlayIcon className="w-8 h-8 text-white pl-1" />
              )}
            </div>
          </button>
        </div>
      )}

      {/* 좌측 상단 컨트롤 */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 z-20">
        <button
          onClick={onToggleMute}
          className="bg-black/40 backdrop-blur-sm rounded-full p-2 hover:bg-black/60 transition-colors"
        >
          {isMuted ? (
            <VolumeXIcon className="w-5 h-5 text-white" />
          ) : (
            <Volume2Icon className="w-5 h-5 text-white" />
          )}
        </button>
        <button className="bg-black/40 backdrop-blur-sm rounded-full p-2 hover:bg-black/60 transition-colors">
          <MaximizeIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 우측 인터랙션 버튼 (틱톡/쇼츠 스타일) */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center space-y-5 z-20">
        {/* 프로필 */}
        <button
          onClick={() => onNavigateToProfile(post.author.id)}
          className="relative mb-2"
        >
          <img
            src={post.author.avatarUrl}
            alt={post.author.name}
            className="w-11 h-11 rounded-full border-2 border-white object-cover"
          />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-brand-pink rounded-full flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
        </button>

        <InteractionButton
          icon={<ThumbsUpIcon className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />}
          count={formatCount(post.likes + (isLiked ? 1 : 0))}
          isActive={isLiked}
          onClick={onLike}
        />
        <InteractionButton
          icon={<ThumbsDownIcon className="w-7 h-7" />}
          label="싫어요"
          onClick={onDislike}
        />
        <InteractionButton
          icon={<MessageCircleIcon className="w-7 h-7" />}
          count={formatCount(post.comments.length)}
          onClick={onComment}
        />
        <InteractionButton
          icon={<Share2Icon className="w-7 h-7" />}
          label="공유"
          onClick={onShare}
        />
        <InteractionButton
          icon={<BookmarkIcon className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />}
          count={isSaved ? '저장됨' : '저장'}
          isActive={isSaved}
          onClick={onSave}
        />
      </div>

      {/* 하단 정보 영역 */}
      <div className="absolute bottom-20 left-4 right-20 z-20">
        <h2 className="text-white text-lg font-bold drop-shadow-lg">{post.media.title}</h2>
        <button
          onClick={() => onNavigateToProfile(post.author.id)}
          className="text-white/90 font-medium hover:underline"
        >
          @{post.author.handle.replace('@', '')}
        </button>
        <p className="text-white/70 text-sm mt-2 line-clamp-2">{post.description}</p>

        {/* 장르 태그 */}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full">
            #{post.media.genre}
          </span>
        </div>

        {/* 제작 과정 보기 버튼 */}
        {post.portfolioProjectId && (
          <button
            onClick={() => onNavigateToProject(post.portfolioProjectId!)}
            className="mt-3 flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm hover:bg-white/30 transition-colors"
          >
            <span>🎬 제작 과정 보기</span>
          </button>
        )}
      </div>
    </div>
  );
};

const ShortFormFeed: React.FC<ShortFormFeedProps> = ({
  posts,
  currentUser,
  followingUsers,
  currentTrack,
  isPlaying,
  onSetTrack,
  onNavigateToProfile,
  onNavigateToProject,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posts.length]);

  // 터치 스와이프 핸들링
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // 위로 스와이프 -> 다음
        setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1));
      } else {
        // 아래로 스와이프 -> 이전
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
    setTouchStart(null);
  }, [touchStart, posts.length]);

  // 마우스 휠 핸들링
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 50) {
      if (e.deltaY > 0) {
        setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1));
      } else {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
  }, [posts.length]);

  const handleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const handleSave = useCallback((postId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1));
  }, [posts.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const currentPost = posts[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] overflow-hidden bg-black rounded-xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* 상단: 팔로우 아티스트 스토리 */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {followingUsers.map(artist => (
            <ArtistStoryCircle
              key={artist.id}
              artist={artist}
              onClick={() => onNavigateToProfile(artist.id)}
              isActive={artist.isOnline}
            />
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      {currentPost && (
        <ShortFormItem
          post={currentPost}
          isActive={true}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onLike={() => handleLike(currentPost.id)}
          onDislike={() => {}}
          onComment={() => {}}
          onShare={() => {}}
          onSave={() => handleSave(currentPost.id)}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToProject={onNavigateToProject}
          isLiked={likedPosts.has(currentPost.id)}
          isSaved={savedPosts.has(currentPost.id)}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onSetTrack={onSetTrack}
        />
      )}

      {/* 네비게이션 버튼 (데스크톱) */}
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col space-y-2 z-30">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="bg-black/40 backdrop-blur-sm rounded-full p-2 hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUpIcon className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === posts.length - 1}
          className="bg-black/40 backdrop-blur-sm rounded-full p-2 hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDownIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 인디케이터 */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col space-y-1 z-30">
        {posts.slice(Math.max(0, currentIndex - 2), Math.min(posts.length, currentIndex + 3)).map((post, idx) => {
          const actualIndex = Math.max(0, currentIndex - 2) + idx;
          return (
            <button
              key={post.id}
              onClick={() => setCurrentIndex(actualIndex)}
              className={`w-1 rounded-full transition-all ${
                actualIndex === currentIndex
                  ? 'h-6 bg-white'
                  : 'h-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          );
        })}
      </div>

      {/* 현재 위치 표시 */}
      <div className="absolute bottom-4 left-4 z-30">
        <span className="text-white/60 text-xs">
          {currentIndex + 1} / {posts.length}
        </span>
      </div>
    </div>
  );
};

export default ShortFormFeed;
