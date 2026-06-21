import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Music2, Plus, Volume2, VolumeX, Play, Search, Disc, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { CommentsDrawer } from './CommentsDrawer';

interface ReelsFeedProps {
  currentUser: any;
  videos: any[];
  onUpdateVideos: (updater: (prev: any[]) => any[]) => void;
  onGoToSearch: () => void;
  selectedVideoId?: string | null;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({
  currentUser,
  videos,
  onUpdateVideos,
  onGoToSearch,
  selectedVideoId
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'following' | 'foryou'>('foryou');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // default muted for browser autoplay policy compliance
  const [activeCommentVideoId, setActiveCommentVideoId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Filter videos based on active tab
  const displayedVideos = activeTab === 'following'
    ? videos.filter(v => v.isFollowing || followedMap[v.username])
    : videos;

  // Jump to selected video if passed from Profile tab
  useEffect(() => {
    if (selectedVideoId) {
      const idx = displayedVideos.findIndex(v => v.id === selectedVideoId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [selectedVideoId, displayedVideos]);

  // Handle auto-play on mount / index change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentIndex, activeTab]);

  const currentVideo = displayedVideos[currentIndex] || displayedVideos[0];

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center select-none">
        <Disc className="w-12 h-12 text-zinc-700 mb-4 animate-spin" />
        <h3 className="text-lg font-bold mb-1">No reels available</h3>
        <p className="text-xs text-zinc-500 mb-6">Switch back to For You to explore creators.</p>
        <button
          onClick={() => setActiveTab('foryou')}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-xs py-2 px-6 rounded-full hover:opacity-90 active:scale-95 transition-all"
        >
          Explore For You
        </button>
      </div>
    );
  }

  const handleVideoTap = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    const videoId = currentVideo.id;
    // Optimistic UI update
    onUpdateVideos((prev) => 
      prev.map((v) => {
        if (v.id === videoId) {
          const nextLikeState = !v.isLiked;
          return {
            ...v,
            isLiked: nextLikeState,
            likes: nextLikeState ? v.likes + 1 : v.likes - 1
          };
        }
        return v;
      })
    );

    await apiFetch(`/videos/${videoId}/like`, { method: 'POST' });
  };

  const handleBookmark = async () => {
    const videoId = currentVideo.id;
    onUpdateVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return { ...v, isBookmarked: !v.isBookmarked };
        }
        return v;
      })
    );

