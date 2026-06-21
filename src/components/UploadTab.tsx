import React, { useState } from 'react';
import { Video, Sparkles, Wand2, Loader2, CheckCircle, Flame } from 'lucide-react';
import { apiFetch } from '../utils/api';

interface UploadTabProps {
  currentUser: any;
  onUploadComplete: () => void;
}

export const UploadTab: React.FC<UploadTabProps> = ({ currentUser, onUploadComplete }) => {
  const [caption, setCaption] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const templates = [
    {
      title: 'Neon Skater Flow',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happily-in-the-street-41715-large.mp4',
      poster: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
      suggestedCaption: 'Gliding through the downtown lights! 🛹🌃 #skatergirl #neon #baivo #urbanflow',
    },
    {
      title: 'Cyber Night Drive',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
      poster: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=600',
      suggestedCaption: 'Cruising above the midnight grid 🏎️💨 #cyberpunk #tokyo #nightmode #vibes',
    },
    {
      title: 'Peaceful Whisper',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
      poster: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
      suggestedCaption: 'Lost in the forest whispers 🍃 Breathe in, breathe out. #nature #calm #relax',
    },
    {
      title: 'Campfire Romance',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4',
      poster: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600',
      suggestedCaption: 'Perfect golden roast under the stars 🔥🍬 #campfire #weekend #family #outdoors',
    },
  ];

  const handleApplySuggestion = (text: string) => {
    setCaption(text);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsUploading(true);

    const template = templates[selectedTemplate];
    const finalVideoUrl = customVideoUrl.trim() || template.videoUrl;
    const finalPoster = template.poster;
    const username = currentUser?.username || currentUser?.full_name || currentUser?.email?.split('@')[0] || 'my_baivo_creator';
    const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400';

    await apiFetch('/videos', {
      method: 'POST',
      body: JSON.stringify({
        videoUrl: finalVideoUrl,
        poster: finalPoster,
        username,
        userAvatar,
        caption: caption.trim()
      })
    });

    setIsUploading(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCaption('');
      onUploadComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="pt-2 pb-4 border-b border-zinc-800/80 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-wide flex items-center gap-2">
          <Video className="w-6 h-6 text-pink-500" />
          Create Reel
        </h2>
        <span className="text-xs font-semibold bg-pink-500/20 text-pink-400 py-1 px-2.5 rounded-full border border-pink-500/30 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Ultra HD 4K
        </span>
      </div>

      {showSuccess ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40 mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-extrabold mb-1 text-white">Reel Published!</h3>
          <p className="text-xs text-zinc-400">Your video is now live on the BAIVO For You feed.</p>
        </div>
      ) : (
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Pick Template */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-purple-400" />
              1. Select a High-Quality Video Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((tmpl, idx) => (
                <button
                  type="button"
                  key={tmpl.title}
                  onClick={() => {
                    setSelectedTemplate(idx);
                    if (!caption) setCaption(tmpl.suggestedCaption);
                  }}
                  className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all group aspect-video ${
                    selectedTemplate === idx ? 'border-pink-500 ring-2 ring-pink-500/40 shadow-lg' : 'border-zinc-800 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={tmpl.poster} alt={tmpl.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-xs font-extrabold text-white truncate block">{tmpl.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional custom URL */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Or Paste Custom Video MP4 URL (Optional)
            </label>
            <input
              type="url"
              value={customVideoUrl}
              onChange={(e) => setCustomVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              disabled={isUploading}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                2. Write Caption & Hashtags
              </label>
              <button
                type="button"
                onClick={() => handleApplySuggestion(templates[selectedTemplate].suggestedCaption)}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Flame className="w-3.5 h-3.5" />
                Use Suggestion
              </button>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell your viewers what this reel is about... #trending #baivo"
              rows={4}
              required
              disabled={isUploading}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-2xl p-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none leading-relaxed"
            ></textarea>
            <p className="mt-1 text-[11px] text-zinc-500 flex justify-between">
              <span>Mention creators with @ and tag topics with #</span>
              <span>{caption.length}/150</span>
            </p>
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={isUploading || !caption.trim()}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-wider"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                Encoding Video...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                Publish to For You Feed
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
