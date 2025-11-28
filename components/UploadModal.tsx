import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useMemo } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { XIcon, MusicIcon, ImageIcon, CheckCircleIcon } from './icons';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [postInfo, setPostInfo] = useState({
    title: '',
    description: '',
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const mediaType = useMemo(() => {
    if (!mediaFile) return null;
    if (mediaFile.type.startsWith('audio/')) return 'audio';
    if (mediaFile.type.startsWith('image/')) return 'image';
    if (mediaFile.type.startsWith('video/')) return 'video';
    return 'unsupported';
  }, [mediaFile]);

  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const resetState = () => {
    setStep(1);
    setMediaFile(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
    setPostInfo({ title: '', description: '' });
    setUploading(false);
    setError(null);
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const acceptedAudio = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/m4a', 'audio/mpeg'];
    const acceptedImage = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const acceptedVideo = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
    const acceptedTypes = [...acceptedAudio, ...acceptedImage, ...acceptedVideo];

    if (!acceptedTypes.includes(file.type)) {
        setError('Unsupported file type. Please upload audio, image, or video.');
        return;
    }

    if (file.size > 200 * 1024 * 1024) { // 200MB limit
        setError(`File size cannot exceed 200MB.`);
        return;
    }
    
    setError(null);
    setMediaFile(file);
    if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(URL.createObjectURL(file));
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!mediaFile || !postInfo.title.trim()) {
      setError('Media file and title are required.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      console.log('Starting upload:', { mediaFile, postInfo });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      addNotification({type: 'success', message: `"${postInfo.title}" posted successfully!`});
      handleClose();
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const renderPreview = () => {
    if (!mediaPreview) return null;
    switch(mediaType) {
        case 'image':
            return <img src={mediaPreview} alt="Preview" className="max-h-48 rounded-lg" />;
        case 'video':
            return <video src={mediaPreview} controls className="max-h-48 rounded-lg" />;
        case 'audio':
            return (
                <div className="text-center p-4 bg-light-bg rounded-lg">
                    <MusicIcon className="w-16 h-16 text-brand-pink mx-auto" />
                    <p className="font-medium mt-2 break-all">{mediaFile?.name}</p>
                </div>
            );
        default:
             return <p>Unsupported file</p>;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-light-surface rounded-xl w-full max-w-lg border border-light-border relative animate-fade-in-up shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-center">
          <h2 className="text-xl font-bold">Create a new post</h2>
          <button onClick={handleClose} className="p-1 text-light-text-secondary rounded-full hover:bg-light-bg"><XIcon className="w-6 h-6"/></button>
        </div>

        {step === 1 && (
            <div className="p-6">
                 <input type="file" id="file-upload" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                 <label htmlFor="file-upload" className="border-2 border-dashed border-light-border rounded-lg p-10 text-center hover:border-brand-pink transition-colors cursor-pointer flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-light-text-secondary mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Drag & Drop or Click to Upload</p>
                    <p className="text-sm text-light-text-secondary mb-4">Audio, Image, or Video (Max 200MB)</p>
                    <span className="bg-brand-pink text-white px-6 py-2 rounded-lg">Select File</span>
                 </label>
                 {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
        )}

        {step === 2 && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-center mb-4">
                {renderPreview()}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Title <span className="text-red-500">*</span></label>
              <input type="text" value={postInfo.title} onChange={(e) => setPostInfo(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-light-bg border border-light-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-pink" placeholder="Enter a title for your post" maxLength={100} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea value={postInfo.description} onChange={(e) => setPostInfo(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-light-bg border border-light-border rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink" placeholder="Tell us more about your post..." maxLength={500} />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setStep(1)} className="px-6 py-2 rounded-lg hover:bg-light-bg font-semibold">Back</button>
              <div className="flex space-x-3">
                <button onClick={handleClose} className="px-6 py-2 rounded-lg bg-light-bg hover:bg-light-border border border-light-border">Cancel</button>
                <button onClick={handleSubmit} disabled={uploading || !postInfo.title.trim()} className="bg-brand-pink text-white px-6 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center min-w-[120px]">
                  {uploading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /><span>Posting...</span></> : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;