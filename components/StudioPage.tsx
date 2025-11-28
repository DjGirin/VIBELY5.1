import React, { useState, useMemo } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import {
  PlayIcon,
  PauseIcon,
  RecordIcon,
  StopIcon,
  RepeatIcon,
  VolumeXIcon,
  HeadphonesIcon,
  SparklesIcon,
  MusicIcon,
} from './icons';
import Waveform from './Waveform';

const MixerChannel: React.FC<{
  label: string;
  color: string;
}> = ({ label, color }) => {
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isSolo, setIsSolo] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-2 p-2 bg-gray-700/50 rounded-lg">
      <div className="h-40 relative w-12 flex justify-center">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="absolute h-full w-2 appearance-none bg-gray-600 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          style={{ writingMode: 'bt-lr' }}
        />
      </div>
       <div className="flex space-x-2 w-full justify-center">
        <button
          onClick={() => setIsMuted(prev => !prev)}
          className={`p-1.5 rounded ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}
          title="Mute"
        >
          <VolumeXIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsSolo(prev => !prev)}
          className={`p-1.5 rounded ${isSolo ? 'bg-yellow-500 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}
          title="Solo"
        >
          <HeadphonesIcon className="w-4 h-4" />
        </button>
      </div>
      <p className={`text-xs font-semibold px-2 py-1 rounded w-full text-center bg-gray-800 text-white`}>{label}</p>
    </div>
  );
};


const AIToolButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}> = ({ icon, label, description, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors w-full text-left"
    >
        <div className="p-2 bg-brand-purple/20 rounded-lg text-brand-purple">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-gray-100">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
    </button>
);


const StudioPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addNotification } = useNotifications();
  const [width, setWidth] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const waveformData = useMemo(() => Array.from({ length: 200 }, () => Math.random() * 0.9 + 0.1), []);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(p => {
            if (p >= 100) {
                setIsPlaying(false);
                return 0;
            }
            return p + 0.1
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleAIToolClick = (toolName: string) => {
    addNotification({type: 'info', message: `Applying ${toolName}...`});
    setTimeout(() => {
        addNotification({type: 'success', message: `${toolName} applied successfully!`});
    }, 2500);
  };

  const stems = [
      { name: 'Drums', color: 'red-500' },
      { name: 'Bass', color: 'yellow-500' },
      { name: 'Melody', color: 'blue-500' },
      { name: 'Vocals', color: 'green-500' },
      { name: 'Master', color: 'gray-400' },
  ];
  
  const aiTools = [
    { label: 'AI Master', description: 'Master your track instantly', icon: <SparklesIcon className="w-5 h-5"/>, action: () => handleAIToolClick('AI Mastering') },
    { label: 'Stem Splitter', description: 'Separate track into stems', icon: <MusicIcon className="w-5 h-5"/>, action: () => handleAIToolClick('Stem Splitter') },
    { label: 'Vocal Remover', description: 'Isolate or remove vocals', icon: <HeadphonesIcon className="w-5 h-5"/>, action: () => handleAIToolClick('Vocal Remover') },
    { label: 'AI FX', description: 'Apply creative AI effects', icon: <SparklesIcon className="w-5 h-5"/>, action: () => handleAIToolClick('AI FX') },
  ];

  return (
    <main className="flex-1 p-4 md:p-6 bg-gray-900 text-white flex flex-col h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)]">
      {/* Header / Transport */}
      <header className="flex-shrink-0 bg-gray-800 rounded-t-xl p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Cyberpunk Dream - In Progress</h2>
          <p className="text-sm text-gray-400">124 BPM • C# Minor</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="p-2 text-gray-300 hover:text-white transition-colors"><RecordIcon className="w-6 h-6 text-red-500"/></button>
          <button className="p-2 text-gray-300 hover:text-white transition-colors"><StopIcon className="w-6 h-6"/></button>
          <button 
            onClick={() => setIsPlaying(p => !p)}
            className="bg-brand-purple text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? <PauseIcon className="w-7 h-7"/> : <PlayIcon className="w-7 h-7 pl-1"/>}
          </button>
          <button className="p-2 text-gray-300 hover:text-white transition-colors"><RepeatIcon className="w-6 h-6"/></button>
        </div>
      </header>
      
      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col md:flex-row bg-gray-800 rounded-b-xl overflow-hidden min-h-0">
        {/* Mixer */}
        <aside className="w-full md:w-64 lg:w-80 p-4 border-b md:border-b-0 md:border-r border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-bold mb-4">Mixer</h3>
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
                {stems.map(stem => (
                    <MixerChannel key={stem.name} label={stem.name} color={stem.color} />
                ))}
            </div>
        </aside>
        
        {/* Timeline/Waveform */}
        <div ref={containerRef} className="flex-1 p-6 flex flex-col items-center justify-center min-h-0">
          <div className="w-full h-full relative bg-gray-900/50 rounded-lg flex items-center justify-center p-4">
            <Waveform data={waveformData} width={width} height={150} color="#6B7280" />
            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${progress}%` }}>
              <Waveform data={waveformData} width={width} height={150} color="#EC4899" />
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: `${progress}%` }}/>
          </div>
        </div>
        
        {/* AI Tools */}
        <aside className="w-full md:w-64 lg:w-72 p-4 border-t md:border-t-0 md:border-l border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-bold mb-4">AI Tools</h3>
            <div className="space-y-3">
                {aiTools.map(tool => (
                    <AIToolButton key={tool.label} {...tool} onClick={tool.action} />
                ))}
            </div>
        </aside>
      </div>
    </main>
  );
};

export default StudioPage;
