import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Copy,
  Eye,
  MessageSquare,
  MoreVertical,
  Send,
  Star,
} from 'lucide-react';
import { DEFAULT_AVATARS } from '../data/models';
import { SAMPLE_COMMENTS } from '../data/stories';
import { StoryComment, StoryItem } from '../types/ooc';

interface StoryInfoViewProps {
  story: StoryItem;
  liked: boolean;
  selectedAvatar: string;
  hasExistingSession: boolean;
  onChangeAvatar: (avatarName: string) => void;
  onToggleLike: () => void;
  onBack: () => void;
  onStartNewSession: () => void;
  onResumeSession?: () => void;
}

export const StoryInfoView: React.FC<StoryInfoViewProps> = ({
  story,
  liked,
  selectedAvatar,
  hasExistingSession,
  onChangeAvatar,
  onToggleLike,
  onBack,
  onStartNewSession,
  onResumeSession,
}) => {
  const [subTab, setSubTab] = useState<'info' | 'comments'>('info');
  const [loreExpanded, setLoreExpanded] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [comments, setComments] = useState<StoryComment[]>(SAMPLE_COMMENTS);
  const [commentInput, setCommentInput] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  const heroCover = story.rank === 29 ? '/assets/scenes/op_skill_2_cover.jpg' : story.cover;

  const handlePostComment = () => {
    const txt = commentInput.trim();
    if (!txt) return;
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: selectedAvatar,
        handle: '@Reader',
        timeAgo: 'Just now',
        text: txt,
        likes: 1,
      },
      ...prev,
    ]);
    setCommentInput('');
  };

  const handleCopyTitle = () => {
    navigator.clipboard?.writeText(story.title).catch(() => {});
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 1600);
  };

  return (
    <div className="flex flex-col h-full bg-[#121213] text-[#f5f5f7] relative">
      {/* Header */}
      <header className="flex items-center justify-between px-3.5 pt-3 pb-2.5 bg-[#121213] shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-200 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-[17px] font-semibold">Story Information</span>
        </div>

        <button
          onClick={onToggleLike}
          className={`p-2 rounded-full transition-colors ${
            liked ? 'text-[#c8e635] bg-[#c8e635]/10' : 'text-zinc-300 hover:bg-white/10'
          }`}
        >
          <ThumbsUp size={19} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </header>

      {/* Sub Tabs: Information | Comments */}
      <div className="grid grid-cols-2 border-b border-white/10 shrink-0">
        <button
          onClick={() => setSubTab('info')}
          className={`py-2.5 text-[14px] font-semibold relative transition-colors ${
            subTab === 'info' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          Information
          {subTab === 'info' && (
            <span className="absolute bottom-0 inset-x-0 h-[2px] bg-white" />
          )}
        </button>
        <button
          onClick={() => setSubTab('comments')}
          className={`py-2.5 text-[14px] font-semibold relative transition-colors ${
            subTab === 'comments' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          Comments
          {subTab === 'comments' && (
            <span className="absolute bottom-0 inset-x-0 h-[2px] bg-white" />
          )}
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto thin-scrollbar pb-24">
        {subTab === 'info' ? (
          <div>
            {/* Cover Banner with Blurred Backdrop */}
            <div className="relative py-6 flex justify-center overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center scale-125 blur-2xl opacity-35"
                style={{ backgroundImage: `url(${heroCover})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#121213]/30 to-[#121213]" />
              <div className="relative w-[170px] h-[250px] rounded-xl overflow-hidden shadow-2xl border border-white/15">
                <img src={heroCover} alt={story.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Story Title & Metadata */}
            <div className="px-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[19px] font-bold leading-snug">{story.title}</h1>
                  <button
                    onClick={handleCopyTitle}
                    className="text-zinc-400 hover:text-white p-1"
                    title="Copy title"
                  >
                    <Copy size={16} />
                  </button>
                  {copiedToast && <span className="text-[11px] text-[#c8e635]">Copied</span>}
                </div>
                <MoreVertical size={18} className="text-zinc-400 shrink-0 mt-1" />
              </div>

              {/* Creator Pill */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 bg-[#1e1e21] border border-white/10 rounded-lg px-2.5 py-1 text-[13px]">
                  <span className="text-zinc-400">@</span>
                  <span className="font-medium text-white">{story.author}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[13px] text-zinc-300">
                  <span className="w-4 h-4 rounded-full bg-[#c8e635]/20 border border-[#c8e635] flex items-center justify-center">
                    <Star size={9} className="text-[#c8e635]" fill="#c8e635" />
                  </span>
                  Creator
                </div>
              </div>

              {/* Chips: 50 Images | Fantasy | All-oriented */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#1c1c1f] border border-white/10 rounded-lg px-2.5 py-1 text-[12px] text-zinc-200">
                  {story.imageCount} Images
                </span>
                <span className="bg-[#1c1c1f] border border-white/10 rounded-lg px-2.5 py-1 text-[12px] text-zinc-200">
                  {story.genre}
                </span>
                <span className="bg-[#1c1c1f] border border-white/10 rounded-lg px-2.5 py-1 text-[12px] text-zinc-200">
                  {story.audience}
                </span>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h2 className="text-[15px] font-bold mb-1.5">Description</h2>
                <p className="text-[13.5px] text-zinc-300 leading-relaxed">{story.tagline}</p>
                <div className="mt-1.5 text-[13px] text-zinc-400 flex flex-wrap gap-x-1.5">
                  {story.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="mt-2.5 flex items-center gap-4 text-[13px] text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Eye size={14} /> {story.views}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp size={14} /> {story.likesCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare size={14} /> {story.commentsCount}
                  </span>
                </div>
              </div>

              {/* Story Description (Expandable Lore with Maps & Artwork) */}
              <div className="pt-3 border-t border-white/10">
                <h2 className="text-[15px] font-bold mb-2.5">Story Description</h2>

                {story.rank === 29 && (
                  <div className="rounded-xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-indigo-950 via-purple-900/70 to-fuchsia-950 p-3 mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-purple-300">
                          800+ Members on Discord
                        </div>
                        <div className="text-[15px] font-extrabold text-white">JOIN NOW!</div>
                        <div className="text-[11px] text-purple-200 mt-0.5">
                          Movie Nights • Minecraft Server • Creator Lore
                        </div>
                      </div>
                      <button
                        onClick={() => setLoreExpanded(true)}
                        className="px-3 py-1.5 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold shadow-lg"
                      >
                        VIEW LORE
                      </button>
                    </div>
                  </div>
                )}

                {loreExpanded && (
                  <div className="space-y-4 pb-3 animate-slide-up">
                    {story.loreSections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        {sec.heading && (
                          <h3 className="text-[13.5px] font-bold tracking-wide text-white italic">
                            {sec.heading}
                          </h3>
                        )}
                        {sec.image && (
                          <div className="rounded-xl overflow-hidden border border-white/10">
                            <img
                              src={sec.image}
                              alt={sec.heading ?? 'Lore scene'}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                        {sec.text && (
                          <p className="text-[13.5px] text-zinc-200 leading-relaxed font-medium">
                            {sec.text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setLoreExpanded((v) => !v)}
                  className="w-full py-2.5 rounded-xl bg-[#1d1d20] hover:bg-[#252529] border border-white/10 text-[13px] font-medium text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {loreExpanded ? (
                    <>
                      Fold <ChevronUp size={15} />
                    </>
                  ) : (
                    <>
                      View All <ChevronDown size={15} />
                    </>
                  )}
                </button>
              </div>

              {/* Setting -> Avatar Settings */}
              <div className="pt-3 border-t border-white/10">
                <h2 className="text-[15px] font-bold mb-2">Setting</h2>
                <div className="text-[12.5px] text-zinc-400 mb-1.5">Avatar Settings</div>
                <div className="relative">
                  <button
                    onClick={() => setAvatarMenuOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#1c1c1f] border border-white/10 text-[14px] text-white"
                  >
                    <span>{selectedAvatar}</span>
                    <ChevronDown size={16} className="text-zinc-400" />
                  </button>
                  {avatarMenuOpen && (
                    <div className="mt-1.5 rounded-xl bg-[#222225] border border-white/10 overflow-hidden shadow-xl">
                      {DEFAULT_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          onClick={() => {
                            onChangeAvatar(av.name);
                            setAvatarMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-sm border-b border-white/5 last:border-0 ${
                            selectedAvatar === av.name ? 'bg-white/10 text-white font-semibold' : 'text-zinc-300 hover:bg-white/5'
                          }`}
                        >
                          <div>{av.name}</div>
                          <div className="text-[11px] text-zinc-400">{av.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Prologue Preview */}
              <div className="pt-3 border-t border-white/10">
                <h2 className="text-[15px] font-bold mb-2">Prologue Preview</h2>
                <div className="rounded-xl bg-[#19191b] border border-white/10 p-3.5">
                  <p className="text-[13.5px] text-zinc-300 leading-relaxed whitespace-pre-line line-clamp-6">
                    {story.prologue}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Add Comment Box */}
            <div className="flex items-center gap-2 bg-[#1c1c1f] border border-white/10 rounded-xl px-3 py-2">
              <input
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                placeholder="Write a comment about this story..."
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              />
              <button
                onClick={handlePostComment}
                className="p-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>

            {comments.map((c) => (
              <div key={c.id} className="rounded-xl bg-[#1a1a1c] border border-white/10 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{c.author}</span>{' '}
                    <span className="text-zinc-500">{c.handle}</span>
                  </div>
                  <span className="text-zinc-500">{c.timeAgo}</span>
                </div>
                <p className="text-[13.5px] text-zinc-200 leading-relaxed">{c.text}</p>
                <div className="text-xs text-zinc-400 flex items-center gap-1 pt-0.5">
                  <ThumbsUp size={12} /> {c.likes}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-[#121213] via-[#121213] to-transparent flex gap-2">
        {hasExistingSession && onResumeSession && (
          <button
            onClick={onResumeSession}
            className="px-4 py-3 rounded-xl bg-[#252529] border border-white/15 text-white font-semibold text-[14px] hover:bg-[#2f2f35] transition-colors"
          >
            Resume
          </button>
        )}
        <button
          onClick={onStartNewSession}
          className="flex-1 py-3 rounded-xl bg-[#f4f4f5] hover:bg-white text-[#111113] font-bold text-[15px] shadow-lg transition-colors"
        >
          New Session
        </button>
      </div>
    </div>
  );
};
