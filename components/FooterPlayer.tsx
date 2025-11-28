import React, { useState } from 'react';
import { Media } from '../types';
import { SkipBackIcon, PlayIcon, PauseIcon, SkipForwardIcon, Volume2Icon, VolumeXIcon, RepeatIcon, ListPlus, ChevronUpIcon, HeartIcon, XIcon } from './icons';
import LazyImage from './LazyImage';

interface FooterPlayerProps {
  currentTrack: Media | null;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentTime: number;
  duration: number;
  onClose?: () => void;
}

const formatTime = (timeInSeconds: number) => {
  if (!isFinite(timeInSeconds)) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const FooterPlayer: React.FC<FooterPlayerProps> = ({
  currentTrack,
  isPlaying,
  progress,
  onPlayPause,
  onSeek,
  currentTime,
  duration,
  onClose
}) => {
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* 다크 테마 미니 플레이어 - 모바일에서는 네비게이션 바(h-16) 위에 배치 */}
      <footer className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 transition-all duration-300">
        {/* 진행 바 (상단) */}
        <div className="h-1 bg-gray-800 relative">
          <div
            className="h-full bg-gradient-to-r from-brand-pink to-brand-purple transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 메인 플레이어 */}
        <div className="bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 h-16 md:h-20 flex items-center px-3 md:px-4">
          {/* 트랙 정보 */}
          <div className="flex items-center space-x-3 min-w-0 flex-1 md:flex-none md:w-72">
            <div className="relative group">
              <LazyImage
                src={currentTrack.albumArtUrl}
                alt={currentTrack.title}
                className="h-12 w-12 md:h-14 md:w-14 rounded-lg flex-shrink-0 shadow-lg"
              />
              {/* 확장 버튼 (모바일) */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="md:hidden absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
              >
                <ChevronUpIcon className={`w-6 h-6 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate text-sm md:text-base">{currentTrack.title}</p>
              <p className="text-xs md:text-sm text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
            {/* 좋아요 버튼 */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`hidden md:block p-2 rounded-full transition-colors ${isLiked ? 'text-brand-pink' : 'text-gray-400 hover:text-white'}`}
            >
              <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* 컨트롤 (중앙) */}
          <div className="hidden md:flex flex-1 flex-col items-center justify-center mx-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2 rounded-full transition-colors ${isRepeat ? 'text-brand-pink' : 'text-gray-400 hover:text-white'}`}
              >
                <RepeatIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <SkipBackIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onPlayPause}
                className="bg-white text-gray-900 h-10 w-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 pl-0.5" />}
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <SkipForwardIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <ListPlus className="h-5 w-5" />
              </button>
            </div>
            {/* 시크바 */}
            <div className="w-full max-w-xl flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1 relative group">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={onSeek}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-0
                    [&::-webkit-slider-thumb]:h-0
                    group-hover:[&::-webkit-slider-thumb]:w-3
                    group-hover:[&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:transition-all"
                  style={{
                    background: `linear-gradient(to right, #ec4899 ${progress}%, #374151 ${progress}%)`
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* 모바일 재생 버튼 */}
          <div className="md:hidden flex items-center space-x-1">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${isLiked ? 'text-brand-pink' : 'text-gray-400'}`}
            >
              <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onPlayPause}
              className="bg-white text-gray-900 h-10 w-10 rounded-full flex items-center justify-center"
            >
              {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 pl-0.5" />}
            </button>
            {/* 모바일 닫기 버튼 */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 p-2"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* 볼륨 컨트롤 (우측) */}
          <div className="hidden md:flex flex-none w-48 items-center justify-end space-x-2">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors p-2">
              {isMuted || volume === 0 ? (
                <VolumeXIcon className="h-5 w-5" />
              ) : (
                <Volume2Icon className="h-5 w-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, #9ca3af ${isMuted ? 0 : volume}%, #374151 ${isMuted ? 0 : volume}%)`
              }}
            />
            {/* 닫기 버튼 */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 ml-2"
                title="재생바 닫기"
              >
                <XIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* 모바일 확장 플레이어 */}
      {isExpanded && (
        <div className="md:hidden fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-black flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setIsExpanded(false)} className="text-gray-400">
              <ChevronUpIcon className="w-6 h-6 rotate-180" />
            </button>
            <span className="text-white text-sm font-medium">Now Playing</span>
            <button className="text-gray-400">
              <ListPlus className="w-6 h-6" />
            </button>
          </div>

          {/* 앨범 아트 */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-2xl">
              <LazyImage src={currentTrack.albumArtUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* 트랙 정보 */}
          <div className="px-8 text-center">
            <h2 className="text-xl font-bold text-white">{currentTrack.title}</h2>
            <p className="text-gray-400 mt-1">{currentTrack.artist}</p>
          </div>

          {/* 진행 바 */}
          <div className="px-8 mt-6">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={onSeek}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, #ec4899 ${progress}%, #374151 ${progress}%)`
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
              <span className="text-xs text-gray-500">{formatTime(duration)}</span>
            </div>
          </div>

          {/* 컨트롤 */}
          <div className="flex items-center justify-center space-x-8 py-8">
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-3 rounded-full ${isRepeat ? 'text-brand-pink' : 'text-gray-400'}`}
            >
              <RepeatIcon className="h-6 w-6" />
            </button>
            <button className="text-gray-400 p-3">
              <SkipBackIcon className="h-8 w-8" />
            </button>
            <button
              onClick={onPlayPause}
              className="bg-white text-gray-900 h-16 w-16 rounded-full flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8 pl-1" />}
            </button>
            <button className="text-gray-400 p-3">
              <SkipForwardIcon className="h-8 w-8" />
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full ${isLiked ? 'text-brand-pink' : 'text-gray-400'}`}
            >
              <HeartIcon className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(FooterPlayer);
