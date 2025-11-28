import React, { useState, useEffect, useMemo } from 'react';
import { fetchThreads } from '../data';
import { Thread, ThreadCategory } from '../types';
import { PlusIcon, TrendingUpIcon, ArrowUpIcon, ArrowDownIcon, MessageCircleIcon, EyeIcon, PinIcon } from './icons';

// 핀 아이콘 추가 (icons.tsx에 없으면)
const PinIconLocal: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="17" x2="12" y2="22"></line>
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
  </svg>
);

const categories: { id: ThreadCategory | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'general', label: '자유토론' },
  { id: 'collaboration', label: '협업구함' },
  { id: 'feedback', label: '피드백' },
  { id: 'challenge', label: '챌린지' },
  { id: 'showcase', label: '작품공유' },
];

const categoryColors: Record<ThreadCategory, string> = {
  collaboration: 'bg-pink-100 text-pink-700',
  challenge: 'bg-yellow-100 text-yellow-700',
  feedback: 'bg-blue-100 text-blue-700',
  showcase: 'bg-green-100 text-green-700',
  general: 'bg-gray-100 text-gray-700',
};

const categoryLabels: Record<ThreadCategory, string> = {
  collaboration: '협업',
  challenge: '챌린지',
  feedback: '피드백',
  showcase: '공유',
  general: '자유',
};

interface CommunityPageProps {
  onCompose: () => void;
  onNavigateToThread: (threadId: string) => void;
}

// 시간 표시 함수
const timeAgo = (date: string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return '방금 전';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}일 전`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}개월 전`;
  return `${Math.floor(seconds / 31536000)}년 전`;
};

