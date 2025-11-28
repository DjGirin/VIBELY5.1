import React, { useState, useMemo } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import {
  SparklesIcon,
  SlidersHorizontalIcon,
  ScissorsIcon,
  MusicIcon,
  XIcon,
  PlayIcon,
  CheckCircleIcon
} from './icons';
import Waveform from './Waveform';

type AIToolType = 'prompt-to-music' | 'stem-splitter' | 'ai-mastering';

interface AITool {
  id: AIToolType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const aiTools: AITool[] = [
  {
    id: 'prompt-to-music',
    title: 'Prompt-to-Music',
    description: 'Generate high-quality music from text descriptions.',
    icon: <SparklesIcon className="w-8 h-8" />,
    color: 'brand-pink',
  },
  {
    id: 'stem-splitter',
    title: 'Stem Splitter',
    description: 'Separate any song into vocals, drums, bass, and more.',
    icon: <ScissorsIcon className="w-8 h-8" />,
    color: 'brand-purple',
  },
  {
    id: 'ai-mastering',
    title: 'AI Mastering',
    description: 'Instantly master your tracks for optimal loudness and clarity.',
    icon: <SlidersHorizontalIcon className="w-8 h-8" />,
    color: 'blue-500',
  },
];

const ToolCard: React.FC<{ tool: AITool; onLaunch: () => void }> = ({ tool, onLaunch }) => (
  <div className={`bg-light-surface rounded-xl border-l-4 border-${tool.color} p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow`}>
    <div>
      <div className={`text-${tool.color} mb-3`}>{tool.icon}</div>
      <h3 className="text-xl font-bold text-light-text-primary mb-2">{tool.title}</h3>
      <p className="text-sm text-light-text-secondary mb-4">{tool.description}</p>
    </div>
    <button
      onClick={onLaunch}
      className={`w-full mt-2 bg-${tool.color}/10 text-${tool.color} px-4 py-2 rounded-lg font-semibold hover:bg-${tool.color}/20 transition-colors`}
    >
      Launch Tool
    </button>
  </div>
);

const AIToolModal: React.FC<{ tool: AITool; onClose: () => void }> = ({ tool, onClose }) => {
    const [step, setStep] = useState(1); // 1: input, 2: processing, 3: result
    const { addNotification } = useNotifications();
    
    const handleProcess = () => {
        setStep(2);
        addNotification({type: 'info', message: 'AI is processing your request...'});
        setTimeout(() => {
            setStep(3);
            addNotification({type: 'success', message: 'Processing complete!'});
        }, 3000);
    };
    
    const renderModalContent = () => {
        if (step === 2) {
             return (
                <div className="text-center p-8">
                    <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-semibold text-lg">AI is thinking...</p>
                    <p className="text-light-text-secondary">This may take a moment.</p>
                </div>
            );
        }
        
        if (step === 3) {
            return (
                 <div className="p-6">
                    <div className="text-center mb-4">
                        <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2"/>
                        <h3 className="font-bold text-xl">Result</h3>
                    </div>
                    {tool.id === 'stem-splitter' && (
                        <div className="space-y-2">
                            {['Vocals', 'Drums', 'Bass', 'Other'].map(stem => (
                                <div key={stem} className="flex items-center justify-between p-2 bg-light-bg rounded-lg">
                                    <span className="font-medium">{stem}.wav</span>
                                    <button className="p-2 text-light-text-secondary hover:text-brand-purple"><PlayIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                        </div>
                    )}
                    {tool.id === 'ai-mastering' && <div className="text-center text-light-text-secondary">Mastered audio is ready for download.</div>}
                    {tool.id === 'prompt-to-music' && (
                         <div className="flex items-center p-3 bg-light-bg rounded-lg">
                             <button className="p-2 bg-brand-pink text-white rounded-full"><PlayIcon className="w-5 h-5 pl-0.5"/></button>
                             <div className="w-full h-1 bg-light-border mx-3 rounded-full"><div className="w-1/3 h-full bg-brand-pink rounded-full"></div></div>
                             <span className="text-xs font-mono">0:45 / 2:30</span>
                         </div>
                    )}
                </div>
            );
        }

        switch (tool.id) {
            case 'stem-splitter':
            case 'ai-mastering':
                return (
                    <div className="p-6">
                         <div className="border-2 border-dashed border-light-border rounded-lg p-10 text-center hover:border-brand-purple transition-colors cursor-pointer flex flex-col items-center justify-center">
                            <MusicIcon className="w-12 h-12 text-light-text-secondary mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">Drag & Drop or Click to Upload</p>
                            <p className="text-sm text-light-text-secondary mb-4">Audio File (Max 100MB)</p>
                         </div>
                    </div>
                );
            case 'prompt-to-music':
                 return (
                    <div className="p-6">
                         <textarea
                            className="w-full bg-light-bg border border-light-border rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink"
                            placeholder="e.g., A futuristic synthwave track for a night drive in a cyberpunk city..."
                        />
                    </div>
                );
            default: return null;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-light-surface rounded-xl w-full max-w-lg border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
            <div className={`p-4 border-b border-light-border flex justify-between items-center bg-${tool.color}/10`}>
              <h2 className={`text-xl font-bold text-${tool.color} flex items-center space-x-3`}>
                {tool.icon}
                <span>{tool.title}</span>
              </h2>
              <button onClick={onClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1">
                {renderModalContent()}
            </div>

            <div className="p-4 border-t border-light-border flex justify-end items-center space-x-3">
              <button onClick={onClose} className="px-6 py-2 rounded-lg bg-light-bg hover:bg-light-border border border-light-border">
                Cancel
              </button>
              {step !== 3 && <button onClick={handleProcess} className={`bg-${tool.color} text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-80`}>
                {step === 1 ? "Process" : "Processing..."}
              </button>}
            </div>
          </div>
        </div>
    )
}

const AIToolsPage: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

    return (
        <>
            <main className="flex-1 max-w-7xl mx-auto p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-light-text-primary">AI Tools</h1>
                    <p className="text-light-text-secondary mt-2">Empower your creativity with cutting-edge AI. Generate, refine, and perfect your sound.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onLaunch={() => setSelectedTool(tool)} />
                    ))}
                </div>
            </main>
            {selectedTool && <AIToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
        </>
    );
};

export default AIToolsPage;
