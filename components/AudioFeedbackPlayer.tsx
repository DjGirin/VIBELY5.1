import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import {
  PlayIcon,
  PauseIcon,
  MessageCircleIcon,
  SendIcon,
  MicIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
  ChevronDownIcon
} from './icons';
import LazyImage from './LazyImage';

interface AudioComment {
  id: string;
  user: User;
  content: string;
  timestamp: number; // 초 단위
  createdAt: string;
  type: 'text' | 'voice';
}

interface AudioFeedbackPlayerProps {
  audioUrl: string;
  title: string;
  artist: string;
  coverImage: string;
  comments: AudioComment[];
  currentUser: User;
  onAddComment: (content: string, timestamp: number, type: 'text' | 'voice') => void;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 댓글 마커 컴포넌트
const CommentMarker: React.FC<{
  comment: AudioComment;
  position: number;
  onClick: () => void;
  isActive: boolean;
}> = ({ comment, position, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`absolute top-0 transform -translate-x-1/2 transition-all ${
      isActive ? 'z-20 scale-110' : 'z-10 hover:scale-105'
    }`}
    style={{ left: `${position}%` }}
    title={`${formatTime(comment.timestamp)} - ${comment.user.name}`}
  >
    <div className={`w-3 h-3 rounded-full border-2 ${
      isActive
        ? 'bg-brand-pink border-brand-pink'
        : 'bg-white border-brand-pink/50 hover:border-brand-pink'
    }`} />
  </button>
);

// 댓글 아이템 컴포넌트
const CommentItem: React.FC<{
  comment: AudioComment;
  onJumpTo: () => void;
  isActive: boolean;
}> = ({ comment, onJumpTo, isActive }) => (
  <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
    isActive ? 'bg-brand-pink/5 border border-brand-pink/20' : 'hover:bg-light-bg'
  }`}>
    <LazyImage
      src={comment.user.avatarUrl}
      alt={comment.user.name}
      className="w-8 h-8 rounded-full flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center space-x-2 mb-1">
        <span className="font-medium text-light-text-primary text-sm">{comment.user.name}</span>
        <button
          onClick={onJumpTo}
          className="text-xs text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full hover:bg-brand-pink/20"
        >
          {formatTime(comment.timestamp)}
        </button>
        <span className="text-xs text-light-text-muted">{comment.createdAt}</span>
      </div>
      {comment.type === 'voice' ? (
        <div className="flex items-center space-x-2 text-sm text-light-text-secondary">
          <MicIcon className="w-4 h-4" />
          <span>음성 메모</span>
          <button className="text-brand-pink hover:underline">재생</button>
        </div>
      ) : (
        <p className="text-sm text-light-text-secondary">{comment.content}</p>
      )}
    </div>
  </div>
);

// 파형 시각화 컴포넌트
const Waveform: React.FC<{
  progress: number;
  comments: AudioComment[];
  duration: number;
  onSeek: (percent: number) => void;
  activeCommentId: string | null;
  onCommentClick: (comment: AudioComment) => void;
}> = ({ progress, comments, duration, onSeek, activeCommentId, onCommentClick }) => {
  const waveformRef = useRef<HTMLDivElement>(null);

  // 가상 파형 데이터 생성
  const bars = [...Array(100)].map((_, i) => ({
    height: 20 + Math.random() * 60,
    id: i,
  }));

  const handleClick = (e: React.MouseEvent) => {
    if (waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      onSeek(Math.max(0, Math.min(100, percent)));
    }
  };

  return (
    <div
      ref={waveformRef}
      className="relative h-20 bg-light-bg rounded-lg overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* 파형 바 */}
      <div className="absolute inset-0 flex items-center justify-center space-x-0.5 px-2">
        {bars.map((bar, i) => {
          const barProgress = (i / bars.length) * 100;
          const isPlayed = barProgress <= progress;
          return (
            <div
              key={bar.id}
              className={`w-1 rounded-full transition-colors ${
                isPlayed ? 'bg-brand-pink' : 'bg-light-border'
              }`}
              style={{ height: `${bar.height}%` }}
            />
          );
        })}
      </div>

      {/* 재생 위치 표시 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-brand-pink z-10"
        style={{ left: `${progress}%` }}
      />

      {/* 댓글 마커 */}
      <div className="absolute inset-x-0 top-1">
        {comments.map(comment => (
          <CommentMarker
            key={comment.id}
            comment={comment}
            position={(comment.timestamp / duration) * 100}
            onClick={() => onCommentClick(comment)}
            isActive={activeCommentId === comment.id}
          />
        ))}
      </div>
    </div>
  );
};

const AudioFeedbackPlayer: React.FC<AudioFeedbackPlayerProps> = ({
  audioUrl,
  title,
  artist,
  coverImage,
  comments,
  currentUser,
  onAddComment
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(true);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (percent: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(duration)) return;

    const newTime = (percent / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleCommentClick = (comment: AudioComment) => {
    setActiveCommentId(comment.id);
    handleSeek((comment.timestamp / duration) * 100);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment, currentTime, 'text');
    setNewComment('');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // 현재 시간 근처의 댓글 하이라이트
  useEffect(() => {
    const nearbyComment = comments.find(
      c => Math.abs(c.timestamp - currentTime) < 1
    );
    if (nearbyComment) {
      setActiveCommentId(nearbyComment.id);
    }
  }, [currentTime, comments]);

  return (
    <div className="bg-light-surface rounded-2xl border border-light-border overflow-hidden">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* 상단: 트랙 정보 & 파형 */}
      <div className="p-4 md:p-6">
        <div className="flex items-start space-x-4 mb-4">
          <LazyImage
            src={coverImage}
            alt={title}
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-light-text-primary truncate">{title}</h3>
            <p className="text-light-text-secondary">{artist}</p>
            <div className="flex items-center space-x-2 mt-2 text-sm text-light-text-muted">
              <MessageCircleIcon className="w-4 h-4" />
              <span>{comments.length}개의 피드백</span>
            </div>
          </div>
        </div>

        {/* 파형 */}
        <Waveform
          progress={progress}
          comments={comments}
          duration={duration}
          onSeek={handleSeek}
          activeCommentId={activeCommentId}
          onCommentClick={handleCommentClick}
        />

        {/* 시간 표시 */}
        <div className="flex items-center justify-between text-xs text-light-text-secondary mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* 컨트롤 */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={() => handleSkip(-10)}
            className="p-2 text-light-text-secondary hover:text-light-text-primary"
          >
            <SkipBackIcon className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6 pl-1" />
            )}
          </button>
          <button
            onClick={() => handleSkip(10)}
            className="p-2 text-light-text-secondary hover:text-light-text-primary"
          >
            <SkipForwardIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 볼륨 */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          <button onClick={toggleMute} className="text-light-text-secondary">
            {isMuted || volume === 0 ? (
              <VolumeXIcon className="w-5 h-5" />
            ) : (
              <Volume2Icon className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-light-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="border-t border-light-border p-4">
        <div className="flex items-center space-x-3">
          <LazyImage
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-xs text-brand-pink bg-brand-pink/10 px-2 py-1 rounded">
              {formatTime(currentTime)}
            </span>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
              placeholder="이 부분에 대한 피드백을 남겨주세요..."
              className="flex-1 bg-light-bg border border-light-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>
          <button
            onClick={() => setIsRecordingVoice(!isRecordingVoice)}
            className={`p-2 rounded-full ${
              isRecordingVoice
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-light-bg text-light-text-secondary hover:bg-light-border'
            }`}
          >
            <MicIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="p-2 bg-brand-pink text-white rounded-full disabled:opacity-50"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 퀵 리액션 */}
        <div className="flex items-center justify-center space-x-2 mt-3">
          {['👍', '🔥', '💯', '🎯', '🤔', '✅'].map(emoji => (
            <button
              key={emoji}
              onClick={() => onAddComment(emoji, currentTime, 'text')}
              className="text-xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="border-t border-light-border">
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full flex items-center justify-between p-4 hover:bg-light-bg"
        >
          <span className="font-medium text-light-text-primary">
            피드백 ({comments.length})
          </span>
          <ChevronDownIcon className={`w-5 h-5 text-light-text-secondary transition-transform ${showComments ? 'rotate-180' : ''}`} />
        </button>

        {showComments && (
          <div className="max-h-64 overflow-y-auto p-4 pt-0 space-y-2">
            {comments.length === 0 ? (
              <p className="text-center text-light-text-secondary py-4">
                아직 피드백이 없습니다. 첫 번째로 의견을 남겨보세요!
              </p>
            ) : (
              comments
                .sort((a, b) => a.timestamp - b.timestamp)
                .map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onJumpTo={() => handleCommentClick(comment)}
                    isActive={activeCommentId === comment.id}
                  />
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioFeedbackPlayer;
