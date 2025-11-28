import React, { useState, useMemo } from 'react';
import { sampleStudioProjects } from '../data';
import ProjectCard from './ProjectCard';
import { FilePlus2Icon, LayoutGridIcon, FolderKanbanIcon, SearchIcon, SlidersHorizontalIcon } from './icons';
import StartProjectModal from './StartProjectModal';
import { StudioProject } from '../types';
import { users } from '../data';
import KanbanBoardView from './KanbanBoardView';
import StudioProjectDetailPage from './StudioProjectDetailPage';

type ProjectTab = 'all' | 'my' | 'team' | 'public';
type ViewMode = 'grid' | 'kanban';

const ProjectsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<StudioProject[]>(sampleStudioProjects);
  const [selectedProject, setSelectedProject] = useState<StudioProject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StudioProject['status'] | 'all'>('all');
  const currentUserId = 'user1';

  const filteredProjects = useMemo(() => {
    let result = projects;

    // 탭 필터
    switch (activeTab) {
      case 'my':
        result = result.filter(p => p.contributors.some(c => c.user.id === currentUserId && !p.isPublic));
        break;
      case 'team':
        result = result.filter(p => p.contributors.length > 1);
        break;
      case 'public':
        result = result.filter(p => p.isPublic);
        break;
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.genre.toLowerCase().includes(query)
      );
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    return result;
  }, [activeTab, projects, searchQuery, statusFilter]);

  const handleCreateProject = (newProjectData: Omit<StudioProject, 'id' | 'contributors' | 'lastUpdatedAt' | 'progress' | 'tasks' | 'files' | 'messages'>) => {
    const newProject: StudioProject = {
      id: `proj${Date.now()}`,
      ...newProjectData,
      contributors: [{ user: users[currentUserId], role: 'Producer' }],
      lastUpdatedAt: new Date().toISOString(),
      progress: 0,
      tasks: [],
      files: [],
      messages: [],
    };
    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  const handleProjectClick = (project: StudioProject) => {
    setSelectedProject(project);
  };

  const handleStatusChange = (projectId: string, newStatus: StudioProject['status']) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              status: newStatus,
              progress: getProgressByStatus(newStatus),
              lastUpdatedAt: new Date().toISOString()
            }
          : p
      )
    );
  };

  const getProgressByStatus = (status: StudioProject['status']): number => {
    const progressMap: Record<StudioProject['status'], number> = {
      planning: 10,
      recording: 30,
      mixing: 60,
      mastering: 85,
      completed: 100,
    };
    return progressMap[status];
  };

  // 프로젝트 상세 페이지 표시
  if (selectedProject) {
    return (
      <StudioProjectDetailPage
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  const TabButton: React.FC<{ tabId: ProjectTab; label: string; count: number }> = ({ tabId, label, count }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm md:text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${
        activeTab === tabId
          ? 'text-brand-purple border-brand-purple'
          : 'text-light-text-secondary border-transparent hover:border-light-border hover:text-light-text-primary'
      }`}
    >
      {label}
      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
        activeTab === tabId ? 'bg-brand-purple/10 text-brand-purple' : 'bg-light-bg text-light-text-secondary'
      }`}>
        {count}
      </span>
    </button>
  );

  const statusOptions: { value: StudioProject['status'] | 'all'; label: string }[] = [
    { value: 'all', label: '전체 상태' },
    { value: 'planning', label: '기획' },
    { value: 'recording', label: '녹음' },
    { value: 'mixing', label: '믹싱' },
    { value: 'mastering', label: '마스터링' },
    { value: 'completed', label: '완료' },
  ];

  return (
    <>
      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-6">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-light-text-primary">Projects</h1>
            <p className="text-light-text-secondary text-sm mt-1">음악 제작 프로젝트 관리</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            <FilePlus2Icon className="w-5 h-5" />
            <span>새 프로젝트</span>
          </button>
        </div>

        {/* 검색 & 필터 & 뷰 전환 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* 검색 */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로젝트 검색..."
              className="w-full pl-10 pr-4 py-2.5 bg-light-surface border border-light-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
            />
          </div>

          {/* 필터 토글 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 border rounded-xl transition-colors ${
              showFilters || statusFilter !== 'all'
                ? 'border-brand-pink bg-brand-pink/5 text-brand-pink'
                : 'border-light-border text-light-text-secondary hover:border-brand-pink/50'
            }`}
          >
            <SlidersHorizontalIcon className="w-5 h-5" />
            <span className="hidden md:inline">필터</span>
          </button>

          {/* 뷰 전환 */}
          <div className="flex bg-light-bg rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow text-brand-purple'
                  : 'text-light-text-secondary hover:text-light-text-primary'
              }`}
            >
              <LayoutGridIcon className="w-5 h-5" />
              <span className="hidden md:inline">그리드</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white shadow text-brand-purple'
                  : 'text-light-text-secondary hover:text-light-text-primary'
              }`}
            >
              <FolderKanbanIcon className="w-5 h-5" />
              <span className="hidden md:inline">칸반</span>
            </button>
          </div>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <div className="bg-light-surface border border-light-border rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text-secondary mb-2">상태</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StudioProject['status'] | 'all')}
                  className="px-3 py-2 bg-light-bg border border-light-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {(statusFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="self-end px-4 py-2 text-sm text-brand-pink hover:underline"
                >
                  필터 초기화
                </button>
              )}
            </div>
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="border-b border-light-border mb-6 overflow-x-auto">
          <div className="flex">
            <TabButton tabId="all" label="전체" count={projects.length} />
            <TabButton
              tabId="my"
              label="내 프로젝트"
              count={projects.filter(p => p.contributors.some(c => c.user.id === currentUserId && !p.isPublic)).length}
            />
            <TabButton
              tabId="team"
              label="팀 프로젝트"
              count={projects.filter(p => p.contributors.length > 1).length}
            />
            <TabButton
              tabId="public"
              label="공개"
              count={projects.filter(p => p.isPublic).length}
            />
          </div>
        </div>

        {/* 프로젝트 목록 */}
        {viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-light-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderKanbanIcon className="w-8 h-8 text-light-text-muted" />
                </div>
                <p className="text-light-text-secondary">
                  {searchQuery || statusFilter !== 'all'
                    ? '검색 결과가 없습니다.'
                    : '이 카테고리에 프로젝트가 없습니다.'}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-brand-pink hover:underline"
                >
                  새 프로젝트 시작하기
                </button>
              </div>
            )}
          </>
        ) : (
          <KanbanBoardView
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      <StartProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
};

export default ProjectsPage;
