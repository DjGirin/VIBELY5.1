import React, { useState } from 'react';
import { StudioProject, StudioProjectMessage } from '../types';
import {
  ArrowLeftIcon,
  SettingsIcon,
  PlayIcon,
  PauseIcon,
  MessageCircleIcon,
  Share2Icon,
  PlusIcon,
  CheckIcon,
  ClockIcon,
  FileAudioIcon,
  UsersIcon,
  FolderKanbanIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  UploadCloudIcon,
  MicIcon
} from './icons';
import LazyImage from './LazyImage';
import ProjectChatRoom from './ProjectChatRoom';
import { users } from '../data';

interface StudioProjectDetailPageProps {
  project: StudioProject;
  onBack: () => void;
}

type TabId = 'overview' | 'files' | 'tasks' | 'team' | 'timeline' | 'chat';

const statusConfig = {
  planning: { label: '기획', color: 'bg-blue-500', textColor: 'text-blue-600' },
  recording: { label: '녹음', color: 'bg-red-500', textColor: 'text-red-600' },
  mixing: { label: '믹싱', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  mastering: { label: '마스터링', color: 'bg-purple-500', textColor: 'text-purple-600' },
  completed: { label: '완료', color: 'bg-green-500', textColor: 'text-green-600' },
};

// 파일 아이템 컴포넌트
const FileItem: React.FC<{
  file: StudioProject['files'][0];
  onPlay?: () => void;
  isPlaying?: boolean;
}> = ({ file, onPlay, isPlaying }) => {
  const isAudio = file.type === 'audio';

  return (
    <div className="flex items-center p-3 bg-light-bg rounded-lg hover:bg-light-border/30 transition-colors group">
      {isAudio ? (
        <button
          onClick={onPlay}
          className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-brand-pink group-hover:text-white transition-colors"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5 pl-0.5" />
          )}
        </button>
      ) : (
        <div className="w-10 h-10 bg-light-border rounded-full flex items-center justify-center mr-3">
          <FileAudioIcon className="w-5 h-5 text-light-text-secondary" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-light-text-primary truncate">{file.name}</p>
        <p className="text-xs text-light-text-secondary">
          {file.uploadedBy.name} · {file.uploadedAt}
        </p>
      </div>

      {/* 오디오 파형 (가상) */}
      {isAudio && (
        <div className="hidden md:flex items-center space-x-0.5 mx-4 h-8">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-brand-pink/30 rounded-full"
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center space-x-2 text-light-text-secondary">
        {file.comments > 0 && (
          <span className="flex items-center text-xs">
            <MessageCircleIcon className="w-4 h-4 mr-1" />
            {file.comments}
          </span>
        )}
        <span className="text-xs">{file.version}</span>
      </div>
    </div>
  );
};

// 태스크 아이템 컴포넌트
const TaskItem: React.FC<{
  task: StudioProject['tasks'][0];
  onToggle: () => void;
}> = ({ task, onToggle }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`flex items-start p-3 bg-light-bg rounded-lg ${task.status === 'completed' ? 'opacity-60' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 flex items-center justify-center transition-colors ${
          task.status === 'completed'
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-light-border hover:border-brand-pink'
        }`}
      >
        {task.status === 'completed' && <CheckIcon className="w-3 h-3" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-light-text-secondary' : 'text-light-text-primary'}`}>
          {task.title}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          {task.assignee && (
            <div className="flex items-center">
              <LazyImage
                src={task.assignee.avatarUrl}
                alt={task.assignee.name}
                className="w-5 h-5 rounded-full mr-1"
              />
              <span className="text-xs text-light-text-secondary">{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <span className="text-xs text-light-text-secondary flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {task.dueDate}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
          </span>
        </div>
      </div>
    </div>
  );
};

// 팀 멤버 카드
const TeamMemberCard: React.FC<{
  contributor: StudioProject['contributors'][0];
}> = ({ contributor }) => {
  const roleColors: Record<string, string> = {
    Producer: 'bg-purple-100 text-purple-700',
    'Mixing Engineer': 'bg-yellow-100 text-yellow-700',
    'Mastering Engineer': 'bg-blue-100 text-blue-700',
    Vocalist: 'bg-pink-100 text-pink-700',
    Composer: 'bg-green-100 text-green-700',
  };

  return (
    <div className="flex items-center p-4 bg-light-bg rounded-xl">
      <LazyImage
        src={contributor.user.avatarUrl}
        alt={contributor.user.name}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-1">
        <p className="font-semibold text-light-text-primary">{contributor.user.name}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[contributor.role] || 'bg-light-border text-light-text-secondary'}`}>
          {contributor.role}
        </span>
      </div>
      <button className="p-2 hover:bg-light-surface rounded-full">
        <MessageCircleIcon className="w-5 h-5 text-light-text-secondary" />
      </button>
    </div>
  );
};

// 타임라인 아이템
const TimelineItem: React.FC<{
  title: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
}> = ({ title, date, isCompleted, isCurrent }) => (
  <div className="flex items-start">
    <div className="flex flex-col items-center mr-4">
      <div className={`w-4 h-4 rounded-full ${
        isCompleted ? 'bg-green-500' : isCurrent ? 'bg-brand-pink' : 'bg-light-border'
      }`} />
      <div className="w-0.5 h-16 bg-light-border" />
    </div>
    <div className={`pb-8 ${!isCompleted && !isCurrent ? 'opacity-50' : ''}`}>
      <p className={`font-medium ${isCurrent ? 'text-brand-pink' : 'text-light-text-primary'}`}>
        {title}
      </p>
      <p className="text-sm text-light-text-secondary">{date}</p>
    </div>
  </div>
);

const StudioProjectDetailPage: React.FC<StudioProjectDetailPageProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [playingFileId, setPlayingFileId] = useState<string | null>(null);
  const [projectMessages, setProjectMessages] = useState<StudioProjectMessage[]>(project.messages);
  const status = statusConfig[project.status];
  const currentUser = users['user1'];

  const handleSendMessage = (text: string) => {
    const newMessage: StudioProjectMessage = {
      id: `msg${Date.now()}`,
      user: currentUser,
      text,
      createdAt: new Date().toISOString(),
    };
    setProjectMessages(prev => [...prev, newMessage]);
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: '개요', icon: <FolderKanbanIcon className="w-4 h-4" /> },
    { id: 'files', label: '파일', icon: <FileAudioIcon className="w-4 h-4" /> },
    { id: 'tasks', label: '태스크', icon: <CheckIcon className="w-4 h-4" /> },
    { id: 'team', label: '팀', icon: <UsersIcon className="w-4 h-4" /> },
    { id: 'chat', label: '채팅', icon: <MessageCircleIcon className="w-4 h-4" />, badge: projectMessages.length },
    { id: 'timeline', label: '타임라인', icon: <CalendarIcon className="w-4 h-4" /> },
  ];

  const completedTasks = project.tasks.filter(t => t.status === 'completed').length;

  return (
    <main className="flex-1 bg-light-bg min-h-screen">
      {/* 헤더 */}
      <div className="bg-light-surface border-b border-light-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 hover:bg-light-bg rounded-full -ml-2">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-light-bg rounded-full">
                <Share2Icon className="w-5 h-5 text-light-text-secondary" />
              </button>
              <button className="p-2 hover:bg-light-bg rounded-full">
                <SettingsIcon className="w-5 h-5 text-light-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-b from-light-surface to-light-bg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* 커버 이미지 */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
              <LazyImage
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 프로젝트 정보 */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} text-white`}>
                  {status.label}
                </span>
                {project.isPublic && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-light-bg text-light-text-secondary">
                    공개
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-light-text-primary mb-2">
                {project.title}
              </h1>
              <p className="text-light-text-secondary mb-4">{project.description}</p>

              {/* 메타 정보 */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-light-bg rounded-full">{project.genre}</span>
                <span className="text-light-text-secondary">{project.bpm} BPM</span>
                <span className="text-light-text-secondary">Key: {project.key}</span>
                <span className="text-light-text-secondary flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {project.lastUpdatedAt}
                </span>
              </div>

              {/* 진행률 */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-light-text-secondary">진행률</span>
                  <span className="font-bold text-brand-pink">{project.progress}%</span>
                </div>
                <div className="h-2 bg-light-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-pink to-brand-purple rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-light-surface border-b border-light-border sticky top-[57px] z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-pink text-brand-pink'
                    : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-brand-pink/10 text-brand-pink rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 최근 파일 */}
            <div className="bg-light-surface rounded-xl border border-light-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-light-text-primary">최근 파일</h3>
                <button className="text-sm text-brand-pink">전체 보기</button>
              </div>
              <div className="space-y-2">
                {project.files.slice(0, 3).map(file => (
                  <FileItem
                    key={file.id}
                    file={file}
                    onPlay={() => setPlayingFileId(playingFileId === file.id ? null : file.id)}
                    isPlaying={playingFileId === file.id}
                  />
                ))}
              </div>
            </div>

            {/* 진행 중인 태스크 */}
            <div className="bg-light-surface rounded-xl border border-light-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-light-text-primary">태스크</h3>
                <span className="text-sm text-light-text-secondary">
                  {completedTasks}/{project.tasks.length} 완료
                </span>
              </div>
              <div className="space-y-2">
                {project.tasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => {}} />
                ))}
              </div>
            </div>

            {/* 팀 */}
            <div className="bg-light-surface rounded-xl border border-light-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-light-text-primary">팀 멤버</h3>
                <button className="text-sm text-brand-pink">초대하기</button>
              </div>
              <div className="flex -space-x-2">
                {project.contributors.map(c => (
                  <LazyImage
                    key={c.user.id}
                    src={c.user.avatarUrl}
                    alt={c.user.name}
                    className="w-10 h-10 rounded-full border-2 border-light-surface"
                  />
                ))}
                <button className="w-10 h-10 rounded-full bg-light-bg border-2 border-light-surface flex items-center justify-center">
                  <PlusIcon className="w-5 h-5 text-light-text-secondary" />
                </button>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-light-surface rounded-xl border border-light-border p-4">
              <h3 className="font-bold text-light-text-primary mb-4">최근 활동</h3>
              <div className="space-y-3">
                {project.messages.slice(0, 3).map(msg => (
                  <div key={msg.id} className="flex items-start space-x-3">
                    <LazyImage
                      src={msg.sender.avatarUrl}
                      alt={msg.sender.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{msg.sender.name}</span>
                        <span className="text-light-text-secondary"> 님이 댓글을 남겼습니다</span>
                      </p>
                      <p className="text-xs text-light-text-muted">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 파일 탭 */}
        {activeTab === 'files' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-light-text-primary">모든 파일</h3>
              <button className="flex items-center space-x-2 bg-brand-pink text-white px-4 py-2 rounded-lg">
                <UploadCloudIcon className="w-5 h-5" />
                <span>업로드</span>
              </button>
            </div>
            <div className="space-y-2">
              {project.files.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                  onPlay={() => setPlayingFileId(playingFileId === file.id ? null : file.id)}
                  isPlaying={playingFileId === file.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* 태스크 탭 */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-light-text-primary">모든 태스크</h3>
              <button className="flex items-center space-x-2 bg-brand-pink text-white px-4 py-2 rounded-lg">
                <PlusIcon className="w-5 h-5" />
                <span>추가</span>
              </button>
            </div>
            <div className="space-y-2">
              {project.tasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={() => {}} />
              ))}
            </div>
          </div>
        )}

        {/* 팀 탭 */}
        {activeTab === 'team' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-light-text-primary">팀 멤버</h3>
              <button className="flex items-center space-x-2 bg-brand-pink text-white px-4 py-2 rounded-lg">
                <PlusIcon className="w-5 h-5" />
                <span>초대</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.contributors.map(contributor => (
                <TeamMemberCard key={contributor.user.id} contributor={contributor} />
              ))}
            </div>
          </div>
        )}

        {/* 타임라인 탭 */}
        {activeTab === 'timeline' && (
          <div>
            <h3 className="font-bold text-light-text-primary mb-4">프로젝트 타임라인</h3>
            <div className="bg-light-surface rounded-xl border border-light-border p-6">
              <TimelineItem title="기획 완료" date="2025-11-01" isCompleted={true} isCurrent={false} />
              <TimelineItem title="녹음 진행" date="2025-11-10" isCompleted={project.status !== 'planning'} isCurrent={project.status === 'recording'} />
              <TimelineItem title="믹싱" date="2025-11-20" isCompleted={['mastering', 'completed'].includes(project.status)} isCurrent={project.status === 'mixing'} />
              <TimelineItem title="마스터링" date="2025-11-25" isCompleted={project.status === 'completed'} isCurrent={project.status === 'mastering'} />
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-4 h-4 rounded-full ${project.status === 'completed' ? 'bg-green-500' : 'bg-light-border'}`} />
                </div>
                <div className={project.status !== 'completed' ? 'opacity-50' : ''}>
                  <p className="font-medium text-light-text-primary">발매</p>
                  <p className="text-sm text-light-text-secondary">2025-11-30</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 채팅 탭 */}
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-400px)] min-h-[400px]">
            <ProjectChatRoom
              messages={projectMessages}
              currentUser={currentUser}
              contributors={project.contributors}
              onSendMessage={handleSendMessage}
              projectTitle={project.title}
            />
          </div>
        )}
      </div>

      {/* 하단 액션 바 (모바일) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-light-surface border-t border-light-border p-3">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center text-brand-pink">
            <PlayIcon className="w-6 h-6" />
            <span className="text-xs mt-1">재생</span>
          </button>
          <button className="flex flex-col items-center text-light-text-secondary">
            <MessageCircleIcon className="w-6 h-6" />
            <span className="text-xs mt-1">피드백</span>
          </button>
          <button className="flex flex-col items-center text-light-text-secondary">
            <MicIcon className="w-6 h-6" />
            <span className="text-xs mt-1">녹음</span>
          </button>
          <button className="flex flex-col items-center text-light-text-secondary">
            <Share2Icon className="w-6 h-6" />
            <span className="text-xs mt-1">공유</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default StudioProjectDetailPage;
