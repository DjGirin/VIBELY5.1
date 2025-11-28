import React, { useState } from 'react';
import { mediaItems as allMedia, users, posts } from '../data';
import { Media, User } from '../types';
import LazyImage from './LazyImage';
import { PlayIcon, PauseIcon, HeartIcon, MoreVerticalIcon, ChevronDownIcon } from './icons';

// 시간 포맷
const formatDuration = (seconds?: number): string => {
  if (seconds === undefined) return '-:--';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// 재생수 포맷
const formatPlayCount = (count: number): string => {
  if (count >= 100000000) return `${(count / 100000000).toFixed(1)}억`;
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
  return count.toString();
};

// 음악 리스트 아이템 (유튜브 뮤직 스타일)
const MusicListItem: React.FC<{
  media: Media;
  rank?: number;
  isPlaying?: boolean;
  onPlay: () => void;
}> = ({ media, rank, isPlaying, onPlay }) => {
  const [isLiked, setIsLiked] = useState(false);
  // 더미 재생수
  const playCount = Math.floor(Math.random() * 1000000) + 10000;

  return (
    <div
      className={`flex items-center p-3 hover:bg-light-bg/70 transition-colors rounded-lg cursor-pointer group ${
        isPlaying ? 'bg-brand-pink/5' : ''
      }`}
      onClick={onPlay}
    >
      {/* 순위 또는 재생 버튼 */}
      {rank !== undefined ? (
        <div className="w-8 text-center mr-3">
          <span className={`font-bold ${rank <= 3 ? 'text-brand-pink' : 'text-light-text-secondary'}`}>
            {rank}
          </span>
        </div>
      ) : (
        <div className="w-8 mr-3 flex items-center justify-center">
          <button className="text-light-text-secondary group-hover:text-brand-pink">
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* 앨범 아트 */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-3">
        <LazyImage src={media.albumArtUrl} alt={media.title} className="w-full h-full object-cover" />
        {rank !== undefined && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayIcon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 mr-3">
        <h4 className={`font-semibold truncate ${isPlaying ? 'text-brand-pink' : 'text-light-text-primary'}`}>
          {media.title}
        </h4>
        <p className="text-sm text-light-text-secondary truncate">
          {media.artist} · {formatPlayCount(playCount)}회 재생
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className={`p-2 rounded-full hover:bg-light-border ${isLiked ? 'text-brand-pink' : 'text-light-text-secondary'}`}
        >
          <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-full hover:bg-light-border text-light-text-secondary"
        >
          <MoreVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 재생 시간 */}
      <span className="text-sm text-light-text-secondary ml-2 hidden sm:block">
        {formatDuration(media.duration)}
      </span>
    </div>
  );
};

// 빠른 선곡 카드
const QuickPickCard: React.FC<{ media: Media; onPlay: () => void }> = ({ media, onPlay }) => (
  <button
    onClick={onPlay}
    className="flex-shrink-0 w-36 group"
  >
    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
      <LazyImage src={media.albumArtUrl} alt={media.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <PlayIcon className="w-6 h-6 text-brand-pink pl-0.5" />
        </div>
      </div>
    </div>
    <h4 className="font-medium text-sm text-light-text-primary truncate">{media.title}</h4>
    <p className="text-xs text-light-text-secondary truncate">{media.artist}</p>
  </button>
);

// 장르 카드
const GenreCard: React.FC<{ genre: string; color: string; onClick: () => void }> = ({ genre, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} rounded-xl p-4 text-white font-bold text-lg hover:opacity-90 transition-opacity`}
  >
    {genre}
  </button>
);

const MusicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'charts' | 'explore'>('home');
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  const media = Object.values(allMedia).filter(m => (m as Media).mediaType === 'audio') as Media[];
  const usersList = Object.values(users) as User[];

  const genres = [
    { name: '로파이', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: '신스웨이브', color: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
    { name: '앰비언트', color: 'bg-gradient-to-br from-green-500 to-teal-500' },
    { name: '시네마틱', color: 'bg-gradient-to-br from-orange-500 to-red-500' },
    { name: '하이퍼팝', color: 'bg-gradient-to-br from-pink-500 to-yellow-500' },
    { name: '재즈', color: 'bg-gradient-to-br from-amber-600 to-yellow-600' },
  ];

  return (
    <main className="flex-1 max-w-4xl mx-auto pb-32">
      {/* 탭 네비게이션 */}
      <div className="sticky top-0 bg-light-bg z-20 border-b border-light-border">
        <div className="flex space-x-6 px-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'home'
                ? 'border-brand-pink text-brand-pink'
                : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
            }`}
          >
            홈
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'charts'
                ? 'border-brand-pink text-brand-pink'
                : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
            }`}
          >
            차트
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'explore'
                ? 'border-brand-pink text-brand-pink'
                : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
            }`}
          >
            탐색
          </button>
        </div>
      </div>

      {activeTab === 'home' && (
        <div className="space-y-8 pt-4">
          {/* 빠른 선곡 */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-2 py-1 text-xs rounded font-medium">
                  AI
                </span>
                <h2 className="font-bold text-lg">빠른 선곡</h2>
              </div>
              <button className="text-light-text-secondary hover:text-light-text-primary">
                <ChevronDownIcon className="w-5 h-5 rotate-[-90deg]" />
              </button>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
              {media.map((item) => (
                <QuickPickCard
                  key={item.id}
                  media={item}
                  onPlay={() => setCurrentPlayingId(item.id)}
                />
              ))}
            </div>
          </section>

          {/* 인기 트랙 */}
          <section className="px-4">
            <h2 className="font-bold text-lg mb-3">인기 트랙</h2>
            <div className="bg-light-surface rounded-xl border border-light-border overflow-hidden">
              {media.slice(0, 5).map((item, index) => (
                <MusicListItem
                  key={item.id}
                  media={item}
                  rank={index + 1}
                  isPlaying={currentPlayingId === item.id}
                  onPlay={() => setCurrentPlayingId(item.id)}
                />
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-brand-pink font-medium hover:bg-brand-pink/5 rounded-lg transition-colors">
              더보기
            </button>
          </section>

          {/* 장르별 추천 */}
          <section className="px-4">
            <h2 className="font-bold text-lg mb-3">장르별 탐색</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genres.map((genre) => (
                <GenreCard
                  key={genre.name}
                  genre={genre.name}
                  color={genre.color}
                  onClick={() => {}}
                />
              ))}
            </div>
          </section>

          {/* 추천 크리에이터 */}
          <section className="px-4">
            <h2 className="font-bold text-lg mb-3">추천 크리에이터</h2>
            <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
              {usersList.slice(1, 5).map((user) => (
                <div key={user.id} className="flex-shrink-0 w-28 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 ring-2 ring-brand-pink/20">
                    <LazyImage src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-medium text-sm truncate">{user.name}</h4>
                  <p className="text-xs text-light-text-secondary">{user.followersCount} 팔로워</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="pt-4 px-4">
          <h2 className="font-bold text-xl mb-4">🔥 실시간 차트</h2>
          <p className="text-sm text-light-text-secondary mb-4">매일 오전 6시 업데이트</p>
          <div className="bg-light-surface rounded-xl border border-light-border overflow-hidden">
            {media.map((item, index) => (
              <MusicListItem
                key={item.id}
                media={item}
                rank={index + 1}
                isPlaying={currentPlayingId === item.id}
                onPlay={() => setCurrentPlayingId(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="pt-4 space-y-8">
          {/* 인기 태그 */}
          <section className="px-4">
            <h2 className="font-bold text-lg mb-3">트렌딩 태그</h2>
            <div className="flex flex-wrap gap-2">
              {['#Lofi', '#Synthwave', '#Ambient', '#Cinematic', '#80s', '#Hyperpop', '#Jazz', '#Electronic'].map(tag => (
                <button
                  key={tag}
                  className="bg-light-bg hover:bg-brand-pink/10 text-light-text-primary hover:text-brand-pink px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* 장르별 */}
          <section className="px-4">
            <h2 className="font-bold text-lg mb-3">장르별 둘러보기</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genres.map((genre) => (
                <GenreCard
                  key={genre.name}
                  genre={genre.name}
                  color={genre.color}
                  onClick={() => {}}
                />
              ))}
            </div>
          </section>

          {/* 새로운 릴리즈 */}
          <section className="px-4">
            <h2 className="font-bold text-lg mb-3">새로운 릴리즈</h2>
            <div className="bg-light-surface rounded-xl border border-light-border overflow-hidden">
              {media.slice().reverse().map((item) => (
                <MusicListItem
                  key={item.id}
                  media={item}
                  isPlaying={currentPlayingId === item.id}
                  onPlay={() => setCurrentPlayingId(item.id)}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default MusicPage;
