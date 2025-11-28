import React, { useState } from 'react';
import { StudioProject, ProjectTemplate } from '../types';
import {
  XIcon,
  UsersIcon,
  GlobeIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MusicIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserPlusIcon,
  SparklesIcon,
  FileAudioIcon,
  LayersIcon,
  ClockIcon
} from './icons';
import { useNotifications } from '../hooks/useNotifications';
import LazyImage from './LazyImage';
import { users } from '../data';

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectData: Omit<StudioProject, 'id' | 'contributors' | 'lastUpdatedAt' | 'progress' | 'tasks' | 'files' | 'messages'>) => void;
}

type WizardStep = 1 | 2 | 3 | 4;

const genreOptions = [
  { id: 'kpop', label: 'K-Pop', icon: '🎤' },
  { id: 'hiphop', label: '힙합/랩', icon: '🎤' },
  { id: 'edm', label: 'EDM/일렉트로닉', icon: '🎧' },
  { id: 'rnb', label: 'R&B/소울', icon: '💜' },
  { id: 'rock', label: '록/밴드', icon: '🎸' },
  { id: 'ost', label: 'OST/시네마틱', icon: '🎬' },
  { id: 'lofi', label: '로파이/칠', icon: '☕' },
  { id: 'synthwave', label: '신스웨이브', icon: '🌆' },
  { id: 'ambient', label: '앰비언트', icon: '🌙' },
  { id: 'other', label: '기타', icon: '🎵' },
];

const templateOptions: { id: ProjectTemplate; label: string; description: string; steps: string[] }[] = [
  {
    id: 'kpop',
    label: 'K-Pop 트랙',
    description: '보컬 중심의 K-Pop 스타일 곡 제작',
    steps: ['콘셉트 기획', '작곡/탑라인', '편곡', '보컬 녹음', '믹싱', '마스터링', '발매 준비']
  },
  {
    id: 'hiphop',
    label: '힙합/비트',
    description: '비트메이킹과 랩 녹음 중심',
    steps: ['비트 제작', '샘플링', '랩 녹음', '믹싱', '마스터링']
  },
  {
    id: 'edm',
    label: 'EDM 트랙',
    description: '일렉트로닉 댄스 뮤직 제작',
    steps: ['사운드 디자인', '드롭 구성', '브레이크다운', '믹싱', '마스터링']
  },
  {
    id: 'ost',
    label: 'OST/스코어',
    description: '영화/게임 음악 제작',
    steps: ['스토리보드 분석', '테마 작곡', '오케스트레이션', '녹음', '믹싱', '마스터링']
  },
  {
    id: 'lofi',
    label: '로파이',
    description: '편안한 로파이 비트 제작',
    steps: ['샘플 선정', '비트 메이킹', '텍스처 추가', '믹싱']
  },
  {
    id: 'custom',
    label: '커스텀',
    description: '나만의 워크플로우 설정',
    steps: ['기획', '제작', '믹싱', '마스터링', '완료']
  },
];

const roleOptions = ['프로듀서', '작곡가', '편곡가', '보컬', '작사가', '믹싱 엔지니어', '마스터링 엔지니어', '기타'];
const keyOptions = ['C Major', 'C Minor', 'D Major', 'D Minor', 'E Major', 'E Minor', 'F Major', 'F Minor', 'G Major', 'G Minor', 'A Major', 'A Minor', 'B Major', 'B Minor'];

