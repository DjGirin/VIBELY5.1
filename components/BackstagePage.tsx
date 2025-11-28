import React from 'react';
import { LayoutDashboardIcon, FolderKanbanIcon, UsersIcon, SparklesIcon, TrendingUpIcon, CalendarIcon } from './icons';
import { sampleStudioProjects } from '../data';
import LazyImage from './LazyImage';

interface BackstagePageProps {
  onNavigate: (page: any) => void;
}

// 프로젝트 상태별 스타일
const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-500', lightBg: 'bg-blue-100', textColor: 'text-blue-700' },
  recording: { label: '녹음', color: 'bg-red-500', lightBg: 'bg-red-100', textColor: 'text-red-700' },
  mixing: { label: '믹싱', color: 'bg-yellow-500', lightBg: 'bg-yellow-100', textColor: 'text-yellow-700' },
  mastering: { label: '마스터링', color: 'bg-purple-500', lightBg: 'bg-purple-100', textColor: 'text-purple-700' },
  completed: { label: '완료', color: 'bg-green-500', lightBg: 'bg-green-100', textColor: 'text-green-700' },
};

// 빠른 액세스 카드
const QuickAccessCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  gradient: string;
}> = ({ icon, label, description, onClick, gradient }) => (
  <button
    onClick={onClick}
    className={`${gradient} rounded-xl p-5 text-left text-white hover:opacity-90 transition-opacity shadow-lg group`}
  >
    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-lg">{label}</h3>
    <p className="text-white/80 text-sm mt-1">{description}</p>
  </button>
);

// 미니 프로젝트 카드
const MiniProjectCard: React.FC<{
  project: typeof sampleStudioProjects[0];
  onClick: () => void;
}> = ({ project, onClick }) => {
  const status = statusConfig[project.status];

  return (
    <button
      onClick={onClick}
      className="bg-light-surface rounded-xl border border-light-border p-4 text-left hover:shadow-md hover:border-brand-pink/30 transition-all w-full group"
    >
      <div className="flex items-start justify-between mb-3">
        {/* 상태 뱃지 */}
        <span className={`${status.lightBg} ${status.textColor} text-xs font-semibold px-2.5 py-1 rounded-full`}>
          {status.label}
        </span>
        {/* 진행률 */}
        <span className="text-xs font-bold text-brand-pink">{project.progress}%</span>
      </div>

      <h4 className="font-bold text-light-text-primary mb-1 truncate group-hover:text-brand-pink transition-colors">
        {project.title}
      </h4>
      <p className="text-xs text-light-text-secondary mb-3 line-clamp-1">{project.description}</p>

      {/* 진행률 바 */}
      <div className="relative h-1.5 bg-light-bg rounded-full overflow-hidden mb-3">
        <div
          className={`absolute left-0 top-0 h-full ${status.color} rounded-full transition-all`}
          style={{ width: `${project.progress}%` }}
        />
      </div>

      {/* 기여자 */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.contributors.slice(0, 3).map(c => (
            <LazyImage
              key={c.user.id}
              src={c.user.avatarUrl}
              alt={c.user.name}
              className="w-6 h-6 rounded-full border-2 border-light-surface"
            />
          ))}
          {project.contributors.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-light-bg border-2 border-light-surface flex items-center justify-center text-xs text-light-text-secondary">
              +{project.contributors.length - 3}
            </div>
          )}
        </div>
        <span className="text-xs text-light-text-secondary">
          {project.tasks.filter(t => t.status === 'completed').length}/{project.tasks.length} 완료
        </span>
      </div>
    </button>
  );
};

const BackstagePage: React.FC<BackstagePageProps> = ({ onNavigate }) => {
  // 최근 프로젝트 (진행 중인 것 우선)
  const recentProjects = [...sampleStudioProjects]
    .sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
    })
    .slice(0, 4);

  // 통계
  const stats = {
    total: sampleStudioProjects.length,
    inProgress: sampleStudioProjects.filter(p => p.status !== 'completed').length,
    completed: sampleStudioProjects.filter(p => p.status === 'completed').length,
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-light-text-primary">BackStage</h1>
        <p className="text-light-text-secondary text-sm mt-1">음악 제작 공간</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-light-surface rounded-xl border border-light-border p-4 text-center">
          <p className="text-2xl font-bold text-brand-pink">{stats.total}</p>
          <p className="text-xs text-light-text-secondary">전체 프로젝트</p>
        </div>
        <div className="bg-light-surface rounded-xl border border-light-border p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.inProgress}</p>
          <p className="text-xs text-light-text-secondary">진행 중</p>
        </div>
        <div className="bg-light-surface rounded-xl border border-light-border p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
          <p className="text-xs text-light-text-secondary">완료</p>
        </div>
      </div>

      {/* 빠른 액세스 */}
      <section>
        <h2 className="font-bold text-lg mb-3">빠른 액세스</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAccessCard
            icon={<LayoutDashboardIcon className="w-6 h-6" />}
            label="대시보드"
            description="전체 현황 보기"
            onClick={() => onNavigate('dashboard')}
            gradient="bg-gradient-to-br from-brand-pink to-brand-purple"
          />
          <QuickAccessCard
            icon={<FolderKanbanIcon className="w-6 h-6" />}
            label="프로젝트"
            description="프로젝트 관리"
            onClick={() => onNavigate('projects')}
            gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
          />
          <QuickAccessCard
            icon={<UsersIcon className="w-6 h-6" />}
            label="팀"
            description="협업 멤버 관리"
            onClick={() => onNavigate('teams')}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
        </div>
      </section>

      {/* 최근 프로젝트 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">최근 프로젝트</h2>
          <button
            onClick={() => onNavigate('projects')}
            className="text-sm text-brand-pink font-medium hover:underline"
          >
            전체 보기
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentProjects.map(project => (
            <MiniProjectCard
              key={project.id}
              project={project}
              onClick={() => onNavigate('projects')}
            />
          ))}
        </div>
      </section>

      {/* 최근 활동 */}
      <section>
        <h2 className="font-bold text-lg mb-3">최근 활동</h2>
        <div className="bg-light-surface rounded-xl border border-light-border divide-y divide-light-border">
          {[
            { action: '새 버전 업로드', project: 'Midnight City', time: '10분 전', icon: '📤' },
            { action: '댓글 추가', project: 'Rainy Day Lofi', time: '30분 전', icon: '💬' },
            { action: '믹싱 완료', project: 'Electric Dreams', time: '2시간 전', icon: '✅' },
            { action: '팀원 초대', project: 'Ocean Waves', time: '어제', icon: '👥' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center p-3 hover:bg-light-bg/50 transition-colors">
              <span className="text-xl mr-3">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.action}</span>
                  <span className="text-light-text-secondary"> - {activity.project}</span>
                </p>
              </div>
              <span className="text-xs text-light-text-secondary">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BackstagePage;
