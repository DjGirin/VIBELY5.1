import React, { useState } from 'react';
import { User } from '../types';
import { users } from '../data';
import LazyImage from './LazyImage';
import { SearchIcon, UsersIcon, DollarSignIcon, CalendarIcon, TrendingUpIcon, StarIcon, MessageCircleIcon, CheckIcon } from './icons';

interface OpenProject {
  id: string;
  title: string;
  description: string;
  owner: User;
  roles: { name: string; filled: boolean; compensation: string }[];
  budget: string;
  deadline: string;
  genre: string[];
  applicants: number;
  status: 'recruiting' | 'in_progress' | 'completed';
  createdAt: string;
  coverImage: string;
}

const sampleOpenProjects: OpenProject[] = [
  {
    id: 'op1',
    title: '신스웨이브 EP 앨범 제작',
    description: '5곡 분량의 신스웨이브 EP 앨범을 제작합니다. 80년대 레트로 분위기의 일관된 앨범을 만들 프로듀서, 마스터링 엔지니어를 찾습니다.',
    owner: users.user1,
    roles: [
      { name: '프로듀서', filled: false, compensation: '수익 30% 분배' },
      { name: '마스터링 엔지니어', filled: false, compensation: '곡당 50,000원' },
      { name: '커버 아티스트', filled: true, compensation: '200,000원 고정' }
    ],
    budget: '500,000원 ~ 800,000원',
    deadline: '2025-12-31',
    genre: ['신스웨이브', '레트로웨이브', '일렉트로닉'],
    applicants: 12,
    status: 'recruiting',
    createdAt: '2025-11-20',
    coverImage: 'https://picsum.photos/seed/op1/600/400'
  },
  {
    id: 'op2',
    title: '유튜브 채널 BGM 패키지',
    description: '게임 유튜브 채널용 BGM 10곡 패키지를 제작합니다. 신나는 분위기의 로파이 힙합, 칠아웃 트랙이 필요합니다.',
    owner: users.user2,
    roles: [
      { name: '작곡가', filled: false, compensation: '곡당 100,000원' },
      { name: '프롬프트 엔지니어', filled: false, compensation: '곡당 30,000원' }
    ],
    budget: '1,300,000원',
    deadline: '2025-12-15',
    genre: ['로파이', '칠아웃', '힙합'],
    applicants: 8,
    status: 'recruiting',
    createdAt: '2025-11-18',
    coverImage: 'https://picsum.photos/seed/op2/600/400'
  },
  {
    id: 'op3',
    title: '인디 게임 사운드트랙',
    description: '픽셀 아트 어드벤처 게임의 OST를 제작합니다. 칩튠과 오케스트라가 조화된 독특한 사운드를 원합니다.',
    owner: users.user5,
    roles: [
      { name: '칩튠 아티스트', filled: false, compensation: '수익 40% 분배' },
      { name: '오케스트레이터', filled: true, compensation: '수익 30% 분배' },
      { name: '사운드 디자이너', filled: false, compensation: '수익 30% 분배' }
    ],
    budget: '수익 분배',
    deadline: '2026-03-01',
    genre: ['칩튠', '시네마틱', '게임음악'],
    applicants: 25,
    status: 'recruiting',
    createdAt: '2025-11-15',
    coverImage: 'https://picsum.photos/seed/op3/600/400'
  },
  {
    id: 'op4',
    title: '명상 앱 배경음악',
    description: '명상/수면 앱에 들어갈 앰비언트 음악 20곡을 제작합니다. 자연 소리와 어우러지는 편안한 분위기가 필요합니다.',
    owner: users.user4,
    roles: [
      { name: '앰비언트 아티스트', filled: false, compensation: '곡당 80,000원' },
      { name: '필드 레코딩 전문가', filled: true, compensation: '시간당 50,000원' }
    ],
    budget: '2,000,000원',
    deadline: '2026-01-31',
    genre: ['앰비언트', '뉴에이지', '명상'],
    applicants: 15,
    status: 'recruiting',
    createdAt: '2025-11-22',
    coverImage: 'https://picsum.photos/seed/op4/600/400'
  },
  {
    id: 'op5',
    title: '하이퍼팝 싱글 콜라보',
    description: '실험적인 하이퍼팝 싱글을 함께 만들 아티스트를 찾습니다. 글리치, 보컬 프로세싱에 관심 있는 분 환영!',
    owner: users.user3,
    roles: [
      { name: '보컬리스트', filled: false, compensation: '수익 50% 분배' },
      { name: '믹싱 엔지니어', filled: false, compensation: '150,000원 고정' }
    ],
    budget: '협의 가능',
    deadline: '2025-12-20',
    genre: ['하이퍼팝', '실험음악', 'PC 뮤직'],
    applicants: 6,
    status: 'recruiting',
    createdAt: '2025-11-25',
    coverImage: 'https://picsum.photos/seed/op5/600/400'
  }
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  recruiting: { bg: 'bg-green-500/10', text: 'text-green-600', label: '모집중' },
  in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-600', label: '진행중' },
  completed: { bg: 'bg-gray-500/10', text: 'text-gray-600', label: '완료' }
};