    await apiFetch(`/videos/${videoId}/bookmark`, { method: 'POST' });
  };

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleFollow = () => {
    setFollowedMap(prev => ({ ...prev, [currentVideo.username]: !prev[currentVideo.username] }));
  };

  const handleSwipeUp = () => {
    if (currentIndex < displayedVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col justify-between overflow-hidden select-none z-10 pb-16">
      {/* Share Toast */}
      {shareToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Share2 className="w-4 h-4 text-pink-500" />
          Reel link copied to clipboard!
        </div>
      )}

      {/* Main Video Background Container */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={currentVideo.videoUrl}
          poster={currentVideo.poster}
          playsInline
          loop
          muted={isMuted}
          onClick={handleVideoTap}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Big Play Pause Overlay Badge */}
        {!isPlaying && (
          <div 
            onClick={handleVideoTap}
            className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-auto cursor-pointer"
          >
            <div className="w-20 h-20 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 animate-scale-up shadow-2xl">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Top Overlay Header */}
      <div className="relative z-20 pt-4 px-4 flex items-center justify-between pointer-events-auto">
        <button
          onClick={onGoToSearch}
          className="p-2.5 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-zinc-300 hover:text-white transition-colors border border-white/10"
        >
          <Search className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-6 text-sm font-extrabold tracking-wider uppercase">
          <button
            onClick={() => {
              setActiveTab('following');
              setCurrentIndex(0);
            }}
            className={`py-1 transition-all relative ${
              activeTab === 'following' ? 'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Following
            {activeTab === 'following' && <div className="absolute bottom-0 inset-x-1 h-0.5 bg-pink-500 rounded-full"></div>}
          </button>
          
          <button
            onClick={() => {
              setActiveTab('foryou');
              setCurrentIndex(0);
            }}
            className={`py-1 transition-all relative ${
              activeTab === 'foryou' ? 'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            For You
            {activeTab === 'foryou' && <div className="absolute bottom-0 inset-x-1 h-0.5 bg-pink-500 rounded-full"></div>}
          </button>
        </div>

        {/* Audio Mute/Unmute toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-zinc-300 hover:text-white transition-colors border border-white/10"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Up / Down Floating Nav Buttons for desktop/web ease of use */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 pointer-events-auto">
        <button
          onClick={handleSwipeDown}
          disabled={currentIndex === 0}
          className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 disabled:opacity-20 disabled:pointer-events-none rounded-full text-white border border-white/10 shadow-xl active:scale-95 transition-all"
          title="Previous Reel"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={handleSwipeUp}
          disabled={currentIndex === displayedVideos.length - 1}
          className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 disabled:opacity-20 disabled:pointer-events-none rounded-full text-white border border-white/10 shadow-xl active:scale-95 transition-all"
          title="Next Reel"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom & Right Action Overlays */}
      <div className="relative z-20 px-4 pb-4 flex items-end justify-between pointer-events-auto w-full max-w-lg mx-auto">
        {/* Bottom Left Info */}
        <div className="flex-1 pr-12 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-extrabold text-base text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
              @{currentVideo.username}
            </h3>
            {(!currentVideo.isFollowing && !followedMap[currentVideo.username]) && (
              <button
                onClick={handleFollow}
                className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] py-0.5 px-2 rounded-full uppercase tracking-wider shadow"
              >
                Follow
              </button>
            )}
            {followedMap[currentVideo.username] && (
              <span className="bg-zinc-800 text-zinc-300 font-bold text-[10px] py-0.5 px-2 rounded-full uppercase tracking-wider flex items-center gap-0.5 border border-zinc-700">
                <Check className="w-3 h-3 text-pink-400" /> Following
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-100 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-3 line-clamp-3">
            {currentVideo.caption}
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/30 backdrop-blur-sm py-1.5 px-3 rounded-full w-max max-w-full border border-white/10">
            <Music2 className="w-4 h-4 text-pink-500 shrink-0 animate-bounce" />
            <span className="truncate">{currentVideo.musicTitle}</span>
          </div>
        </div>

        {/* Right Sidebar Actions */}
        <div className="flex flex-col items-center gap-5 shrink-0 select-none pb-2">
          {/* Avatar & Follow Badge */}
          <div className="relative group cursor-pointer">
            <img
              src={currentVideo.userAvatar}
              alt={currentVideo.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xl bg-zinc-800"
            />
            {!followedMap[currentVideo.username] && (
              <button
                onClick={handleFollow}
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-pink-600 hover:bg-pink-500 text-white rounded-full p-0.5 shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center group active:scale-90 transition-all cursor-pointer"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-black/60 transition-colors shadow-xl ${currentVideo.isLiked ? 'text-pink-500' : 'text-white'}`}>
              <Heart className={`w-6 h-6 ${currentVideo.isLiked ? 'fill-pink-500 scale-110' : ''} transition-all`} />
            </div>
            <span className="text-xs font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-1">
              {formatNumber(currentVideo.likes)}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setActiveCommentVideoId(currentVideo.id)}
            className="flex flex-col items-center group active:scale-90 transition-all cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-black/60 transition-colors shadow-xl text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-1">
              {formatNumber(currentVideo.commentsCount)}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="flex flex-col items-center group active:scale-90 transition-all cursor-pointer"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-black/60 transition-colors shadow-xl ${currentVideo.isBookmarked ? 'text-yellow-400' : 'text-white'}`}>
              <Bookmark className={`w-6 h-6 ${currentVideo.isBookmarked ? 'fill-yellow-400 scale-110' : ''} transition-all`} />
            </div>
            <span className="text-xs font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-1">
              {currentVideo.isBookmarked ? 'Saved' : 'Save'}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center group active:scale-90 transition-all cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-black/60 transition-colors shadow-xl text-white">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-1">
              {formatNumber(currentVideo.shares)}
            </span>
          </button>

          {/* Spinning Music Disc */}
          <div className="mt-2 relative flex items-center justify-center animate-spin-slow">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-40"></div>
            <Disc className="w-11 h-11 text-zinc-800 fill-zinc-900 drop-shadow-xl relative z-10" />
            <img
              src={currentVideo.userAvatar}
              alt="Music cover"
              className="absolute w-5 h-5 rounded-full object-cover z-20 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Comments Drawer Modal */}
      <CommentsDrawer
        videoId={currentVideo.id}
        isOpen={activeCommentVideoId === currentVideo.id}
        onClose={() => setActiveCommentVideoId(null)}
        comments={currentVideo.comments}
        currentUser={currentUser}
        onCommentAdded={(newCmtList) => {
          onUpdateVideos((prev) =>
            prev.map((v) => {
              if (v.id === currentVideo.id) {
                return {
                  ...v,
                  comments: newCmtList,
                  commentsCount: newCmtList.length
                };
              }
              return v;
            })
          );
        }}
      />
    </div>
  );
};
