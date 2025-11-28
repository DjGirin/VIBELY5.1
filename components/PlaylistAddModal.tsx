import React, { useState } from 'react';
import { Media, Playlist } from '../types';
import { playlists as allPlaylists } from '../data';
import LazyImage from './LazyImage';
import { XIcon, CheckIcon, MusicIcon } from './icons';

interface PlaylistAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: Media;
  onAdd: (playlistIds: string[]) => void;
}

const PlaylistAddModal: React.FC<PlaylistAddModalProps> = ({ isOpen, onClose, media, onAdd }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const userPlaylists = allPlaylists.filter(p => p.authorId === 'user1');

  const handleTogglePlaylist = (playlistId: string) => {
    setSelectedPlaylists(prev =>
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleAdd = () => {
    if (selectedPlaylists.length === 0) return;
    onAdd(selectedPlaylists);
    onClose();
    setSelectedPlaylists([]);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-light-surface rounded-xl max-w-sm w-full border border-light-border shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-light-border flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-bold">Add to Playlist</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-light-bg"><XIcon className="w-5 h-5"/></button>
        </div>
        
        <div className="p-4 flex items-center space-x-3 bg-light-bg/50 border-b border-light-border flex-shrink-0">
            <LazyImage src={media.albumArtUrl} alt={media.title} className="w-12 h-12 rounded-md" />
            <div>
                <p className="font-semibold">{media.title}</p>
                <p className="text-sm text-light-text-secondary">{media.artist}</p>
            </div>
        </div>

        <div className="overflow-y-auto px-2 py-2">
            {userPlaylists.map(playlist => (
                <div key={playlist.id} onClick={() => handleTogglePlaylist(playlist.id)} className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-light-bg">
                    {Array.isArray(playlist.coverArtUrl) ? (
                        <div className="w-12 h-12 grid grid-cols-2 grid-rows-2 gap-px flex-shrink-0">
                            {playlist.coverArtUrl.slice(0, 4).map((url, i) => (
                                <LazyImage key={i} src={url} alt={playlist.name} className="w-full h-full object-cover" />
                            ))}
                        </div>
                    ) : (
                        <LazyImage src={playlist.coverArtUrl} alt={playlist.name} className="w-12 h-12 rounded-md flex-shrink-0" />
                    )}
                    <div className="flex-1">
                        <p className="font-semibold">{playlist.name}</p>
                        <p className="text-sm text-light-text-secondary">{playlist.trackIds.length} tracks</p>
                    </div>
                    {selectedPlaylists.includes(playlist.id) && (
                        <div className="w-6 h-6 bg-brand-pink rounded-full flex items-center justify-center text-white">
                            <CheckIcon className="w-4 h-4" />
                        </div>
                    )}
                </div>
            ))}
        </div>
        
        <div className="p-4 border-t border-light-border mt-auto flex-shrink-0">
             <button
              onClick={handleAdd}
              disabled={selectedPlaylists.length === 0}
              className="w-full bg-brand-pink text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-pink-accent"
            >
              Add to {selectedPlaylists.length} Playlist{selectedPlaylists.length !== 1 ? 's' : ''}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistAddModal;