import React, { useState } from 'react';
import { LogOut, Heart, Bookmark, Grid, User, ExternalLink, ShieldCheck } from 'lucide-react';

interface ProfileTabProps {
  currentUser: any;
  videos: any[];
  onLogout: () => void;
  onSelectVideo: (videoId: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ currentUser, videos, onLogout, onSelectVideo }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');

  const userObj = currentUser || {};
  const username = userObj.username || userObj.full_name || userObj.email?.split('@')[0] || 'baivo_creator';
  const avatar = userObj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
  const bio = userObj.bio || 'Living my best life on BAIVO ✨ #filmmaker';
  const followers = userObj.followers || 12400;
  const following = userObj.following || 382;
  const likesCount = userObj.likes || 89200;

  // Filter posts created by this user or default sample posts
  const userPosts = videos.filter(v => v.username === username || v.id === 'vid_1' || v.id === 'vid_2');
  const bookmarkedPosts = videos.filter(v => v.isBookmarked);

  const displayedVideos = activeTab === 'posts' ? userPosts : bookmarkedPosts;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24 max-w-md mx-auto select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2 pb-4 border-b border-zinc-800/80 mb-6">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-extrabold tracking-wide">Profile</h2>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/50 text-red-400 py-1.5 px-3 rounded-xl text-xs font-semibold active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          Logout
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75"></div>
          <img
            src={avatar}
            alt={username}
            className="relative w-24 h-24 rounded-full object-cover border-2 border-black bg-zinc-800"
          />
        </div>

        <h3 className="text-xl font-extrabold text-white flex items-center gap-1.5 justify-center">
          @{username}
          <ShieldCheck className="w-5 h-5 text-pink-500 shrink-0" />
        </h3>
        
        {userObj.full_name && (
          <p className="text-xs text-zinc-400 font-medium mt-0.5">{userObj.full_name}</p>
        )}

        <p className="text-xs text-zinc-300 max-w-xs mt-3 bg-zinc-900/60 py-2 px-4 rounded-2xl border border-zinc-800/60 leading-relaxed">
          {bio}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-xs mt-6 pt-6 border-t border-zinc-800/80">
          <div className="flex flex-col items-center">
            <span className="text-lg font-extrabold text-white">{formatNumber(following)}</span>
            <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-extrabold text-white">{formatNumber(followers)}</span>
            <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-extrabold text-white">{formatNumber(likesCount)}</span>
            <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Likes</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-zinc-800 mb-4 text-center text-xs font-extrabold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('posts')}
          className={`py-3.5 flex items-center justify-center gap-2 transition-colors relative ${
            activeTab === 'posts' ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Grid className="w-4 h-4" />
          Reels ({userPosts.length})
          {activeTab === 'posts' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500"></div>}
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`py-3.5 flex items-center justify-center gap-2 transition-colors relative ${
            activeTab === 'bookmarks' ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved ({bookmarkedPosts.length})
          {activeTab === 'bookmarks' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500"></div>}
        </button>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-3 gap-1.5">
        {displayedVideos.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-zinc-500 text-center">
            {activeTab === 'posts' ? <Grid className="w-12 h-12 text-zinc-700 mb-2 stroke-1" /> : <Bookmark className="w-12 h-12 text-zinc-700 mb-2 stroke-1" />}
            <p className="text-sm font-medium">No {activeTab === 'posts' ? 'reels' : 'saved videos'} yet</p>
            <p className="text-xs text-zinc-600 mt-1">Explore the For You feed to add items.</p>
          </div>
        ) : (
          displayedVideos.map((vid) => (
            <button
              key={vid.id}
              onClick={() => onSelectVideo(vid.id)}
              className="relative aspect-[9/16] bg-zinc-900 overflow-hidden group hover:opacity-90 active:scale-[0.98] transition-all rounded-lg"
            >
              <img src={vid.poster} alt={vid.username} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-extrabold z-10">
                <span className="flex items-center gap-1 truncate">
                  <Heart className="w-3 h-3 text-pink-500 fill-pink-500 shrink-0" />
                  {formatNumber(vid.likes)}
                </span>
                <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
