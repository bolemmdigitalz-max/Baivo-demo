import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  time: string;
}

interface CommentsDrawerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onCommentAdded: (newComments: Comment[]) => void;
  currentUser: any;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  videoId,
  isOpen,
  onClose,
  comments,
  onCommentAdded,
  currentUser
}) => {
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setIsSubmitting(true);
    const username = currentUser?.username || currentUser?.full_name || currentUser?.email?.split('@')[0] || 'baivo_user';
    const avatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';

    const res = await apiFetch(`/videos/${videoId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ username, avatar, text: newText.trim() })
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      onCommentAdded(res.data.comments);
      setNewText('');
    } else {
      // Fallback local update if server doesn't maintain state
      const newCommentObj: Comment = {
        id: 'c_' + Date.now(),
        username,
        avatar,
        text: newText.trim(),
        time: 'Just now'
      };
      onCommentAdded([...comments, newCommentObj]);
      setNewText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Drawer Container */}
      <div className="relative w-full max-h-[70vh] bg-zinc-900 rounded-t-3xl border-t border-zinc-800 flex flex-col z-10 animate-slide-up select-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-pink-500" />
            <h3 className="font-bold text-sm text-white">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-h-[250px]">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-center">
              <MessageCircle className="w-12 h-12 text-zinc-700 mb-2 stroke-1" />
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs text-zinc-600 mt-1">Be the first to share what you think!</p>
            </div>
          ) : (
            comments.map((cmt) => (
              <div key={cmt.id} className="flex items-start gap-3 text-sm animate-fade-in">
                <img 
                  src={cmt.avatar} 
                  alt={cmt.username}
                  className="w-9 h-9 rounded-full object-cover bg-zinc-800 border border-zinc-700 shrink-0"
                />
                <div className="flex-1 bg-zinc-800/50 p-3 rounded-2xl rounded-tl-none border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-zinc-300">@{cmt.username}</span>
                    <span className="text-[10px] text-zinc-500">{cmt.time}</span>
                  </div>
                  <p className="text-zinc-200 text-xs leading-relaxed break-words">{cmt.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleAddComment} className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a comment..."
            maxLength={200}
            disabled={isSubmitting}
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-full py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!newText.trim() || isSubmitting}
            className="p-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