const ProjectCard: React.FC<{ project: OpenProject; onApply: () => void }> = ({ project, onApply }) => {
  const openRoles = project.roles.filter(r => !r.filled);
  const status = statusColors[project.status];

  return (
    <div className="bg-light-surface rounded-xl border border-light-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
      {/* 커버 이미지 */}
      <div className="relative h-40">
        <LazyImage src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
          <UsersIcon className="w-3 h-3 text-white" />
          <span className="text-xs text-white">{project.applicants}명 지원</span>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-4">
        {/* 오너 정보 */}
        <div className="flex items-center space-x-2 mb-3">
          <LazyImage src={project.owner.avatarUrl} alt={project.owner.name} className="w-6 h-6 rounded-full" />
          <span className="text-sm text-light-text-secondary">{project.owner.name}</span>
          {project.owner.collaborationRating && (
            <span className="flex items-center text-xs text-yellow-500">
              <StarIcon className="w-3 h-3 fill-current mr-0.5" />
              {project.owner.collaborationRating}
            </span>
          )}
        </div>

        {/* 제목 & 설명 */}
        <h3 className="font-bold text-lg text-light-text-primary mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-sm text-light-text-secondary line-clamp-2 mb-3">{project.description}</p>

        {/* 장르 태그 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.genre.slice(0, 3).map(g => (
            <span key={g} className="bg-brand-pink/10 text-brand-pink px-2 py-0.5 text-xs rounded-full">
              {g}
            </span>
          ))}
        </div>

        {/* 모집 역할 */}
        <div className="mb-3">
          <p className="text-xs text-light-text-muted mb-2">모집 역할</p>
          <div className="space-y-1">
            {project.roles.slice(0, 3).map((role, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  {role.filled ? (
                    <CheckIcon className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <div className="w-4 h-4 border border-light-border rounded mr-1" />
                  )}
                  <span className={role.filled ? 'text-light-text-muted line-through' : 'text-light-text-primary'}>
                    {role.name}
                  </span>
                </div>
                <span className="text-xs text-light-text-muted">{role.compensation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 예산 & 마감일 */}
        <div className="flex items-center justify-between text-xs text-light-text-secondary mb-4 pt-3 border-t border-light-border">
          <div className="flex items-center">
            <DollarSignIcon className="w-4 h-4 mr-1" />
            <span>{project.budget}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>~{project.deadline}</span>
          </div>
        </div>

        {/* 지원 버튼 */}
        {openRoles.length > 0 && project.status === 'recruiting' && (
          <button
            onClick={onApply}
            className="w-full bg-gradient-to-r from-brand-pink to-brand-purple text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            지원하기 ({openRoles.length}개 역할)
          </button>
        )}
      </div>
    </div>
  );
};

const OpenProjectsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedCompensation, setSelectedCompensation] = useState<string>('all');

  const genres = ['all', '신스웨이브', '로파이', '시네마틱', '앰비언트', '하이퍼팝', '칩튠', '힙합'];
  const compensationTypes = [
    { id: 'all', label: '전체' },
    { id: 'fixed', label: '고정 금액' },
    { id: 'revenue', label: '수익 분배' },
    { id: 'negotiable', label: '협의 가능' }
  ];

  const filteredProjects = sampleOpenProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || project.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-light-text-primary mb-2">열린 프로젝트</h1>
        <p className="text-light-text-secondary">협업자를 모집 중인 프로젝트에 참여해보세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-light-surface rounded-xl border border-light-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-light-text-secondary text-sm">모집중</span>
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-light-text-primary">{sampleOpenProjects.filter(p => p.status === 'recruiting').length}</p>
        </div>
        <div className="bg-light-surface rounded-xl border border-light-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-light-text-secondary text-sm">총 프로젝트</span>
            <UsersIcon className="w-5 h-5 text-brand-pink" />
          </div>
          <p className="text-2xl font-bold text-light-text-primary">{sampleOpenProjects.length}</p>
        </div>
        <div className="bg-light-surface rounded-xl border border-light-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-light-text-secondary text-sm">평균 예산</span>
            <DollarSignIcon className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-light-text-primary">₩1.2M</p>
        </div>
        <div className="bg-light-surface rounded-xl border border-light-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-light-text-secondary text-sm">총 지원자</span>
            <MessageCircleIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-light-text-primary">{sampleOpenProjects.reduce((sum, p) => sum + p.applicants, 0)}</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-light-surface rounded-xl border border-light-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary" />
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-light-bg border border-light-border rounded-lg h-10 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>

          {/* 장르 필터 */}
          <div className="flex-shrink-0">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-light-bg border border-light-border rounded-lg h-10 px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
            >
              <option value="all">모든 장르</option>
              {genres.slice(1).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* 보상 유형 필터 */}
          <div className="flex-shrink-0">
            <select
              value={selectedCompensation}
              onChange={(e) => setSelectedCompensation(e.target.value)}
              className="bg-light-bg border border-light-border rounded-lg h-10 px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink"
            >
              {compensationTypes.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onApply={() => alert(`${project.title}에 지원합니다!`)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-light-text-secondary">검색 결과가 없습니다.</p>
        </div>
      )}

      {/* 프로젝트 등록 CTA */}
      <div className="mt-8 bg-gradient-to-r from-brand-pink/10 to-brand-purple/10 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold text-light-text-primary mb-2">협업자가 필요하신가요?</h3>
        <p className="text-light-text-secondary mb-4">프로젝트를 등록하고 실력있는 아티스트를 찾아보세요</p>
        <button className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
          프로젝트 등록하기
        </button>
      </div>
    </main>
  );
};

export default OpenProjectsPage;
