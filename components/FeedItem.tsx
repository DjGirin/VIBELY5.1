import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Post, Media, User, Comment as CommentType } from '../types';
import LazyImage from './LazyImage';
import { HeartIcon, MessageCircleIcon, Share2Icon, MoreHorizontalIcon, PlayIcon, PauseIcon, ListPlus, FileTextIcon } from './icons';
import DMSendModal from './DMSendModal';
import PlaylistAddModal from './PlaylistAddModal';
import { useNotifications } from '../hooks/useNotifications';
import CommentSection from './CommentSection';
import WaveformWithComments from './WaveformWithComments';

const MediaRenderer: React.FC<{ 
    media: Media;
    isPlaying: boolean;
    mediaRef: React.RefObject<HTMLVideoElement>;
    onPlayPause: (e: React.MouseEvent) => void;
}> = ({ media, isPlaying, mediaRef, onPlayPause }) => {
    
    switch (media.mediaType) {
        case 'audio':
            return (
                <div className="relative group w-full h-full">
                    <LazyImage src={media.albumArtUrl} alt={media.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                        <button onClick={onPlayPause} className="bg-white/20 backdrop-blur-sm text-white h-16 w-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-100 z-10">
                            {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 pl-1" />}
                        </button>
                    </div>
                </div>
            );
        case 'image':
            return <LazyImage src={media.fileUrl} alt={media.title} className="w-full h-full object-cover" />;
        case 'video':
            return <video ref={mediaRef} src={media.fileUrl} controls className="w-full h-full object-cover bg-black" />;
        default:
            return <div className="w-full h-full bg-light-border flex items-center justify-center">Unsupported media type</div>;
    }
};


interface FeedItemProps {
  post: Post;
  onNavigateToProfile: (userId: string) => void;
  currentUser: User;
  currentTrack: Media | null;
  isPlaying: boolean;
  onSetTrack: (track: Media) => void;
  playbackTime: number;
  playbackDuration: number;
  onSeekToTime: (time: number) => void;
  onNavigateToProject: (projectId: string) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ 
    post: initialPost, 
    onNavigateToProfile, 
    currentUser, 
    currentTrack, 
    isPlaying, 
    onSetTrack,
    playbackTime,
    playbackDuration,
    onSeekToTime,
    onNavigateToProject
}) => {
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  // State for video playback
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isThisTrackActive = currentTrack?.id === post.media.id;
  
  const [isCommentsVisible, setIsCommentsVisible] = useState(initialPost.comments.length > 0);

  const waveformData = useMemo(() => {
    if (post.media.mediaType !== 'audio') return [];
    const points = (post.media.duration || 180) * 2;
    return Array.from({ length: points }, () => Math.random() * 0.9 + 0.1);
  }, [post.media.mediaType, post.media.duration]);

  const handleLike = useCallback(() => setIsLiked(prev => !prev), []);

  const handleShareSend = useCallback((selectedUsers: User[]) => {
    addNotification({ type: 'success', message: `Shared successfully to ${selectedUsers.length} user(s)!` });
    setShareModalOpen(false);
  }, [addNotification]);

  const handleAddToPlaylist = useCallback((playlistIds: string[]) => {
    addNotification({ type: 'success', message: `Added to ${playlistIds.length} playlist(s).` });
    setPlaylistModalOpen(false);
  }, [addNotification]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const onPlay = () => setIsVideoPlaying(true);
    const onPause = () => setIsVideoPlaying(false);
    
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onPause);
    
    return () => {
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('ended', onPause);
    }
  }, []);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.media.mediaType === 'audio') {
        onSetTrack(post.media);
    } else if (post.media.mediaType === 'video' && videoRef.current) {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }
  }, [post.media, onSetTrack]);

  const handleSeek = useCallback((time: number) => {
    if (post.media.mediaType === 'audio' && isThisTrackActive) {
        onSeekToTime(time);
    } else if (videoRef.current) {
        videoRef.current.currentTime = time;
    }
  }, [isThisTrackActive, onSeekToTime, post.media.mediaType]);

  const handleAddComment = useCallback((commentData: Omit<CommentType, 'id' | 'author' | 'createdAt' | 'likes'>) => {
    const newComment: CommentType = {
        id: `comment-${Date.now()}`,
        author: currentUser,
        createdAt: 'Just now',
        likes: 0,
        ...commentData,
    };
    setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, newComment],
    }));
  }, [currentUser]);
  
  return (
    <article className="bg-light-surface rounded-xl border border-light-border overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex space-x-4">
          {/* Album Art Section */}
          <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative group">
              <LazyImage src={post.media.albumArtUrl} alt={post.media.title} className="w-full h-full object-cover rounded-md" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <button onClick={togglePlay} className="text-white h-12 w-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-100 z-10">
                      {(isThisTrackActive && isPlaying) ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 pl-1" />}
                  </button>
              </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold truncate">{post.media.title}</p>
                  <p 
                    className="text-sm text-light-text-secondary cursor-pointer hover:underline"
                    onClick={() => onNavigateToProfile(post.author.id)}
                  >
                    {post.author.name}
                  </p>
                </div>
                <button className="p-2 text-light-text-secondary hover:bg-light-bg rounded-full">
                  <MoreHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Description */}
              <p className="text-sm text-light-text-primary mt-2 line-clamp-2 flex-grow">{post.description}</p>
              
              <p className="text-xs text-light-text-secondary mt-1">{post.postedAt}</p>
          </div>
        </div>

        {post.media.mediaType === 'audio' && (
          <div className="mt-4">
              <WaveformWithComments
                  waveform={waveformData}
                  comments={post.comments}
                  duration={isThisTrackActive ? playbackDuration : (post.media.duration || 0)}
                  currentTime={isThisTrackActive ? playbackTime : 0}
                  progress={isThisTrackActive && playbackDuration > 0 ? (playbackTime / playbackDuration) * 100 : 0}
                  onSeek={handleSeek}
              />
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between mt-3 border-t border-light-border pt-3">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-brand-pink' : 'text-light-text-secondary hover:text-brand-pink'}`}>
              <HeartIcon className={`w-6 h-6 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} />
              <span className="font-semibold text-sm">{post.likes + (isLiked ? 1 : 0)}</span>
            </button>
             <button onClick={() => setIsCommentsVisible(v => !v)} className="flex items-center space-x-2 text-light-text-secondary hover:text-brand-pink">
              <MessageCircleIcon className="w-6 h-6" />
              <span className="font-semibold text-sm">{post.comments.length}</span>
            </button>
            <button onClick={() => setShareModalOpen(true)} className="flex items-center space-x-2 text-light-text-secondary hover:text-brand-pink">
              <Share2Icon className="w-6 h-6" />
            </button>
            {post.portfolioProjectId && (
              <button 
                onClick={() => onNavigateToProject(post.portfolioProjectId!)}
                className="flex items-center space-x-2 text-light-text-secondary hover:text-brand-pink"
              >
                <FileTextIcon className="w-6 h-6" />
                <span className="font-semibold text-sm hidden sm:inline">제작 과정 보기</span>
              </button>
            )}
          </div>
          <button onClick={() => setPlaylistModalOpen(true)} className="p-2 text-light-text-secondary hover:text-brand-pink">
            <ListPlus className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {isCommentsVisible && (
        <div className="px-4 pb-4 border-t border-light-border">
            <CommentSection 
                post={post}
                currentUser={currentUser}
                currentTime={isThisTrackActive ? playbackTime : 0}
                onAddComment={handleAddComment}
                onSeek={handleSeek}
            />
        </div>
      )}
      
      <DMSendModal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} post={post} onSend={handleShareSend} />
      <PlaylistAddModal isOpen={isPlaylistModalOpen} onClose={() => setPlaylistModalOpen(false)} media={post.media} onAdd={handleAddToPlaylist} />
    </article>
  );
};

export default React.memo(FeedItem);
