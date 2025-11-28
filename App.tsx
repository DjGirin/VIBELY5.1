import React, { useState, useCallback, useRef, useEffect } from 'react';
import { users } from './data';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationContainer } from './components/Notifications';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import FriendsPage from './components/FriendsPage';
import MusicPage from './components/MusicPage';
import MessagesPage from './components/MessagesPage';
import CommunityPage from './components/CommunityPage';
import MobileBottomNav from './components/MobileBottomNav';
import UploadModal from './components/UploadModal';
import ThreadComposerModal from './components/ThreadComposerModal';
import { PlusIcon } from './components/icons';
import ThreadDetailPage from './components/ThreadDetailPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import { samplePortfolioProjects } from './data';
import { Media } from './types';
import FooterPlayer from './components/FooterPlayer';
import FollowListPage from './components/FollowListPage';
import DashboardPage from './components/DashboardPage';
import ProjectsPage from './components/ProjectsPage.tsx';
import TeamsPage from './components/TeamsPage';
import StagePage from './components/StagePage';
import BackstagePage from './components/BackstagePage';
import OpenProjectsPage from './components/OpenProjectsPage';


type Page = 'stage' | 'friends' | 'music' | 'settings' | 'messages' | 'profile' | 'community' | 'threadDetail' | 'followList' | 'projectDetail' | 'dashboard' | 'projects' | 'teams' | 'studio' | 'ai_tools' | 'backstage' | 'openProjects';


