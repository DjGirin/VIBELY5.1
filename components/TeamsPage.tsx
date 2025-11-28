import React, { useState } from 'react';
import { sampleTeams } from '../data';
import { Team, User } from '../types';
import LazyImage from './LazyImage';
import { UsersIcon, PlusIcon, FolderKanbanIcon, MailIcon } from './icons';
import CreateTeamModal from './CreateTeamModal';

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
  const { name, description, members, projectIds } = team;
  const visibleMembers = members.slice(0, 5);
  const hiddenMembersCount = members.length - visibleMembers.length;

  return (
    <div className="bg-light-surface rounded-xl border border-light-border p-5 flex flex-col justify-between transition-shadow hover:shadow-lg">
      <div>
        <h3 className="text-xl font-bold text-light-text-primary mb-2">{name}</h3>
        <p className="text-sm text-light-text-secondary mb-4 line-clamp-2 h-10">{description}</p>
        <div className="flex items-center -space-x-2 mb-4">
          {visibleMembers.map(member => (
            <LazyImage
              key={member.user.id}
              src={member.user.avatarUrl}
              alt={member.user.name}
              className="w-9 h-9 rounded-full border-2 border-light-surface"
              title={`${member.user.name} (${member.role})`}
            />
          ))}
          {hiddenMembersCount > 0 && (
            <div className="w-9 h-9 rounded-full bg-light-bg border-2 border-light-surface flex items-center justify-center text-xs font-semibold text-light-text-secondary">
              +{hiddenMembersCount}
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between items-center text-sm text-light-text-secondary mb-4">
            <div className="flex items-center space-x-2">
                <FolderKanbanIcon className="w-4 h-4" />
                <span>{projectIds.length} Active Projects</span>
            </div>
            <div className="flex items-center space-x-2">
                <UsersIcon className="w-4 h-4" />
                <span>{members.length} Members</span>
            </div>
        </div>
        <div className="flex space-x-2">
            <button className="flex-1 bg-brand-purple text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm">Manage Team</button>
            <button className="flex-shrink-0 bg-light-bg border border-light-border p-2 rounded-lg hover:bg-light-border"><MailIcon className="w-5 h-5"/></button>
        </div>
      </div>
    </div>
  );
};

const TeamsPage: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>(sampleTeams);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateTeam = (teamData: Omit<Team, 'id' | 'members' | 'projectIds' | 'createdAt'>) => {
        const currentUser: User = {id: 'user1', name: 'SynthWaveKid', handle: '@synthwavekid', avatarUrl: 'https://picsum.photos/seed/user1/100/100', isOnline: true, isFollowing: false, isContributor: true, bio: '', genreTags:[], followersCount: 0, followingCount: 0, followingIds: []};
        const newTeam: Team = {
            id: `team-${Date.now()}`,
            ...teamData,
            members: [{ user: currentUser, role: 'Admin' }],
            projectIds: [],
            createdAt: new Date().toISOString(),
        };
        setTeams(prev => [newTeam, ...prev]);
        setIsModalOpen(false);
    };

    return (
        <>
            <main className="flex-1 max-w-7xl mx-auto p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-light-text-primary">Teams</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-brand-purple text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Create New Team</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teams.map(team => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            </main>
            <CreateTeamModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateTeam}
            />
        </>
    );
};

export default TeamsPage;