import React, { useRef, MouseEvent, useEffect, useState } from 'react';
import { Comment } from '../types';
import Waveform from './Waveform';

interface WaveformWithCommentsProps {
  waveform: number[];
  comments: Comment[];
  duration: number;
  progress: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

const WaveformWithComments: React.FC<WaveformWithCommentsProps> = ({ waveform, comments, duration, progress, currentTime, onSeek }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && duration > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const time = duration * percentage;
      onSeek(time);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full cursor-pointer h-[80px]" onClick={handleSeek}>
      {/* Base Waveform (unplayed part) */}
      <div className="absolute inset-0">
        <Waveform data={waveform} width={width} height={80} color="#E5E7EB" />
      </div>

      {/* Progress Waveform (played part) */}
      <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${progress}%` }}>
        <Waveform data={waveform} width={width} height={80} color="#EC4899" />
      </div>
      
      {/* Progress Bar Line */}
      <div className="absolute top-0 bottom-0 -ml-px w-0.5 bg-[#EC4899]" style={{ left: `${progress}%` }}>
          {/* The knob has been removed for a more minimal look */}
      </div>
      
      {/* Comment Markers */}
      {comments.map(comment => {
        const isActive = Math.abs(comment.timestamp - currentTime) < 2; // Active if within 2 seconds
        return (
            <div
              key={comment.id}
              className="absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2 group z-10"
              style={{ left: `${(comment.timestamp / (duration || 1)) * 100}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onSeek(comment.timestamp);
              }}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full border-2 border-light-surface shadow-md cursor-pointer transition-all duration-200 ease-out group-hover:scale-125"
                style={{
                    backgroundColor: isActive ? '#EC4899' : '#CBD5E1',
                    transform: `scale(${isActive ? 1.5 : 1})`,
                    boxShadow: isActive ? '0 0 10px #EC4899' : '0 1px 3px rgba(0,0,0,0.1)',
                }}
              />
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max max-w-[240px] bg-gray-800 text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="flex items-center space-x-2">
                    <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-5 h-5 rounded-full"/>
                    <p className="font-bold">{comment.author.name}</p>
                </div>
                <p className="whitespace-normal break-words mt-1">{comment.content}</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-800 transform rotate-45 -mt-1"></div>
              </div>
            </div>
        )
      })}
    </div>
  );
};

export default React.memo(WaveformWithComments);