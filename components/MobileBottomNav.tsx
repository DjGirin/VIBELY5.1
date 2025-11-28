import React from 'react';
import { SparklesIcon, ListIcon, MessageSquareIcon, MusicIcon, DoorOpenIcon, UsersIcon } from './icons';

type Page = 'stage' | 'friends' | 'music' | 'settings' | 'messages' | 'profile' | 'community' | 'threadDetail' | 'followList' | 'projectDetail' | 'dashboard' | 'projects' | 'teams' | 'studio' | 'ai_tools' | 'backstage' | 'room' | 'openProjects';

interface MobileBottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPage, onNavigate }) => {
  // 네비게이션 순서: Stage → Community → Collab → Messages → BackStage
  const navItems = [
    { id: 'stage' as const, icon: SparklesIcon, label: 'Stage' },
    { id: 'community' as const, icon: ListIcon, label: 'Community' },
    { id: 'openProjects' as const, icon: UsersIcon, label: 'Collab' },
    { id: 'messages' as const, icon: MessageSquareIcon, label: 'Messages', hasBadge: true },
    { id: 'backstage' as const, icon: DoorOpenIcon, label: 'BackStage' },
  ];

  // 활성 상태 체크 (room은 backstage, dashboard, projects, teams를 포함)
  const isActive = (id: string) => {
    if (id === 'backstage') {
      return ['backstage', 'dashboard', 'projects', 'teams', 'room'].includes(currentPage);
    }
    return currentPage === id || (id === 'community' && currentPage === 'threadDetail');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-light-surface/95 backdrop-blur-sm border-t border-light-border z-30">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 py-2 px-1 flex flex-col items-center text-center transition-colors h-16 justify-center relative ${
              isActive(item.id)
                ? 'text-brand-pink'
                : 'text-light-text-secondary hover:text-light-text-primary'
            }`}
            aria-current={isActive(item.id) ? 'page' : undefined}
            aria-label={item.label}
          >
            <item.icon className={`w-6 h-6 mb-1 ${isActive(item.id) ? 'fill-brand-pink/20' : ''}`} />
            <span className="text-xs font-medium">{item.label}</span>
            {item.hasBadge && (
              <div className="absolute top-2 right-[calc(50%-16px)] w-2 h-2 bg-brand-pink-accent rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
