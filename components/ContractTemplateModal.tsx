import React, { useState } from 'react';
import { XIcon, FileTextIcon, ShieldIcon, CheckIcon, DownloadIcon, PlusIcon } from './icons';

interface ContractClause {
  id: string;
  title: string;
  content: string;
  isRequired: boolean;
  isEnabled: boolean;
}

interface ContractTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  onGenerate: (contract: GeneratedContract) => void;
}

interface GeneratedContract {
  clauses: ContractClause[];
  revenueShares: { role: string; percentage: number }[];
  milestones: { title: string; deadline: string; payment: string }[];
  disputeResolution: string;
}

const defaultClauses: ContractClause[] = [
  {
    id: 'scope',
    title: '업무 범위',
    content: '본 계약에 따른 업무 범위는 프로젝트 설명에 명시된 내용을 따르며, 추가 업무 발생 시 양 당사자 합의 하에 별도 협의합니다.',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'deadline',
    title: '작업 기한',
    content: '모든 산출물은 합의된 마일스톤 일정에 따라 제출되어야 하며, 지연 시 사전 통보가 필요합니다.',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'payment',
    title: '보상 및 지급',
    content: '보상은 각 마일스톤 완료 후 검수를 거쳐 7일 이내에 지급됩니다. Vibely 에스크로 서비스를 통해 안전하게 처리됩니다.',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'copyright',
    title: '저작권 및 크레딧',
    content: '완성된 작품에 대한 저작권은 명시된 분배율에 따라 공동 소유하며, 모든 공개 플랫폼에서 크레딧이 표시됩니다.',
    isRequired: true,
    isEnabled: true
  },
  {
    id: 'revision',
    title: '수정 요청',
    content: '각 마일스톤당 최대 2회의 수정 요청이 포함되며, 추가 수정은 별도 협의가 필요합니다.',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'confidentiality',
    title: '기밀 유지',
    content: '프로젝트 관련 정보는 양 당사자 동의 없이 외부에 공개할 수 없습니다.',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'termination',
    title: '계약 해지',
    content: '정당한 사유 없이 일방적으로 계약을 해지할 경우, 해지 당사자는 상대방에게 이미 완료된 작업에 대한 보상을 지급해야 합니다.',
    isRequired: false,
    isEnabled: true
  },
  {
    id: 'dispute',
    title: '분쟁 해결',
    content: '분쟁 발생 시 Vibely 중재 서비스를 우선 이용하며, 해결되지 않을 경우 관할 법원에서 해결합니다.',
    isRequired: true,
    isEnabled: true
  }
];

