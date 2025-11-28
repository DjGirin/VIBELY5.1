import React, { useState } from 'react';
import { StudioProject } from '../types';
import { PlusIcon, MoreHorizontalIcon, GripVerticalIcon } from './icons';
import LazyImage from './LazyImage';

interface KanbanBoardViewProps {
  projects: StudioProject[];
  onProjectClick: (project: StudioProject) => void;
  onStatusChange?: (projectId: string, newStatus: StudioProject['status']) => void;
}

type ProjectStatus = StudioProject['status'];

const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  planning: { label: '기획', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  recording: { label: '녹음', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  mixing: { label: '믹싱', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  mastering: { label: '마스터링', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  completed: { label: '완료', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
};

const statusOrder: ProjectStatus[] = ['planning', 'recording', 'mixing', 'mastering', 'completed'];

// 칸반 카드 컴포넌트
const KanbanCard: React.FC<{
  project: StudioProject;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
}> = ({ project, onClick, onDragStart }) => {
  const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = project.tasks.length;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-white rounded-lg border border-light-border p-3 shadow-sm hover:shadow-md hover:border-brand-pink/30 transition-all cursor-pointer group"
    >
      {/* 드래그 핸들 */}
      <div className="flex items-start justify-between mb-2">
        <GripVerticalIcon className="w-4 h-4 text-light-text-muted opacity-0 group-hover:opacity-100 cursor-grab" />
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="p-1 hover:bg-light-bg rounded opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontalIcon className="w-4 h-4 text-light-text-secondary" />
        </button>
      </div>

      {/* 커버 이미지 */}
      {project.coverImage && (
        <div className="relative h-24 rounded-md overflow-hidden mb-3">
          <LazyImage
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* 제목 & 설명 */}
      <h4 className="font-semibold text-light-text-primary text-sm mb-1 line-clamp-1 group-hover:text-brand-pink transition-colors">
        {project.title}
      </h4>
      <p className="text-xs text-light-text-secondary line-clamp-2 mb-3">
        {project.description}
      </p>

      {/* 메타 정보 */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-light-bg rounded text-light-text-secondary">
            {project.genre}
          </span>
          <span className="text-light-text-muted">{project.bpm} BPM</span>
        </div>
      </div>

      {/* 진행률 */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-light-text-secondary">진행률</span>
          <span className="font-medium text-brand-pink">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-light-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-pink to-brand-purple rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* 태스크 & 기여자 */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-light-border">
        <div className="flex -space-x-2">
          {project.contributors.slice(0, 3).map(c => (
            <LazyImage
              key={c.user.id}
              src={c.user.avatarUrl}
              alt={c.user.name}
              className="w-6 h-6 rounded-full border-2 border-white"
            />
          ))}
          {project.contributors.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-light-bg border-2 border-white flex items-center justify-center text-xs text-light-text-secondary">
              +{project.contributors.length - 3}
            </div>
          )}
        </div>
        {totalTasks > 0 && (
          <span className="text-xs text-light-text-secondary">
            {completedTasks}/{totalTasks} 완료
          </span>
        )}
      </div>
    </div>
  );
};

// 칸반 컬럼 컴포넌트
const KanbanColumn: React.FC<{
  status: ProjectStatus;
  projects: StudioProject[];
  onProjectClick: (project: StudioProject) => void;
  onDrop: (projectId: string, newStatus: ProjectStatus) => void;
  draggedProjectId: string | null;
}> = ({ status, projects, onProjectClick, onDrop, draggedProjectId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = statusConfig[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const projectId = e.dataTransfer.getData('projectId');
    if (projectId) {
      onDrop(projectId, status);
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-72 md:w-80 flex flex-col rounded-xl ${config.bgColor} ${config.borderColor} border transition-all ${
        isDragOver ? 'ring-2 ring-brand-pink ring-offset-2' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 컬럼 헤더 */}
      <div className="p-3 flex items-center justify-between border-b border-light-border/50">
        <div className="flex items-center space-x-2">
          <span className={`font-bold ${config.color}`}>{config.label}</span>
          <span className="text-xs bg-white px-2 py-0.5 rounded-full text-light-text-secondary font-medium">
            {projects.length}
          </span>
        </div>
        <button className="p-1 hover:bg-white/50 rounded transition-colors">
          <PlusIcon className="w-4 h-4 text-light-text-secondary" />
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        {projects.map(project => (
          <KanbanCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project)}
            onDragStart={(e) => {
              e.dataTransfer.setData('projectId', project.id);
            }}
          />
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-light-text-muted text-sm">
            프로젝트 없음
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  projects,
  onProjectClick,
  onStatusChange
}) => {
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [localProjects, setLocalProjects] = useState(projects);

  const handleDrop = (projectId: string, newStatus: ProjectStatus) => {
    setLocalProjects(prev =>
      prev.map(p =>
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    );
    onStatusChange?.(projectId, newStatus);
    setDraggedProjectId(null);
  };

  const getProjectsByStatus = (status: ProjectStatus) =>
    localProjects.filter(p => p.status === status);

  return (
    <div className="w-full">
      {/* 뷰 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-light-text-primary">칸반 보드</h2>
        <p className="text-sm text-light-text-secondary">
          카드를 드래그하여 상태를 변경하세요
        </p>
      </div>

      {/* 칸반 보드 */}
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {statusOrder.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            projects={getProjectsByStatus(status)}
            onProjectClick={onProjectClick}
            onDrop={handleDrop}
            draggedProjectId={draggedProjectId}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoardView;