const StartProjectModal: React.FC<StartProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1: 기본 정보
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');

  // Step 2: 템플릿 & 상세
  const [template, setTemplate] = useState<ProjectTemplate>('custom');
  const [bpm, setBpm] = useState<number>(120);
  const [key, setKey] = useState('C Major');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  // Step 3: 팀 구성
  const [selectedMembers, setSelectedMembers] = useState<{ id: string; role: string }[]>([]);
  const [myRole, setMyRole] = useState('프로듀서');

  // Step 4: 일정 & 공개 설정
  const [isPublic, setIsPublic] = useState(false);
  const [deadline, setDeadline] = useState('');

  const { addNotification } = useNotifications();

  const resetState = () => {
    setStep(1);
    setTitle('');
    setDescription('');
    setGenre('');
    setTemplate('custom');
    setBpm(120);
    setKey('C Major');
    setTags([]);
    setCurrentTag('');
    setSelectedMembers([]);
    setMyRole('프로듀서');
    setIsPublic(false);
    setDeadline('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && currentTag) {
      e.preventDefault();
      if (tags.length < 5 && !tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleMember = (userId: string) => {
    if (selectedMembers.find(m => m.id === userId)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, { id: userId, role: '멤버' }]);
    }
  };

  const updateMemberRole = (userId: string, role: string) => {
    setSelectedMembers(selectedMembers.map(m => m.id === userId ? { ...m, role } : m));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return title.trim().length > 0 && genre.length > 0;
      case 2:
        return template !== undefined;
      case 3:
        return true; // 팀 구성은 선택사항
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4 && canProceed()) {
      setStep((step + 1) as WizardStep);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as WizardStep);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      addNotification({ type: 'error', message: '프로젝트 제목을 입력해주세요.' });
      return;
    }

    onCreate({
      title,
      description,
      genre,
      status: 'planning',
      tags,
      template,
      bpm,
      key,
      deadline: deadline || undefined,
      isPublic,
    });

    addNotification({ type: 'success', message: `"${title}" 프로젝트가 생성되었습니다!` });
    handleClose();
  };

  if (!isOpen) return null;

  const availableUsers = Object.values(users).filter(u => u.id !== 'user1');

  const stepTitles = [
    { num: 1, title: '기본 정보', icon: <MusicIcon className="w-4 h-4" /> },
    { num: 2, title: '템플릿 & 상세', icon: <LayersIcon className="w-4 h-4" /> },
    { num: 3, title: '팀 구성', icon: <UsersIcon className="w-4 h-4" /> },
    { num: 4, title: '일정 & 공개', icon: <CalendarIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-2xl w-full max-w-2xl border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="p-4 border-b border-light-border flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-pink to-brand-purple rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-light-text-primary">새 프로젝트</h2>
              <p className="text-sm text-light-text-secondary">단계 {step}/4</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-light-text-secondary rounded-full hover:bg-light-bg">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="px-6 py-4 border-b border-light-border">
          <div className="flex items-center justify-between">
            {stepTitles.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => s.num < step && setStep(s.num as WizardStep)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    step === s.num
                      ? 'bg-brand-pink/10 text-brand-pink'
                      : step > s.num
                      ? 'text-green-600 cursor-pointer hover:bg-green-50'
                      : 'text-light-text-muted cursor-default'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s.num
                      ? 'bg-brand-pink text-white'
                      : step > s.num
                      ? 'bg-green-500 text-white'
                      : 'bg-light-bg text-light-text-muted'
                  }`}>
                    {step > s.num ? <CheckCircleIcon className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{s.title}</span>
                </button>
                {idx < stepTitles.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > s.num ? 'bg-green-500' : 'bg-light-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: 기본 정보 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  프로젝트 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-light-bg border border-light-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  placeholder="예: 미드나잇 시티"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-light-bg border border-light-border rounded-xl p-3 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  placeholder="프로젝트에 대해 간략히 설명해주세요..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  장르 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {genreOptions.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGenre(g.id)}
                      className={`p-3 border rounded-xl text-center transition-all ${
                        genre === g.id
                          ? 'border-brand-pink bg-brand-pink/5 ring-2 ring-brand-pink/50'
                          : 'border-light-border hover:border-brand-pink/50'
                      }`}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <p className="text-xs font-medium mt-1">{g.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 템플릿 & 상세 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">워크플로우 템플릿</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templateOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        template === t.id
                          ? 'border-brand-purple bg-brand-purple/5 ring-2 ring-brand-purple/50'
                          : 'border-light-border hover:border-brand-purple/50'
                      }`}
                    >
                      <p className="font-semibold text-light-text-primary">{t.label}</p>
                      <p className="text-xs text-light-text-secondary mt-1">{t.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {t.steps.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-xs bg-light-bg px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                        {t.steps.length > 3 && (
                          <span className="text-xs text-light-text-muted">+{t.steps.length - 3}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">BPM</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="60"
                      max="200"
                      value={bpm}
                      onChange={(e) => setBpm(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-mono bg-light-bg px-2 py-1 rounded">{bpm}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">키</label>
                  <select
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full bg-light-bg border border-light-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  >
                    {keyOptions.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">태그 (최대 5개)</label>
                <div className="w-full bg-light-bg border border-light-border rounded-xl p-2 flex flex-wrap gap-2 items-center">
                  {tags.map(tag => (
                    <div key={tag} className="flex items-center bg-brand-purple/10 text-brand-purple text-sm font-medium px-2 py-1 rounded">
                      <span>{tag}</span>
                      <button onClick={() => removeTag(tag)} className="ml-1.5">
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 bg-transparent focus:outline-none p-1 min-w-[100px]"
                    placeholder="태그 추가..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 팀 구성 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">내 역할</label>
                <select
                  value={myRole}
                  onChange={(e) => setMyRole(e.target.value)}
                  className="w-full bg-light-bg border border-light-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">팀원 초대 (선택)</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableUsers.map((user) => {
                    const isSelected = selectedMembers.find(m => m.id === user.id);
                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                          isSelected
                            ? 'border-brand-pink bg-brand-pink/5'
                            : 'border-light-border hover:border-brand-pink/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <button onClick={() => toggleMember(user.id)}>
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                              isSelected ? 'border-brand-pink bg-brand-pink' : 'border-light-border'
                            }`}>
                              {isSelected && <CheckCircleIcon className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                          <LazyImage
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-light-text-primary">{user.name}</p>
                            <p className="text-xs text-light-text-secondary">{user.handle}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <select
                            value={isSelected.role}
                            onChange={(e) => updateMemberRole(user.id, e.target.value)}
                            className="text-sm bg-light-bg border border-light-border rounded-lg px-2 py-1"
                          >
                            {roleOptions.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-light-text-secondary mt-2">
                  선택된 팀원: {selectedMembers.length}명
                </p>
              </div>
            </div>
          )}

          {/* Step 4: 일정 & 공개 설정 */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">목표 마감일 (선택)</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-light-bg border border-light-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">공개 설정</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsPublic(false)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      !isPublic
                        ? 'border-brand-purple ring-2 ring-brand-purple/50 bg-brand-purple/5'
                        : 'border-light-border hover:bg-light-bg'
                    }`}
                  >
                    <UsersIcon className="w-8 h-8 mb-2 text-brand-purple" />
                    <p className="font-bold text-light-text-primary">비공개 프로젝트</p>
                    <p className="text-xs text-light-text-secondary mt-1">
                      초대된 팀원만 접근할 수 있습니다
                    </p>
                  </button>
                  <button
                    onClick={() => setIsPublic(true)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      isPublic
                        ? 'border-brand-pink ring-2 ring-brand-pink/50 bg-brand-pink/5'
                        : 'border-light-border hover:bg-light-bg'
                    }`}
                  >
                    <GlobeIcon className="w-8 h-8 mb-2 text-brand-pink" />
                    <p className="font-bold text-light-text-primary">공개 워크샵</p>
                    <p className="text-xs text-light-text-secondary mt-1">
                      누구나 참여하고 기여할 수 있습니다
                    </p>
                  </button>
                </div>
              </div>

              {/* 최종 확인 요약 */}
              <div className="bg-light-bg rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-light-text-primary">프로젝트 요약</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-light-text-muted">제목:</span>
                    <span className="ml-2 font-medium">{title || '-'}</span>
                  </div>
                  <div>
                    <span className="text-light-text-muted">장르:</span>
                    <span className="ml-2 font-medium">
                      {genreOptions.find(g => g.id === genre)?.label || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-light-text-muted">템플릿:</span>
                    <span className="ml-2 font-medium">
                      {templateOptions.find(t => t.id === template)?.label || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-light-text-muted">BPM/키:</span>
                    <span className="ml-2 font-medium">{bpm} / {key}</span>
                  </div>
                  <div>
                    <span className="text-light-text-muted">팀원:</span>
                    <span className="ml-2 font-medium">{selectedMembers.length + 1}명</span>
                  </div>
                  <div>
                    <span className="text-light-text-muted">공개:</span>
                    <span className="ml-2 font-medium">{isPublic ? '공개' : '비공개'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t border-light-border flex justify-between items-center">
          <button
            onClick={step === 1 ? handleClose : handlePrev}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-light-bg hover:bg-light-border border border-light-border transition-colors"
          >
            {step === 1 ? (
              <span>취소</span>
            ) : (
              <>
                <ChevronLeftIcon className="w-4 h-4" />
                <span>이전</span>
              </>
            )}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <span>다음</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>프로젝트 생성</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartProjectModal;