// 테이블 행 컴포넌트
const ThreadRow: React.FC<{
  thread: Thread;
  onNavigate: () => void;
  onVote: (type: 'up' | 'down') => void;
  voteStatus: 'up' | 'down' | null;
  score: number;
}> = ({ thread, onNavigate, onVote, voteStatus, score }) => (
  <tr
    onClick={onNavigate}
    className="border-b border-light-border hover:bg-light-bg/50 cursor-pointer transition-colors group"
  >
    {/* 추천 */}
    <td className="py-3 px-2 text-center w-20">
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => { e.stopPropagation(); onVote('up'); }}
          className={`p-0.5 rounded ${voteStatus === 'up' ? 'text-brand-pink' : 'text-light-text-secondary hover:text-brand-pink'}`}
        >
          <ArrowUpIcon className="w-4 h-4" />
        </button>
        <span className={`text-sm font-bold ${score > 0 ? 'text-brand-pink' : score < 0 ? 'text-blue-500' : 'text-light-text-secondary'}`}>
          {score}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onVote('down'); }}
          className={`p-0.5 rounded ${voteStatus === 'down' ? 'text-blue-500' : 'text-light-text-secondary hover:text-blue-500'}`}
        >
          <ArrowDownIcon className="w-4 h-4" />
        </button>
      </div>
    </td>

    {/* 제목 */}
    <td className="py-3 px-3">
      <div className="flex items-center space-x-2 min-w-0">
        {/* 카테고리 뱃지 */}
        <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${categoryColors[thread.category]}`}>
          {categoryLabels[thread.category]}
        </span>

        {/* 고정 아이콘 */}
        {thread.isPinned && (
          <PinIconLocal className="w-4 h-4 text-brand-pink flex-shrink-0" />
        )}

        {/* 제목 */}
        <span className="font-medium text-light-text-primary truncate group-hover:text-brand-pink transition-colors">
          {thread.title}
        </span>

        {/* 댓글 수 */}
        {thread.replies.length > 0 && (
          <span className="text-brand-pink text-sm font-medium flex-shrink-0">
            [{thread.replies.length}]
          </span>
        )}

        {/* 첨부파일 표시 */}
        {thread.attachment && (
          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded flex-shrink-0">
            🎵
          </span>
        )}
      </div>

      {/* 모바일에서 추가 정보 표시 */}
      <div className="md:hidden flex items-center space-x-2 mt-1 text-xs text-light-text-secondary">
        <span>{thread.author.name}</span>
        <span>•</span>
        <span>{timeAgo(thread.createdAt)}</span>
        <span>•</span>
        <span className="flex items-center space-x-0.5">
          <EyeIcon className="w-3 h-3" />
          <span>{thread.viewCount}</span>
        </span>
      </div>
    </td>

    {/* 작성자 (데스크톱) */}
    <td className="py-3 px-3 text-center hidden md:table-cell w-32">
      <div className="flex items-center justify-center space-x-1.5">
        <img
          src={thread.author.avatarUrl}
          alt={thread.author.name}
          className="w-5 h-5 rounded-full"
        />
        <span className="text-sm text-light-text-secondary truncate">
          {thread.author.name.length > 6 ? thread.author.name.slice(0, 6) + '..' : thread.author.name}
        </span>
      </div>
    </td>

    {/* 조회수 (데스크톱) */}
    <td className="py-3 px-3 text-center hidden md:table-cell w-20">
      <span className="text-sm text-light-text-secondary">{thread.viewCount}</span>
    </td>

    {/* 작성일 (데스크톱) */}
    <td className="py-3 px-3 text-right hidden md:table-cell w-24">
      <span className="text-sm text-light-text-secondary">{timeAgo(thread.createdAt)}</span>
    </td>
  </tr>
);

const CommunityPage: React.FC<CommunityPageProps> = ({ onCompose, onNavigateToThread }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ThreadCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'new'>('hot');
  const [voteStates, setVoteStates] = useState<Record<string, { status: 'up' | 'down' | null; score: number }>>({});

  useEffect(() => {
    const loadThreads = async () => {
      setIsLoading(true);
      const data = await fetchThreads();
      setThreads(data);
      // 초기 투표 상태 설정
      const initialVotes: Record<string, { status: 'up' | 'down' | null; score: number }> = {};
      data.forEach(thread => {
        initialVotes[thread.id] = { status: null, score: thread.votes.up - thread.votes.down };
      });
      setVoteStates(initialVotes);
      setIsLoading(false);
    };
    loadThreads();
  }, []);

  const handleVote = (threadId: string, type: 'up' | 'down') => {
    setVoteStates(prev => {
      const current = prev[threadId];
      if (!current) return prev;

      let newStatus: 'up' | 'down' | null = type;
      let scoreChange = 0;

      if (current.status === type) {
        // 취소
        newStatus = null;
        scoreChange = type === 'up' ? -1 : 1;
      } else {
        // 새 투표 또는 변경
        if (current.status === 'up') scoreChange -= 1;
        if (current.status === 'down') scoreChange += 1;
        scoreChange += type === 'up' ? 1 : -1;
      }

      return {
        ...prev,
        [threadId]: { status: newStatus, score: current.score + scoreChange }
      };
    });
  };

  const calculateHotScore = (thread: Thread): number => {
    const score = thread.votes.up - thread.votes.down;
    const order = Math.log10(Math.max(Math.abs(score), 1));
    const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
    const seconds = (new Date().getTime() - new Date(thread.createdAt).getTime()) / 1000;
    return sign * order + seconds / 45000;
  };

  const filteredAndSortedThreads = useMemo(() => {
    let filtered = threads;
    if (activeCategory !== 'all') {
      filtered = threads.filter(t => t.category === activeCategory);
    }

    return [...filtered].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return b.isPinned ? 1 : -1;
      }
      if (sortBy === 'new') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return calculateHotScore(b) - calculateHotScore(a);
    });
  }, [threads, activeCategory, sortBy]);

  return (
    <main className="flex-1 max-w-4xl mx-auto p-4 md:p-6 space-y-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-light-text-primary">Community</h1>
        <button
          onClick={onCompose}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">글쓰기</span>
        </button>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-brand-pink text-white'
                : 'bg-light-bg text-light-text-secondary hover:bg-light-border'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setSortBy('hot')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'hot'
              ? 'bg-light-bg text-brand-pink'
              : 'text-light-text-secondary hover:bg-light-bg'
          }`}
        >
          <TrendingUpIcon className="w-4 h-4" />
          <span>인기</span>
        </button>
        <button
          onClick={() => setSortBy('new')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'new'
              ? 'bg-light-bg text-brand-pink'
              : 'text-light-text-secondary hover:bg-light-bg'
          }`}
        >
          <span>⏰</span>
          <span>최신</span>
        </button>
      </div>

      {/* 테이블 게시판 */}
      <div className="bg-light-surface rounded-xl border border-light-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-light-bg/50 border-b border-light-border">
            <tr className="text-xs text-light-text-secondary">
              <th className="py-3 px-2 text-center w-20">추천</th>
              <th className="py-3 px-3 text-left">제목</th>
              <th className="py-3 px-3 text-center hidden md:table-cell w-32">작성자</th>
              <th className="py-3 px-3 text-center hidden md:table-cell w-20">조회</th>
              <th className="py-3 px-3 text-right hidden md:table-cell w-24">작성일</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // 로딩 스켈레톤
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-light-border">
                  <td className="py-4 px-2"><div className="h-12 bg-light-bg animate-pulse rounded mx-auto w-8" /></td>
                  <td className="py-4 px-3"><div className="h-5 bg-light-bg animate-pulse rounded w-3/4" /></td>
                  <td className="py-4 px-3 hidden md:table-cell"><div className="h-5 bg-light-bg animate-pulse rounded w-16 mx-auto" /></td>
                  <td className="py-4 px-3 hidden md:table-cell"><div className="h-5 bg-light-bg animate-pulse rounded w-10 mx-auto" /></td>
                  <td className="py-4 px-3 hidden md:table-cell"><div className="h-5 bg-light-bg animate-pulse rounded w-14 ml-auto" /></td>
                </tr>
              ))
            ) : filteredAndSortedThreads.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-light-text-secondary">
                  <div className="text-4xl mb-2">📝</div>
                  <p>아직 게시글이 없습니다</p>
                  <button
                    onClick={onCompose}
                    className="mt-4 text-brand-pink font-medium hover:underline"
                  >
                    첫 번째 글을 작성해보세요!
                  </button>
                </td>
              </tr>
            ) : (
              filteredAndSortedThreads.map(thread => (
                <ThreadRow
                  key={thread.id}
                  thread={thread}
                  onNavigate={() => onNavigateToThread(thread.id)}
                  onVote={(type) => handleVote(thread.id, type)}
                  voteStatus={voteStates[thread.id]?.status ?? null}
                  score={voteStates[thread.id]?.score ?? (thread.votes.up - thread.votes.down)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 실시간 활동 (라이브 피드) - 선택적 */}
      <div className="bg-light-surface rounded-xl border border-light-border p-4">
        <h3 className="font-bold text-light-text-primary mb-3 flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>실시간 활동</span>
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-light-text-secondary">
            <span className="w-1.5 h-1.5 bg-brand-pink rounded-full"></span>
            <span><strong className="text-light-text-primary">로파이 소녀</strong>님이 새 글을 작성했습니다</span>
            <span className="text-xs">방금 전</span>
          </div>
          <div className="flex items-center space-x-2 text-light-text-secondary">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            <span><strong className="text-light-text-primary">하이퍼팝 공주</strong>님이 댓글을 남겼습니다</span>
            <span className="text-xs">2분 전</span>
          </div>
          <div className="flex items-center space-x-2 text-light-text-secondary">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span><strong className="text-light-text-primary">앰비언트 드리머</strong>님이 추천했습니다</span>
            <span className="text-xs">5분 전</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CommunityPage;