const ContractTemplateModal: React.FC<ContractTemplateModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  onGenerate
}) => {
  const [clauses, setClauses] = useState<ContractClause[]>(defaultClauses);
  const [revenueShares, setRevenueShares] = useState([
    { role: '프로젝트 리더', percentage: 40 },
    { role: '작곡가', percentage: 30 },
    { role: '마스터링 엔지니어', percentage: 30 }
  ]);
  const [milestones, setMilestones] = useState([
    { title: '기획 및 콘셉트 확정', deadline: '', payment: '20%' },
    { title: '초안 제출', deadline: '', payment: '30%' },
    { title: '최종 검수 및 완료', deadline: '', payment: '50%' }
  ]);

  const toggleClause = (id: string) => {
    setClauses(clauses.map(c =>
      c.id === id && !c.isRequired ? { ...c, isEnabled: !c.isEnabled } : c
    ));
  };

  const updateRevenueShare = (index: number, percentage: number) => {
    const newShares = [...revenueShares];
    newShares[index].percentage = percentage;
    setRevenueShares(newShares);
  };

  const addRevenueShare = () => {
    setRevenueShares([...revenueShares, { role: '새 역할', percentage: 0 }]);
  };

  const totalPercentage = revenueShares.reduce((sum, s) => sum + s.percentage, 0);

  const handleGenerate = () => {
    onGenerate({
      clauses: clauses.filter(c => c.isEnabled),
      revenueShares,
      milestones,
      disputeResolution: 'Vibely 중재 서비스'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-light-surface rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center">
              <FileTextIcon className="w-5 h-5 text-brand-pink" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-light-text-primary">협업 계약서 생성</h2>
              <p className="text-sm text-light-text-secondary">{projectTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-light-bg rounded-full">
            <XIcon className="w-5 h-5 text-light-text-secondary" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Clauses Section */}
          <div>
            <h3 className="font-bold text-light-text-primary mb-3 flex items-center">
              <ShieldIcon className="w-5 h-5 mr-2 text-brand-pink" />
              계약 조항
            </h3>
            <div className="space-y-2">
              {clauses.map(clause => (
                <div
                  key={clause.id}
                  className={`p-4 rounded-lg border ${
                    clause.isEnabled ? 'border-brand-pink/30 bg-brand-pink/5' : 'border-light-border bg-light-bg'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-light-text-primary">{clause.title}</h4>
                        {clause.isRequired && (
                          <span className="text-xs bg-brand-pink/10 text-brand-pink px-2 py-0.5 rounded">필수</span>
                        )}
                      </div>
                      <p className="text-sm text-light-text-secondary mt-1">{clause.content}</p>
                    </div>
                    {!clause.isRequired && (
                      <button
                        onClick={() => toggleClause(clause.id)}
                        className={`ml-3 w-10 h-6 rounded-full transition-colors ${
                          clause.isEnabled ? 'bg-brand-pink' : 'bg-light-border'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                          clause.isEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Share Section */}
          <div>
            <h3 className="font-bold text-light-text-primary mb-3 flex items-center">
              <DollarSignIcon className="w-5 h-5 mr-2 text-brand-pink" />
              수익 분배율
              <span className={`ml-auto text-sm font-normal ${
                totalPercentage === 100 ? 'text-green-500' : 'text-red-500'
              }`}>
                총 {totalPercentage}%
              </span>
            </h3>
            <div className="space-y-3">
              {revenueShares.map((share, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-3 bg-light-bg rounded-lg">
                  <input
                    type="text"
                    value={share.role}
                    onChange={(e) => {
                      const newShares = [...revenueShares];
                      newShares[idx].role = e.target.value;
                      setRevenueShares(newShares);
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none font-medium"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={share.percentage}
                      onChange={(e) => updateRevenueShare(idx, Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="w-12 text-right font-bold text-brand-pink">{share.percentage}%</span>
                  </div>
                </div>
              ))}
              <button
                onClick={addRevenueShare}
                className="w-full p-3 border border-dashed border-light-border rounded-lg text-light-text-secondary hover:border-brand-pink hover:text-brand-pink flex items-center justify-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                역할 추가
              </button>
            </div>
            {totalPercentage !== 100 && (
              <p className="text-sm text-red-500 mt-2">수익 분배율의 합이 100%가 되어야 합니다.</p>
            )}
          </div>

          {/* Milestones Section */}
          <div>
            <h3 className="font-bold text-light-text-primary mb-3 flex items-center">
              <CheckIcon className="w-5 h-5 mr-2 text-brand-pink" />
              마일스톤 & 지급 일정
            </h3>
            <div className="space-y-3">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-3 bg-light-bg rounded-lg">
                  <span className="w-6 h-6 bg-brand-pink/10 text-brand-pink rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => {
                      const newMilestones = [...milestones];
                      newMilestones[idx].title = e.target.value;
                      setMilestones(newMilestones);
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none"
                  />
                  <input
                    type="date"
                    value={milestone.deadline}
                    onChange={(e) => {
                      const newMilestones = [...milestones];
                      newMilestones[idx].deadline = e.target.value;
                      setMilestones(newMilestones);
                    }}
                    className="bg-light-surface border border-light-border rounded px-2 py-1 text-sm"
                  />
                  <span className="text-brand-pink font-medium w-12 text-right">{milestone.payment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-700">
              <strong>안내:</strong> 이 계약서 템플릿은 협업 내용을 명확히 하기 위한 참고용입니다.
              법적 효력이 필요한 경우 전문 법률 자문을 받으시기 바랍니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-light-border">
          <button onClick={onClose} className="px-6 py-2 text-light-text-secondary hover:text-light-text-primary">
            취소
          </button>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-light-border rounded-lg flex items-center hover:bg-light-bg">
              <DownloadIcon className="w-4 h-4 mr-2" />
              PDF 다운로드
            </button>
            <button
              onClick={handleGenerate}
              disabled={totalPercentage !== 100}
              className="px-6 py-2 bg-gradient-to-r from-brand-pink to-brand-purple text-white rounded-lg font-medium disabled:opacity-50"
            >
              계약서 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// DollarSignIcon local if not exported
const DollarSignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

export default ContractTemplateModal;
