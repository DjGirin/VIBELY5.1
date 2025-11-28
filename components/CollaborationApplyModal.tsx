import React, { useState } from 'react';
import { User } from '../types';
import { XIcon, CheckIcon, DollarSignIcon, FileTextIcon, ShieldIcon, StarIcon } from './icons';
import LazyImage from './LazyImage';

interface ProjectRole {
  name: string;
  filled: boolean;
  compensation: string;
}

interface CollaborationApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectOwner: User;
  roles: ProjectRole[];
  onSubmit: (data: ApplicationData) => void;
}

interface ApplicationData {
  selectedRole: string;
  portfolioLinks: string[];
  message: string;
  expectedCompensation: string;
  compensationType: 'fixed' | 'revenue_share' | 'negotiable';
  availableHours: number;
  agreedToTerms: boolean;
}

const CollaborationApplyModal: React.FC<CollaborationApplyModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  projectOwner,
  roles,
  onSubmit
}) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [message, setMessage] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>(['']);
  const [compensationType, setCompensationType] = useState<'fixed' | 'revenue_share' | 'negotiable'>('negotiable');
  const [expectedCompensation, setExpectedCompensation] = useState('');
  const [availableHours, setAvailableHours] = useState(20);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const availableRoles = roles.filter(r => !r.filled);

  const handleAddPortfolioLink = () => {
    setPortfolioLinks([...portfolioLinks, '']);
  };

  const handlePortfolioLinkChange = (index: number, value: string) => {
    const newLinks = [...portfolioLinks];
    newLinks[index] = value;
    setPortfolioLinks(newLinks);
  };

  const handleSubmit = () => {
    onSubmit({
      selectedRole,
      portfolioLinks: portfolioLinks.filter(l => l.trim()),
      message,
      expectedCompensation,
      compensationType,
      availableHours,
      agreedToTerms
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-light-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-border">
          <div>
            <h2 className="text-lg font-bold text-light-text-primary">협업 지원하기</h2>
            <p className="text-sm text-light-text-secondary">{projectTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-light-bg rounded-full">
            <XIcon className="w-5 h-5 text-light-text-secondary" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center px-6 py-3 bg-light-bg/50">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-brand-pink text-white' : 'bg-light-border text-light-text-secondary'
              }`}>
                {step > s ? <CheckIcon className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-brand-pink' : 'bg-light-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-light-text-primary">지원할 역할을 선택하세요</h3>
              <div className="space-y-2">
                {availableRoles.map((role, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRole(role.name)}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${
                      selectedRole === role.name
                        ? 'border-brand-pink bg-brand-pink/5'
                        : 'border-light-border hover:border-brand-pink/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-light-text-primary">{role.name}</span>
                      <span className="text-sm text-brand-pink">{role.compensation}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Project owner info */}
              <div className="mt-6 p-4 bg-light-bg rounded-lg">
                <p className="text-xs text-light-text-muted mb-2">프로젝트 리더</p>
                <div className="flex items-center space-x-3">
                  <LazyImage src={projectOwner.avatarUrl} alt={projectOwner.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-light-text-primary">{projectOwner.name}</p>
                    <div className="flex items-center text-sm">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-light-text-secondary">{projectOwner.collaborationRating || 0} ({projectOwner.completedCollabs || 0}건)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Application Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-light-text-primary">지원 정보를 입력하세요</h3>

              {/* Portfolio Links */}
              <div>
                <label className="block text-sm font-medium text-light-text-primary mb-2">
                  포트폴리오 링크
                </label>
                {portfolioLinks.map((link, idx) => (
                  <input
                    key={idx}
                    type="url"
                    value={link}
                    onChange={(e) => handlePortfolioLinkChange(idx, e.target.value)}
                    placeholder="https://soundcloud.com/your-profile"
                    className="w-full bg-light-bg border border-light-border rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  />
                ))}
                <button
                  onClick={handleAddPortfolioLink}
                  className="text-sm text-brand-pink hover:underline"
                >
                  + 링크 추가
                </button>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-light-text-primary mb-2">
                  지원 메시지
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="자신을 소개하고, 이 프로젝트에 관심을 갖게 된 이유를 적어주세요..."
                  rows={4}
                  className="w-full bg-light-bg border border-light-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-pink resize-none"
                />
              </div>

              {/* Available Hours */}
              <div>
                <label className="block text-sm font-medium text-light-text-primary mb-2">
                  주당 투입 가능 시간
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-20 text-center font-medium">{availableHours}시간</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Compensation & Terms */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-light-text-primary">보상 및 계약 조건</h3>

              {/* Compensation Type */}
              <div>
                <label className="block text-sm font-medium text-light-text-primary mb-2">
                  희망 보상 방식
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'fixed', label: '고정 금액', icon: DollarSignIcon },
                    { id: 'revenue_share', label: '수익 분배', icon: TrendingUpIcon },
                    { id: 'negotiable', label: '협의 가능', icon: FileTextIcon }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setCompensationType(type.id as any)}
                      className={`p-3 rounded-lg border text-center ${
                        compensationType === type.id
                          ? 'border-brand-pink bg-brand-pink/5'
                          : 'border-light-border hover:border-brand-pink/50'
                      }`}
                    >
                      <type.icon className="w-5 h-5 mx-auto mb-1 text-light-text-secondary" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expected Compensation */}
              {compensationType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-light-text-primary mb-2">
                    희망 금액
                  </label>
                  <input
                    type="text"
                    value={expectedCompensation}
                    onChange={(e) => setExpectedCompensation(e.target.value)}
                    placeholder="예: 500,000원"
                    className="w-full bg-light-bg border border-light-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  />
                </div>
              )}

              {compensationType === 'revenue_share' && (
                <div>
                  <label className="block text-sm font-medium text-light-text-primary mb-2">
                    희망 수익 분배율
                  </label>
                  <input
                    type="text"
                    value={expectedCompensation}
                    onChange={(e) => setExpectedCompensation(e.target.value)}
                    placeholder="예: 30%"
                    className="w-full bg-light-bg border border-light-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  />
                </div>
              )}

              {/* Terms Agreement */}
              <div className="p-4 bg-light-bg rounded-lg border border-light-border">
                <div className="flex items-start space-x-3">
                  <ShieldIcon className="w-6 h-6 text-brand-pink flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-light-text-primary mb-1">안전한 협업을 위한 안내</p>
                    <ul className="text-sm text-light-text-secondary space-y-1">
                      <li>• 프로젝트 시작 전 상세 계약서를 작성해야 합니다</li>
                      <li>• 수익 분배는 Vibely 에스크로 서비스를 통해 안전하게 처리됩니다</li>
                      <li>• 분쟁 발생 시 Vibely 중재 서비스를 이용할 수 있습니다</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-light-border text-brand-pink focus:ring-brand-pink"
                />
                <span className="text-sm text-light-text-secondary">
                  <span className="text-brand-pink hover:underline cursor-pointer">협업 이용약관</span> 및{' '}
                  <span className="text-brand-pink hover:underline cursor-pointer">수익 분배 정책</span>에 동의합니다
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-light-border">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2 text-light-text-secondary hover:text-light-text-primary"
          >
            {step > 1 ? '이전' : '취소'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !selectedRole}
              className="px-6 py-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white rounded-lg font-medium disabled:opacity-50"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!agreedToTerms}
              className="px-6 py-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white rounded-lg font-medium disabled:opacity-50"
            >
              지원하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// TrendingUpIcon if not exported
const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default CollaborationApplyModal;
