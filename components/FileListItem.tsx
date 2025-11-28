import React, { useState } from 'react';
import { File as ProjectFile } from '../types';
import LazyImage from './LazyImage';
import { MusicIcon, FileTextIcon, MoreHorizontalIcon, Trash2Icon } from './icons';

interface FileListItemProps {
  file: ProjectFile;
  onDelete: () => void;
}

const FileListItem: React.FC<FileListItemProps> = ({ file, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getFileIcon = () => {
    switch (file.type) {
      case 'audio': return <MusicIcon className="w-5 h-5 text-brand-pink" />;
      case 'document': return <FileTextIcon className="w-5 h-5 text-blue-500" />;
      default: return <FileTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center p-2 rounded-lg hover:bg-light-bg/50 group">
      <div className="w-10 h-10 flex items-center justify-center bg-light-bg rounded-md mr-3">
        {getFileIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{file.name}</p>
        <p className="text-xs text-light-text-secondary">v{file.version} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{file.uploadedBy.name}</p>
            <p className="text-xs text-light-text-secondary">Uploader</p>
        </div>
        <LazyImage src={file.uploadedBy.avatarUrl} alt={file.uploadedBy.name} className="w-8 h-8 rounded-full" />
        <div className="relative">
            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg">
                <MoreHorizontalIcon className="w-5 h-5" />
            </button>
            {isMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-light-surface rounded-md shadow-lg border border-light-border z-10">
                    <button 
                        onClick={() => { onDelete(); setIsMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                        <Trash2Icon className="w-4 h-4"/>
                        <span>Delete</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FileListItem;