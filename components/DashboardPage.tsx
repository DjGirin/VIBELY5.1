import React from 'react';
import {
  DollarSignIcon,
  MusicIcon,
  UsersIcon,
  FolderKanbanIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MessageCircleIcon,
  UserPlusIcon,
  CheckCircleIcon,
  FilePlus2Icon,
  SparklesIcon,
} from './icons';
import { sampleStudioProjects } from '../data';
import { StudioProject } from '../types';
import LazyImage from './LazyImage';

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change: number;
  color: string;
}> = ({ icon, title, value, change, color }) => {
  const changeColor = change >= 0 ? 'text-green-500' : 'text-red-500';
  const ChangeIcon = change >= 0 ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="bg-light-surface rounded-xl border border-light-border p-5 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-${color}/10 text-${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-light-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-light-text-primary">{value}</p>
          <div className={`flex items-center text-xs ${changeColor}`}>
            <ChangeIcon className="w-3 h-3 mr-1" />
            <span>{Math.abs(change)}% vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RevenueChart: React.FC = () => {
  const revenueData = [
    { month: 'Jul', revenue: 2345 },
    { month: 'Aug', revenue: 2890 },
    { month: 'Sep', revenue: 3120 },
    { month: 'Oct', revenue: 2980 },
    { month: 'Nov', revenue: 3560 },
    { month: 'Dec', revenue: 4123 },
  ];
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="bg-light-surface rounded-xl border border-light-border p-5 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
      <div className="flex justify-between items-end h-48 space-x-2">
        {revenueData.map(data => (
          <div key={data.month} className="flex-1 flex flex-col items-center justify-end group">
            <div
              className="w-full bg-brand-purple/20 rounded-t-md group-hover:bg-brand-purple/40 transition-all"
              style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
            >
              <div className="relative h-full">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-light-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  ${data.revenue.toLocaleString()}
                </span>
              </div>
            </div>
            <span className="text-xs text-light-text-secondary mt-2">{data.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityFeed: React.FC = () => {
  const activities = [
    { id: 1, icon: <MessageCircleIcon className="w-5 h-5 text-blue-500"/>, text: <><span className="font-semibold">Lofi Girl</span> commented on <span className="font-semibold text-brand-purple">Project Genesis</span></>, time: '2 hours ago' },
    { id: 2, icon: <UserPlusIcon className="w-5 h-5 text-green-500"/>, text: <>You've been added to <span className="font-semibold text-brand-purple">Team Anthem</span> by <span className="font-semibold">Hyperpop Princess</span></>, time: '1 day ago' },
    { id: 3, icon: <CheckCircleIcon className="w-5 h-5 text-purple-500"/>, text: <><span className="font-semibold">Orchestral Finale</span> has been completed.</>, time: '3 days ago' },
    { id: 4, icon: <FolderKanbanIcon className="w-5 h-5 text-yellow-500"/>, text: <>New task assigned in <span className="font-semibold text-brand-purple">Cyberpunk Dream</span></>, time: '4 days ago' },
  ];
  return (
    <div className="bg-light-surface rounded-xl border border-light-border p-5 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">{activity.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-light-text-primary">{activity.text}</p>
              <p className="text-xs text-light-text-muted">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectStatusWidget: React.FC = () => {
    const activeProjects = sampleStudioProjects.filter(p => p.status !== 'completed').slice(0, 3);
    return (
        <div className="bg-light-surface rounded-xl border border-light-border p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Active Projects</h3>
            <div className="space-y-4">
                {activeProjects.map(project => (
                    <div key={project.id}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-light-text-primary">{project.title}</span>
                             <div className="flex items-center -space-x-2">
                                {project.contributors.map(c => <LazyImage key={c.user.id} src={c.user.avatarUrl} alt={c.user.name} className="w-6 h-6 rounded-full border border-light-surface"/>)}
                             </div>
                        </div>
                        <div className="w-full bg-light-bg rounded-full h-2">
                            <div className="bg-gradient-to-r from-brand-pink to-brand-purple h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="text-sm text-brand-purple font-semibold mt-4 w-full text-center hover:underline">View All Projects</button>
        </div>
    );
};

const QuickActions: React.FC = () => {
    const actions = [
        { icon: <FilePlus2Icon className="w-6 h-6"/>, label: 'New Project' },
        { icon: <MusicIcon className="w-6 h-6"/>, label: 'Upload Track' },
        { icon: <SparklesIcon className="w-6 h-6"/>, label: 'Create with AI' },
        { icon: <UsersIcon className="w-6 h-6"/>, label: 'Manage Team' }
    ];

    return (
        <div className="bg-light-surface rounded-xl border border-light-border p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map(action => (
                    <button key={action.label} className="flex flex-col items-center justify-center p-4 bg-light-bg rounded-lg hover:bg-brand-purple/10 hover:text-brand-purple transition-colors">
                        {action.icon}
                        <span className="text-sm font-semibold mt-2">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

const DashboardPage: React.FC = () => {
  return (
    <main className="flex-1 p-4 md:p-6 bg-light-bg/50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-light-text-primary">SynthWaveKid's Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard icon={<DollarSignIcon className="w-6 h-6"/>} title="Monthly Revenue" value="$1,234.56" change={12.5} color="brand-pink"/>
          <StatCard icon={<MusicIcon className="w-6 h-6"/>} title="Total Plays" value="45.1K" change={8.3} color="purple-500"/>
          <StatCard icon={<UsersIcon className="w-6 h-6"/>} title="New Followers" value="+128" change={-5.2} color="blue-500"/>
          <StatCard icon={<FolderKanbanIcon className="w-6 h-6"/>} title="Active Projects" value="4" change={0} color="yellow-500"/>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <RevenueChart />
                 <ProjectStatusWidget />
            </div>
            <div className="space-y-6">
                <ActivityFeed />
                <QuickActions />
            </div>
        </div>

      </div>
    </main>
  );
};

export default DashboardPage;