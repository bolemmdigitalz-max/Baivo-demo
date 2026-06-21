import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { ReelsFeed } from './ReelsFeed';
import { DiscoverTab } from './DiscoverTab';
import { UploadTab } from './UploadTab';
import { ProfileTab } from './ProfileTab';
import { Home, Compass, PlusSquare, User, Loader2 } from 'lucide-react';

interface MainAppProps {
  currentUser: any;
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'upload' | 'profile'>('home');
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const fetchInitialVideos = useCallback(async () => {
    setIsLoading(true);
    const res = await apiFetch('/videos', { method: 'GET' });
    setIsLoading(false);
    if (res.success && res.data) {
      setVideos(res.data);
    }
  }, []);

  useEffect(() => {
    fetchInitialVideos();
  }, [fetchInitialVideos]);

  const handleGoToSearch = () => {
    setActiveTab('discover');
  };

  const handleSelectVideoFromProfile = (videoId: string) => {
    setSelectedVideoId(videoId);
    setActiveTab('home');
  };

  const handleSelectTagFromDiscover = (_tagOrCreator: string) => {
    // Jump to home feed to explore
    setActiveTab('home');
  };

  const handleUploadComplete = async () => {
    // Re-fetch videos to get the newly added reel at the top
    const res = await apiFetch('/videos', { method: 'GET' });
    if (res.success && res.data) {
      setVideos(res.data);
    }
    setActiveTab('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center select-none">
        <div className="relative mb-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
          <div className="relative bg-zinc-900 p-4 rounded-full border border-zinc-800">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        </div>
        <p className="text-xs text-zinc-400 font-semibold tracking-wider uppercase">Loading Reels Feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* Dynamic Tab Content */}
      <div className="flex-1 relative">
        {activeTab === 'home' && (
          <ReelsFeed
            currentUser={currentUser}
            videos={videos}
            onUpdateVideos={setVideos}
            onGoToSearch={handleGoToSearch}
            selectedVideoId={selectedVideoId}
          />
        )}
        {activeTab === 'discover' && (
          <DiscoverTab onSelectTag={handleSelectTagFromDiscover} />
        )}
        {activeTab === 'upload' && (
          <UploadTab currentUser={currentUser} onUploadComplete={handleUploadComplete} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab
            currentUser={currentUser}
            videos={videos}
            onLogout={onLogout}
            onSelectVideo={handleSelectVideoFromProfile}
          />
        )}
      </div>

      {/* Mobile-first Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 h-16 bg-black/90 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-around z-40 select-none px-4 max-w-lg mx-auto">
        <button
          onClick={() => {
            setActiveTab('home');
            setSelectedVideoId(null);
          }}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home' ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'discover' ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Discover</span>
        </button>

        {/* Upload Reel Center Button */}
        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center justify-center -mt-4 group active:scale-95 transition-all"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-zinc-900 border border-white/20 text-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
              <PlusSquare className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'profile' ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Profile</span>
        </button>
      </div>
    </div>
  );
};
