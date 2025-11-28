import React from 'react';
import { Project, ProjectStatus } from '../types';
import LazyImage from './LazyImage';
import { MoreHorizontalIcon, CheckIcon, CalendarIcon, UsersIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const statusStyles: Record<ProjectStatus, { bg: string; text: string; label: string; progressColor: string }> = {
  planning: { bg: 'bg-blue-100', text: 'text-blue-700', label: '기획', progressColor: 'bg-blue-500' },
  recording: { bg: 'bg-red-100', text: 'text-red-700', label: '녹음', progressColor: 'bg-red-500' },
  mixing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '믹싱', progressColor: 'bg-yellow-500' },
  mastering: { bg: 'bg-purple-100', text: 'text-purple-700', label: '마스터링', progressColor: 'bg-purple-500' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: '완료', progressColor: 'bg-green-500' },
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { title, status, description, tags, contributors, lastUpdatedAt, progress } = project;
  const statusStyle = statusStyles[status];

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return '방금 전';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}일 전`;
    return `${Math.floor(seconds / 2592000)}개월 전`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-light-surface rounded-xl border border-light-border overflow-hidden transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 hover:border-brand-pink/30 group"
    >
      {/* 상단 상태 바 */}
      <div className={`h-1.5 ${statusStyle.progressColor}`} style={{ width: '100%' }} />

      <div className="p-5">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {/* 상태 뱃지 */}
            <span className={`${statusStyle.bg} ${statusStyle.text} text-xs font-bold px-2.5 py-1 rounded-full`}>
              {statusStyle.label}
            </span>
            {status === 'completed' && (
              <CheckIcon className="w-4 h-4 text-green-500" />
            )}
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-light-text-secondary hover:bg-light-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontalIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 제목 & 설명 */}
        <h3 className="text-lg font-bold text-light-text-primary mb-1 group-hover:text-brand-pink transition-colors truncate">
          {title}
        </h3>
        <p className="text-sm text-light-text-secondary mb-3 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="bg-light-bg px-2 py-0.5 text-xs rounded-full text-light-text-secondary hover:bg-brand-pink/10 hover:text-brand-pink transition-colors"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-light-text-secondary">+{tags.length - 3}</span>
          )}
        </div>

        {/* 진행률 */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-light-text-secondary">진행률</span>
            <span className={`font-bold ${progress === 100 ? 'text-green-600' : 'text-brand-pink'}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-light-bg rounded-full h-2 overflow-hidden">
            <div
              className={`${statusStyle.progressColor} h-full rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between pt-3 border-t border-light-border">
          {/* 기여자 */}
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
              {contributors.slice(0, 3).map(c => (
                <LazyImage
                  key={c.user.id}
                  src={c.user.avatarUrl}
                  alt={c.user.name}
                  className="w-7 h-7 rounded-full border-2 border-light-surface"
                  title={`${c.user.name} (${c.role})`}
                />
              ))}
              {contributors.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-light-bg border-2 border-light-surface flex items-center justify-center text-xs font-medium text-light-text-secondary">
                  +{contributors.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-light-text-secondary hidden sm:inline">
              {contributors.length}명 참여
            </span>
          </div>

          {/* 업데이트 시간 */}
          <div className="flex items-center text-xs text-light-text-muted">
            <CalendarIcon className="w-3.5 h-3.5 mr-1" />
            <span>{timeAgo(lastUpdatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
