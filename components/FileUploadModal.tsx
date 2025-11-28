import React, { useState, DragEvent } from 'react';
import { XIcon, UploadCloudIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
        if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
            addNotification({ type: 'error', message: 'File size cannot exceed 100MB.' });
            return;
        }
        setFile(selectedFile);
    }
  };
  
  const handleDragEvents = (e: DragEvent<HTMLLabelElement>, type: 'enter' | 'leave' | 'drop') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'enter') setIsDragging(true);
    if (type === 'leave') setIsDragging(false);
    if (type === 'drop') {
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) handleFileChange(droppedFile);
    }
  };

  const handleUpload = () => {
    if(!file) {
        addNotification({type: 'error', message: 'Please select a file to upload.'});
        return;
    }
    onUpload(file);
    addNotification({type: 'success', message: `File "${file.name}" uploaded successfully!`});
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-xl w-full max-w-lg border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Upload File</h2>
          <button onClick={handleClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
            <input type="file" id="project-file-upload" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
            <label 
                htmlFor="project-file-upload" 
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer flex flex-col items-center justify-center
                    ${isDragging ? 'border-brand-purple bg-brand-purple/5' : 'border-light-border hover:border-brand-purple'}`}
                onDragEnter={(e) => handleDragEvents(e, 'enter')}
                onDragOver={(e) => handleDragEvents(e, 'enter')}
                onDragLeave={(e) => handleDragEvents(e, 'leave')}
                onDrop={(e) => handleDragEvents(e, 'drop')}
            >
                <UploadCloudIcon className="w-12 h-12 text-light-text-secondary mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drag & Drop or Click to Select</p>
                <p className="text-sm text-light-text-secondary mb-4">Audio, MIDI, Documents, etc. (Max 100MB)</p>
            </label>
            {file && (
                <div className="mt-4 bg-light-bg p-3 rounded-lg">
                    <p className="font-semibold mb-1">Selected file:</p>
                    <p className="text-sm truncate">{file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            )}
        </div>
        <div className="p-4 border-t border-light-border flex justify-end items-center space-x-3">
          <button onClick={handleClose} className="px-6 py-2 rounded-lg bg-light-bg hover:bg-light-border">Cancel</button>
          <button onClick={handleUpload} disabled={!file} className="bg-brand-purple text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50">Upload</button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;