const App: React.FC = () => {
  const [page, setPage] = useState<Page>('stage');
  const [currentProfileId, setCurrentProfileId] = useState<string>('user1');
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isThreadComposerOpen, setThreadComposerOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [followListInfo, setFollowListInfo] = useState<{ userId: string; type: 'followers' | 'following' } | null>(null);

  // Global Player State
  const [currentTrack, setCurrentTrack] = useState<Media | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack) {
        if (audio.src !== currentTrack.fileUrl) {
            audio.src = currentTrack.fileUrl;
        }
        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error("Playback error:", error);
                    }
                });
            }
        } else {
            audio.pause();
        }
    } else {
        audio.pause();
    }
  }, [currentTrack, isPlaying]);


  const handleSetTrack = useCallback((track: Media) => {
    if (track.mediaType !== 'audio') return;

    if (currentTrack?.id === track.id) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const handlePlayPause = useCallback(() => {
    if(currentTrack) {
      setIsPlaying(prev => !prev);
    }
  }, [currentTrack]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && duration > 0) {
        const newTime = (Number(e.target.value) / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
  }, [duration]);

  const handleSeekToTime = useCallback((time: number) => {
    if (audioRef.current && isFinite(time)) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }
  }, []);


  const handleNavigate = useCallback((newPage: Page) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  }, []);
  
  const handleNavigateToProfile = useCallback((userId: string) => {
    setCurrentProfileId(userId);
    handleNavigate('profile');
  }, [handleNavigate]);

  const handleNavigateToMyProfile = useCallback(() => {
    handleNavigateToProfile('user1');
  }, [handleNavigateToProfile]);

  const handleNavigateToThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    handleNavigate('threadDetail');
  }, [handleNavigate]);

  const handleNavigateToFollowList = useCallback((userId: string, type: 'followers' | 'following') => {
    setCurrentProfileId(userId); // Ensure the profile ID is set for the back button
    setFollowListInfo({ userId, type });
    handleNavigate('followList');
  }, [handleNavigate]);

  const handleNavigateToProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    handleNavigate('projectDetail');
  }, [handleNavigate]);

  const handleBackToProfile = useCallback(() => {
    setFollowListInfo(null);
    setActiveProjectId(null); // Clear active project when going back
    handleNavigate('profile');
  }, [handleNavigate]);

  const handleFabClick = () => {
    if (page === 'community' || page === 'threadDetail') {
      setThreadComposerOpen(true);
    } else {
      setUploadModalOpen(true);
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'stage':
        return <StagePage 
                  onNavigateToProfile={handleNavigateToProfile}
                  currentUser={users.user1}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onSetTrack={handleSetTrack}
                  playbackTime={currentTime}
                  playbackDuration={duration}
                  onSeekToTime={handleSeekToTime}
                  onNavigateToProject={handleNavigateToProject}
                />;
      case 'community':
        return <CommunityPage 
                  onCompose={() => setThreadComposerOpen(true)} 
                  onNavigateToThread={handleNavigateToThread}
                />;
      case 'threadDetail':
        return activeThreadId ? <ThreadDetailPage threadId={activeThreadId} currentUser={users.user1} onBack={() => handleNavigate('community')} /> : <CommunityPage onCompose={() => setThreadComposerOpen(true)} onNavigateToThread={handleNavigateToThread} />;
      case 'friends':
        return <FriendsPage />;
      case 'music':
        return <MusicPage />;
      case 'messages':
        return <MessagesPage currentUser={users.user1} />;
      case 'profile':
        return <ProfilePage 
                  userId={currentProfileId} 
                  currentUser={users.user1} 
                  onNavigateToSettings={() => handleNavigate('settings')}
                  onNavigateToProfile={handleNavigateToProfile}
                  onNavigateToFollowList={handleNavigateToFollowList}
                  onNavigateToProject={handleNavigateToProject}
                  onNavigate={handleNavigate}
                />;
      case 'projectDetail': {
        const project = samplePortfolioProjects.find(p => p.id === activeProjectId);
        if (project) {
          return <ProjectDetailPage 
                    project={project}
                    onBack={handleBackToProfile}
                    onNavigateToProfile={handleNavigateToProfile}
                   />;
        }
        // Fallback to profile page if project not found
        return <ProfilePage userId={currentProfileId} currentUser={users.user1} onNavigateToSettings={() => handleNavigate('settings')} onNavigateToProfile={handleNavigateToProfile} onNavigateToFollowList={handleNavigateToFollowList} onNavigateToProject={handleNavigateToProject} onNavigate={handleNavigate} />;
      }
      case 'followList':
        return followListInfo ? <FollowListPage 
                                  userId={followListInfo.userId} 
                                  initialType={followListInfo.type}
                                  onBackToProfile={handleBackToProfile}
                                  onNavigateToProfile={handleNavigateToProfile}
                                /> : null;
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'teams':
        return <TeamsPage />;
      case 'backstage':
        return <BackstagePage onNavigate={handleNavigate} />;
      case 'openProjects':
        return <OpenProjectsPage />;
      case 'settings':
        return <SettingsPage onNavigateToFeed={() => handleNavigate('stage')} />;
      default:
        return <StagePage 
                  onNavigateToProfile={handleNavigateToProfile}
                  currentUser={users.user1}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  onSetTrack={handleSetTrack}
                  playbackTime={currentTime}
                  playbackDuration={duration}
                  onSeekToTime={handleSeekToTime}
                  onNavigateToProject={handleNavigateToProject}
                />;
    }
  };

  return (
    <NotificationProvider>
      <div className="bg-light-bg min-h-screen text-light-text-primary font-sans">
        <Header onNavigateToMyProfile={handleNavigateToMyProfile} onNavigateToHome={() => setPage('stage')} />
        <div className="container mx-auto flex">
          <LeftSidebar 
            onNavigate={handleNavigate} 
            currentPage={page} 
          />
          <div className={`flex-1 min-w-0 ${currentTrack ? 'pb-36 md:pb-20' : 'pb-16 md:pb-0'}`}>
            {renderPage()}
          </div>
          <RightSidebar />
        </div>
        
        <audio ref={audioRef} preload="metadata" />
        <FooterPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            progress={duration > 0 ? (currentTime / duration) * 100 : 0}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            currentTime={currentTime}
            duration={duration}
            onClose={() => {
              setCurrentTrack(null);
              setIsPlaying(false);
              setCurrentTime(0);
              setDuration(0);
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
              }
            }}
        />

        <MobileBottomNav currentPage={page} onNavigate={handleNavigate}/>
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
        <ThreadComposerModal isOpen={isThreadComposerOpen} onClose={() => setThreadComposerOpen(false)} />
        <NotificationContainer />
        
        {(page === 'stage' || page === 'community') && (
          <button 
            onClick={handleFabClick}
            className="fixed bottom-24 right-4 md:bottom-24 bg-gradient-to-r from-brand-pink to-brand-purple text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40"
            aria-label="새 포스트 또는 스레드 작성"
          >
            <PlusIcon className="w-8 h-8"/>
          </button>
        )}
      </div>
    </NotificationProvider>
  );
};

export default App;
