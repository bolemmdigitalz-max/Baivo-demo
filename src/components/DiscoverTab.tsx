import React, { useState } from 'react';
import { Search, TrendingUp, Hash, Users, Flame, ExternalLink } from 'lucide-react';

interface DiscoverTabProps {
  onSelectTag: (tag: string) => void;
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({ onSelectTag }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTags = [
    { tag: 'cyberpunk', views: '24.5M views', category: 'Visual Arts' },
    { tag: 'streetdance', views: '18.2M views', category: 'Dance & Music' },
    { tag: 'baivo', views: '15.9M views', category: 'Trending App' },
    { tag: 'tokyodrift', views: '12.1M views', category: 'Travel & Action' },
    { tag: 'mindfulness', views: '8.4M views', category: 'Wellness & Chill' },
    { tag: 'campfire', views: '5.2M views', category: 'Outdoors' },
  ];

  const popularCreators = [
    { username: 'neon_vibes', name: 'Neon Studio', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', category: 'Professional Choreography', followers: '450K' },
    { username: 'aerial_visuals', name: 'Kenji Sato', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', category: '4K Drone Flight Masters', followers: '1.2M' },
    { username: 'nature.zen', name: 'Alina Rivers', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', category: 'ASMR & Calm Escapes', followers: '280K' },
    { username: 'cozy_camping', name: 'The Harper Family', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200', category: 'Weekend Wild Hikes', followers: '340K' },
  ];

  const filteredTags = trendingTags.filter(t => t.tag.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCreators = popularCreators.filter(c => c.username.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24 max-w-md mx-auto select-none">
      {/* Search Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md pt-2 pb-4 z-20">
        <h2 className="text-xl font-extrabold tracking-wide mb-3 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-pink-500" />
          Discover
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hashtags, creators, vibes..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Trending Hashtags Section */}
      <div className="mt-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-pink-500" />
            Trending Topics
          </h3>
          <span className="text-[11px] text-pink-400 font-medium">Updated daily</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredTags.map((t) => (
            <button
              key={t.tag}
              onClick={() => onSelectTag(t.tag)}
              className="bg-zinc-900/80 hover:bg-zinc-800 p-3 rounded-2xl border border-zinc-800/80 hover:border-pink-500/40 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-pink-400 font-extrabold text-sm mb-0.5 group-hover:text-pink-300">
                  <Hash className="w-4 h-4" />
                  <span className="truncate">{t.tag}</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium truncate">{t.category}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 font-semibold border-t border-zinc-800 pt-2">
                <span>{t.views}</span>
                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-pink-400 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Creators Section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-purple-500" />
          Suggested Creators
        </h3>

        <div className="space-y-3">
          {filteredCreators.map((creator) => (
            <div
              key={creator.username}
              className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={creator.avatar}
                  alt={creator.username}
                  className="w-12 h-12 rounded-full object-cover bg-zinc-800 border border-zinc-700 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-white truncate flex items-center gap-1">
                    {creator.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium truncate">@{creator.username}</p>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">{creator.category}</p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-[11px] font-extrabold text-white mb-1.5">{creator.followers} followers</span>
                <button
                  onClick={() => onSelectTag(creator.username)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-[11px] py-1 px-3.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md"
                >
                  View Feed
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
