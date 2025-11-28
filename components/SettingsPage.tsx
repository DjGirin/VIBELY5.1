import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { 
    UserIcon, LockIcon, CreditCardIcon, DollarSignIcon, BellIcon, ShieldIcon, HelpCircleIcon, LogOutIcon, ArrowLeftIcon, CameraIcon 
} from './icons';

type SettingsTab = 'profile' | 'security' | 'subscription' | 'monetization' | 'notifications' | 'privacy' | 'support';

const SettingsCard: React.FC<{ title: string, children: React.ReactNode, actions?: React.ReactNode }> = ({ title, children, actions }) => (
    <div className="bg-light-surface rounded-xl border border-light-border">
        <div className="p-6 border-b border-light-border flex justify-between items-center">
            <h3 className="text-xl font-bold text-light-text-primary">{title}</h3>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

const InputField: React.FC<{ label: string, id: string, type?: string, value: string, placeholder?: string, disabled?: boolean }> = ({ label, id, type = "text", value, placeholder, disabled=false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-light-text-secondary mb-2">{label}</label>
        <input 
            type={type} 
            id={id}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-light-bg border border-light-border rounded-lg h-11 px-4 focus:outline-none focus:ring-2 focus:ring-brand-pink disabled:opacity-50" 
        />
    </div>
);

const Toggle: React.FC<{ label: string, description: string, enabled: boolean, onToggle: () => void }> = ({ label, description, enabled, onToggle }) => (
    <div className="flex justify-between items-center">
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-light-text-secondary">{description}</p>
        </div>
        <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-brand-pink' : 'bg-gray-200'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const ProfileSection = () => (
    <SettingsCard title="프로필 관리" actions={<button className="text-sm bg-light-bg px-4 py-2 rounded-lg hover:bg-brand-pink hover:text-white border border-light-border">변경사항 저장</button>}>
        <div className="flex items-center space-x-6">
            <div className="relative">
                <img src="https://picsum.photos/seed/currentuser/96/96" alt="Profile" className="w-24 h-24 rounded-full" />
                <button className="absolute bottom-0 right-0 bg-brand-pink p-2 rounded-full text-white hover:bg-brand-pink-accent">
                    <CameraIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1">
                <h4 className="text-lg font-bold">SynthWaveKid</h4>
                <p className="text-light-text-secondary">가입일: 2023년 10월 26일</p>
                <div className="flex space-x-4 mt-2 text-sm">
                    <span><span className="font-bold">12</span> Tracks</span>
                    <span><span className="font-bold">5.8K</span> Votes</span>
                    <span><span className="font-bold">1.2K</span> Followers</span>
                    <span><span className="font-bold">89</span> Following</span>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="사용자명" id="username" value="SynthWaveKid" disabled />
            <InputField label="표시 이름" id="displayName" value="SynthWaveKid" />
            <InputField label="이메일 주소" id="email" value="synthwave@vibely.ai" />
            <InputField label="전화번호" id="phone" value="010-1234-5678" />
        </div>
         <div>
            <label htmlFor="bio" className="block text-sm font-medium text-light-text-secondary mb-2">자기소개</label>
            <textarea id="bio" rows={3} className="w-full bg-light-bg border border-light-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-brand-pink">80s synthwave enthusiast. Creating nostalgic vibes with AI.</textarea>
        </div>
    </SettingsCard>
);

const SecuritySection = () => {
    const [password, setPassword] = useState("");
    const passwordStrength = Math.min(Math.floor(password.length / 3), 4);
    const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'];
    const strengthLabels = ['매우 약함', '약함', '보통', '강함', '매우 강함'];

    return(
    <div className="space-y-8">
        <SettingsCard title="비밀번호 변경">
            <InputField label="현재 비밀번호" id="current-password" type="password" value="***********" />
            <div>
                 <InputField label="새 비밀번호" id="new-password" type="password" value={password} placeholder="새 비밀번호 입력" />
                <div className="flex items-center space-x-2 mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${strengthColors[passwordStrength]}`} style={{ width: `${passwordStrength * 25}%` }}></div>
                    </div>
                    <span className="text-xs text-light-text-secondary w-20 text-right">{strengthLabels[passwordStrength]}</span>
                </div>
            </div>

            <InputField label="비밀번호 확인" id="confirm-password" type="password" value="" placeholder="새 비밀번호 다시 입력" />
            <div className="text-right">
                <button className="text-sm bg-brand-pink text-white px-4 py-2 rounded-lg hover:bg-brand-pink-accent">비밀번호 변경</button>
            </div>
        </SettingsCard>
        <SettingsCard title="2단계 인증">
            <p className="text-light-text-secondary text-sm">계정에 보호막을 추가하여 보안을 강화하세요.</p>
            <Toggle label="SMS 인증" description="등록된 번호로 인증 코드를 받습니다." enabled={true} onToggle={() => {}}/>
            <Toggle label="앱 기반 인증" description="Google Authenticator 등 인증 앱을 사용합니다." enabled={false} onToggle={() => {}}/>
        </SettingsCard>
        <SettingsCard title="로그인 기록">
            <ul>
                <li className="flex justify-between items-center py-2 border-b border-light-border text-sm">
                    <div>
                        <p>Chrome on Windows <span className="text-green-500 ml-2">● 현재 세션</span></p>
                        <p className="text-light-text-secondary">Seoul, KR (125.1.8.23)</p>
                    </div>
                    <p className="text-light-text-secondary">방금 전</p>
                </li>
                <li className="flex justify-between items-center py-2 text-sm">
                    <div>
                        <p>Vibely App on iOS</p>
                        <p className="text-light-text-secondary">Busan, KR (211.34.8.112)</p>
                    </div>
                    <p className="text-light-text-secondary">3시간 전</p>
                </li>
            </ul>
        </SettingsCard>
    </div>
)};

const SubscriptionSection = () => (
    <div className="space-y-8">
        <SettingsCard title="구독 상태">
            <div className="bg-light-bg p-6 rounded-lg flex justify-between items-center">
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="bg-brand-pink text-white px-3 py-1 text-sm font-bold rounded-full">AI 기여자</span>
                        <p className="font-semibold">플랜이 활성 상태입니다.</p>
                    </div>
                    <p className="text-sm text-light-text-secondary mt-2">구독은 2024년 12월 31일에 갱신됩니다.</p>
                </div>
                <button className="text-sm bg-light-surface border border-light-border px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500">구독 취소</button>
            </div>
            <Toggle label="자동 갱신" description="구독 만료 시 등록된 결제수단으로 자동 결제합니다." enabled={true} onToggle={() => {}}/>
        </SettingsCard>
        <SettingsCard title="결제 수단">
             <div className="border border-light-border p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="w-10"/>
                    <div>
                        <p>Visa **** **** **** 1234</p>
                        <p className="text-sm text-light-text-secondary">만료: 12/26</p>
                    </div>
                </div>
                <button className="text-sm text-light-text-secondary hover:text-red-500">삭제</button>
             </div>
             <button className="w-full text-center py-3 bg-light-bg rounded-lg hover:bg-brand-pink hover:text-white border border-light-border text-sm font-semibold">새 결제수단 추가</button>
        </SettingsCard>
        <SettingsCard title="결제 내역">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-light-border">
                        <th className="py-2">날짜</th>
                        <th className="py-2">설명</th>
                        <th className="py-2 text-right">금액</th>
                        <th className="py-2 text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-3">2024년 5월 31일</td>
                        <td>Vibely 기여자 구독</td>
                        <td className="py-3 text-right">$9.99</td>
                        <td className="py-3 text-right"><a href="#" className="text-brand-pink hover:underline">영수증</a></td>
                    </tr>
                     <tr>
                        <td className="py-3">2024년 4월 30일</td>
                        <td>Vibely 기여자 구독</td>
                        <td className="py-3 text-right">$9.99</td>
                        <td className="py-3 text-right"><a href="#" className="text-brand-pink hover:underline">영수증</a></td>
                    </tr>
                </tbody>
            </table>
        </SettingsCard>
    </div>
);

const MonetizationSection = () => (
    <div className="space-y-8">
        <SettingsCard title="Revenue Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-brand-pink/10 p-4 rounded-lg text-center">
                <p className="text-sm text-light-text-secondary">This Month's Revenue</p>
                <p className="text-2xl font-bold text-brand-pink">$1,234.56</p>
                <p className="text-xs text-green-600">+12.5% vs last month</p>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg text-center">
                <p className="text-sm text-light-text-secondary">Total Plays</p>
                <p className="text-2xl font-bold text-blue-500">45,123</p>
                <p className="text-xs text-green-600">+8.3%</p>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg text-center">
                <p className="text-sm text-light-text-secondary">Votes Received</p>
                <p className="text-2xl font-bold text-purple-500">892</p>
                <p className="text-xs text-green-600">+15.2%</p>
                </div>
            </div>
        </SettingsCard>

        <SettingsCard title="Revenue by Track">
            <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-light-bg/50 rounded-lg">
                    <img src="https://picsum.photos/seed/track1/60/60" alt="Track 1" className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                        <h4 className="font-bold">Neon Sunset Drive</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-2 text-sm">
                            <div><span className="text-light-text-secondary">Plays:</span><span className="font-semibold ml-1">2,341</span></div>
                            <div><span className="text-light-text-secondary">Shares:</span><span className="font-semibold ml-1">89</span></div>
                            <div><span className="text-light-text-secondary">Votes:</span><span className="font-semibold ml-1">156</span></div>
                            <div><span className="text-light-text-secondary">Revenue:</span><span className="font-semibold ml-1 text-green-600">$234.50</span></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-light-bg/50 rounded-lg">
                    <img src="https://picsum.photos/seed/track2/60/60" alt="Track 2" className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                        <h4 className="font-bold">Rainy Day Study</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-2 text-sm">
                             <div><span className="text-light-text-secondary">Plays:</span><span className="font-semibold ml-1">1,892</span></div>
                            <div><span className="text-light-text-secondary">Shares:</span><span className="font-semibold ml-1">67</span></div>
                            <div><span className="text-light-text-secondary">Votes:</span><span className="font-semibold ml-1">143</span></div>
                            <div><span className="text-light-text-secondary">Revenue:</span><span className="font-semibold ml-1 text-green-600">$189.30</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsCard>

        <SettingsCard title="정산 계좌" actions={<button className="text-sm bg-light-bg px-4 py-2 rounded-lg hover:bg-brand-pink hover:text-white border border-light-border">계좌 변경</button>}>
            <p className="text-sm">등록된 계좌로 매월 25일 수익이 자동 정산됩니다.</p>
            <div className="bg-light-bg p-4 rounded-lg flex items-center space-x-4">
                 <svg className="w-8 h-8 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-2m0-4h.01M4 4h16v12H4V4zm0 4h16M4 12h16"></path></svg>
                 <div>
                    <p>카카오뱅크 3333-01-1234567</p>
                    <p className="text-sm text-light-text-secondary">예금주: 김*브</p>
                 </div>
                 <span className="ml-auto text-sm text-green-500 font-semibold">인증 완료</span>
            </div>
        </SettingsCard>
    </div>
);


const NotificationSection = () => (
    <div className="space-y-8">
        <SettingsCard title="푸시 알림">
            <Toggle label="새 팔로워" description="누군가 나를 팔로우했을 때 알림을 받습니다." enabled={true} onToggle={()=>{}} />
            <Toggle label="댓글 및 좋아요" description="내 음악에 대한 반응이 있을 때 알림을 받습니다." enabled={true} onToggle={()=>{}} />
            <Toggle label="투표 결과" description="내 음악의 투표가 집계되었을 때 알림을 받습니다." enabled={false} onToggle={()=>{}} />
            <Toggle label="챌린지 업데이트" description="새로운 시즌 챌린지 소식을 받습니다." enabled={true} onToggle={()=>{}} />
        </SettingsCard>
        <SettingsCard title="이메일 알림">
            <Toggle label="주간 요약" description="한 주간의 활동 요약을 이메일로 받습니다." enabled={true} onToggle={()=>{}} />
            <Toggle label="수익 정산" description="수익이 정산될 때 이메일로 알림을 받습니다." enabled={true} onToggle={()=>{}} />
            <Toggle label="마케팅 및 프로모션" description="Vibely의 새로운 소식 및 이벤트 정보를 받습니다." enabled={false} onToggle={()=>{}} />
        </SettingsCard>
    </div>
);

const PrivacySection = () => (
    <div className="space-y-8">
        <SettingsCard title="프라이버시 설정">
             <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">프로필 공개 범위</p>
                    <p className="text-sm text-light-text-secondary">누가 내 프로필을 볼 수 있는지 설정합니다.</p>
                </div>
                <select className="bg-light-bg border border-light-border rounded-lg p-2">
                    <option>전체 공개</option>
                    <option>팔로워만</option>
                    <option>비공개</option>
                </select>
            </div>
        </SettingsCard>
        <SettingsCard title="데이터 관리">
            <p className="text-sm text-light-text-secondary">내 Vibely 활동 데이터를 관리하고 계정을 비활성화하거나 삭제할 수 있습니다.</p>
            <div className="flex space-x-4">
                <button className="flex-1 text-center py-3 bg-light-bg rounded-lg hover:bg-brand-pink hover:text-white border border-light-border text-sm font-semibold">개인정보 다운로드</button>
                <button className="flex-1 text-center py-3 bg-light-bg rounded-lg hover:bg-brand-pink hover:text-white border border-light-border text-sm font-semibold">계정 비활성화</button>
            </div>
        </SettingsCard>
        <SettingsCard title="계정 영구 삭제" actions={<button className="text-sm bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white">계정 삭제</button>}>
            <p className="text-sm text-light-text-secondary">계정을 삭제하면 모든 데이터가 영구적으로 제거되며 복구할 수 없습니다.</p>
        </SettingsCard>
    </div>
);

const NotificationDemoSection = () => {
    const { addNotification } = useNotifications();

    return (
        <SettingsCard title="알림 시스템 테스트">
            <p className="text-sm text-light-text-secondary">
                다양한 종류의 알림을 테스트합니다. 알림은 화면 우측 상단에 나타납니다.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                    onClick={() => addNotification({ type: 'success', message: '성공적으로 처리되었습니다.' })}
                    className="bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200"
                >
                    Success
                </button>
                <button
                    onClick={() => addNotification({ type: 'error', message: '오류가 발생했습니다. 다시 시도해주세요.' })}
                    className="bg-red-100 text-red-700 p-3 rounded-lg hover:bg-red-200"
                >
                    Error
                </button>
                <button
                    onClick={() => addNotification({ type: 'info', message: '업데이트 정보를 확인하세요.' })}
                    className="bg-blue-100 text-blue-700 p-3 rounded-lg hover:bg-blue-200"
                >
                    Info
                </button>
                <button
                    onClick={() => addNotification({ type: 'warning', message: '주의! 이 작업은 되돌릴 수 없습니다.' })}
                    className="bg-yellow-100 text-yellow-700 p-3 rounded-lg hover:bg-yellow-200"
                >
                    Warning
                </button>
            </div>
        </SettingsCard>
    );
};

const SupportSection = () => (
    <div className="space-y-8">
        <SettingsCard title="고객 지원">
            <ul className="space-y-3">
                <li><a href="#" className="block bg-light-bg p-4 rounded-lg hover:bg-brand-pink hover:text-white border border-light-border">도움말 센터 (FAQ)</a></li>
                <li><a href="#" className="block bg-light-bg p-4 rounded-lg hover:bg-brand-pink hover:text-white border border-light-border">문의하기</a></li>
                <li><a href="#" className="block bg-light-bg p-4 rounded-lg hover:bg-brand-pink hover:text-white border border-light-border">버그 및 오류 신고</a></li>
                <li><a href="#" className="block bg-light-bg p-4 rounded-lg hover:bg-brand-pink hover:text-white border border-light-border">서비스 개선 피드백</a></li>
            </ul>
        </SettingsCard>
        <NotificationDemoSection />
    </div>
);


const SettingsPage: React.FC<{ onNavigateToFeed: () => void }> = ({ onNavigateToFeed }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const tabs = [
        { id: 'profile', label: '프로필 관리', icon: <UserIcon className="w-5 h-5" /> },
        { id: 'security', label: '계정 보안', icon: <LockIcon className="w-5 h-5" /> },
        { id: 'subscription', label: '구독 및 결제', icon: <CreditCardIcon className="w-5 h-5" /> },
        { id: 'monetization', label: '수익화 설정', icon: <DollarSignIcon className="w-5 h-5" /> },
        { id: 'notifications', label: '알림 설정', icon: <BellIcon className="w-5 h-5" /> },
        { id: 'privacy', label: '개인정보 보호', icon: <ShieldIcon className="w-5 h-5" /> },
        { id: 'support', label: '고객 지원', icon: <HelpCircleIcon className="w-5 h-5" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSection />;
            case 'security': return <SecuritySection />;
            case 'subscription': return <SubscriptionSection />;
            case 'monetization': return <MonetizationSection />;
            case 'notifications': return <NotificationSection />;
            case 'privacy': return <PrivacySection />;
            case 'support': return <SupportSection />;
            default: return <ProfileSection />;
        }
    };

    return (
        <div className="bg-light-bg min-h-screen text-light-text-primary font-sans">
            <header className="bg-light-surface/80 backdrop-blur-sm border-b border-light-border sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <button onClick={onNavigateToFeed} className="p-2 rounded-full hover:bg-light-bg">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex items-center ml-4">
                        <h1 onClick={onNavigateToFeed} className="text-xl font-bold text-brand-pink-accent cursor-pointer">Vibely</h1>
                        <span className="text-xl font-light text-light-text-secondary mx-2">/</span>
                        <h2 className="text-xl font-bold">계정 설정</h2>
                    </div>
                </div>
            </header>

            <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 py-8">
                <aside className="md:w-64">
                    <nav className="space-y-1 sticky top-24">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SettingsTab)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-brand-pink text-white' : 'hover:bg-light-bg text-light-text-secondary hover:text-light-text-primary'}`}
                            >
                                {tab.icon}
                                <span className="font-semibold">{tab.label}</span>
                            </button>
                        ))}
                         <div className="pt-4">
                             <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-light-bg text-light-text-secondary hover:text-light-text-primary">
                                <LogOutIcon className="w-5 h-5" />
                                <span className="font-semibold">로그아웃</span>
                             </button>
                         </div>
                    </nav>
                </aside>
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;