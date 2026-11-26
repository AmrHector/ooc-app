import React, { useState } from 'react';
import {
  Check,
  Clock,
  Film,
  Home,
  KeyRound,
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import { DEFAULT_AVATARS } from '../data/models';
import { MainTab, StoryItem, StorySession } from '../types/ooc';

/* -------------------------------------------------------------------------- */
/* Bottom Navigation Bar (4 Tabs matching OOC)                                 */
/* -------------------------------------------------------------------------- */
export const BottomNav: React.FC<{
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
}> = ({ activeTab, onChangeTab }) => {
  const items: { id: MainTab; label: string; icon: React.FC<{ size?: number; fill?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: MessageSquare },
    { id: 'my-titles', label: 'My Titles', icon: Zap },
    { id: 'my', label: 'MY', icon: User },
  ];

  return (
    <nav className="grid grid-cols-4 bg-[#121213] border-t border-white/[0.08] py-1.5 px-2 shrink-0 z-20">
      {items.map((item) => {
        const active = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors ${
              active ? 'text-white' : 'text-[#6e6e73] hover:text-zinc-300'
            }`}
          >
            <Icon size={20} fill={active ? 'currentColor' : 'none'} />
            <span className="text-[10.5px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

/* -------------------------------------------------------------------------- */
/* History Tab                                                                 */
/* -------------------------------------------------------------------------- */
export const HistoryView: React.FC<{
  sessions: StorySession[];
  onOpenSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}> = ({ sessions, onOpenSession, onDeleteSession }) => {
  return (
    <div className="flex flex-col h-full bg-[#121213] text-white p-4 overflow-y-auto thin-scrollbar pb-20">
      <h1 className="text-[21px] font-bold mb-4">History</h1>

      {sessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 px-6">
          <Clock size={34} className="mb-3 text-zinc-600" />
          <div className="text-sm font-semibold text-zinc-200">No active sessions yet</div>
          <p className="text-xs text-zinc-500 mt-1">
            Open any story from the Top 100 catalog and tap New Session to begin playing.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const lastMsg = s.messages[s.messages.length - 1];
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#19191b] border border-white/10"
              >
                <button
                  onClick={() => onOpenSession(s.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <img
                    src={s.storyCover}
                    alt={s.storyTitle}
                    className="w-12 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-bold text-white truncate">{s.storyTitle}</div>
                    <div className="text-[11.5px] text-zinc-400 mt-0.5">
                      {s.messages.length} turns • {s.avatarName}
                    </div>
                    <div className="text-[12px] text-zinc-500 truncate mt-1">
                      {lastMsg?.content.slice(0, 75)}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onDeleteSession(s.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete session"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* My Titles Tab (Liked Stories + Create Custom AI Story)                      */
/* -------------------------------------------------------------------------- */
export const MyTitlesView: React.FC<{
  likedStories: StoryItem[];
  customStories: StoryItem[];
  onSelectStory: (story: StoryItem) => void;
  onCreateCustomStory: (title: string, genre: string, premise: string) => void;
}> = ({ likedStories, customStories, onSelectStory, onCreateCustomStory }) => {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Fantasy');
  const [premise, setPremise] = useState('');

  const handleCreate = () => {
    if (!title.trim() || !premise.trim()) return;
    onCreateCustomStory(title.trim(), genre, premise.trim());
    setTitle('');
    setPremise('');
    setCreating(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#121213] text-white p-4 overflow-y-auto thin-scrollbar pb-20 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[21px] font-bold">My Titles</h1>
        <button
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c8e635] text-black text-xs font-bold"
        >
          <Plus size={14} /> Create Story
        </button>
      </div>

      {creating && (
        <div className="rounded-2xl bg-[#19191b] border border-white/15 p-4 space-y-3 animate-slide-up">
          <div className="text-sm font-bold">Create Custom AI Dungeon Master Story</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story title..."
            className="w-full rounded-xl bg-[#222226] border border-white/10 px-3 py-2 text-sm text-white outline-none"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-xl bg-[#222226] border border-white/10 px-3 py-2 text-sm text-white outline-none"
          >
            {['Fantasy', 'Academy', 'Romance', 'Action', 'Isekai', 'Urban', 'Sci-Fi'].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <textarea
            rows={4}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            placeholder="World premise, starting system, or opening hook..."
            className="w-full rounded-xl bg-[#222226] border border-white/10 px-3 py-2 text-sm text-white outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-sm"
            >
              Publish & Play
            </button>
            <button
              onClick={() => setCreating(false)}
              className="px-4 py-2.5 rounded-xl bg-[#252529] text-zinc-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom Stories */}
      {customStories.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Created by You</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {customStories.map((s) => (
              <button key={s.id} onClick={() => onSelectStory(s)} className="text-left">
                <img
                  src={s.cover}
                  alt={s.title}
                  className="w-full aspect-[2/3] rounded-xl object-cover border border-white/10"
                />
                <div className="mt-1 text-xs font-semibold line-clamp-2">{s.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liked / Saved Stories */}
      <div className="space-y-2.5">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Liked Stories</h2>
        {likedStories.length === 0 ? (
          <div className="rounded-2xl bg-[#19191b] border border-white/10 p-6 text-center text-zinc-400 text-xs">
            <Sparkles size={20} className="mx-auto mb-2 text-zinc-500" />
            Tap the thumbs-up button on any story's Information page to bookmark it here.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {likedStories.map((s) => (
              <button key={s.id} onClick={() => onSelectStory(s)} className="text-left">
                <img
                  src={s.cover}
                  alt={s.title}
                  className="w-full aspect-[2/3] rounded-xl object-cover border border-white/10"
                />
                <div className="mt-1 text-xs font-semibold line-clamp-2">{s.title}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MY Profile + Gemini API Key Configuration Tab                               */
/* -------------------------------------------------------------------------- */
export const MyProfileView: React.FC<{
  credits: number;
  apiKey: string;
  selectedAvatar: string;
  onChangeAvatar: (name: string) => void;
  onSaveApiKey: (key: string) => void;
  onOpenCredits: () => void;
}> = ({ credits, apiKey, selectedAvatar, onChangeAvatar, onSaveApiKey, onOpenCredits }) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#121213] text-white p-4 overflow-y-auto thin-scrollbar pb-20 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[21px] font-bold">MY</h1>
        <button
          onClick={onOpenCredits}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222226] border border-white/10 text-sm font-bold"
        >
          <Film size={15} /> {credits}
        </button>
      </div>

      {/* User Card */}
      <div className="rounded-2xl bg-[#19191b] border border-white/10 p-4 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center font-bold text-lg text-black">
          {selectedAvatar.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-[16px]">{selectedAvatar}</div>
          <div className="text-xs text-zinc-400">OOC Adventurer • Gemini DM Enabled</div>
        </div>
      </div>

      {/* Gemini AI Dungeon Master Key */}
      <div className="rounded-2xl bg-[#19191b] border border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm">
          <KeyRound size={16} className="text-[#c8e635]" />
          <span>Gemini AI Dungeon Master Key</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Enter your Google Gemini API key (saved locally in this device/browser) to power live AI
          Dungeon Master storytelling across all 100 stories and all 6 quality tiers. Without a key, the
          built-in interactive prologue & fallback DM still runs seamlessly.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="AIza..."
          className="w-full rounded-xl bg-[#222226] border border-white/10 px-3 py-2.5 text-sm text-white outline-none"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#f4f4f5] text-black font-bold text-xs inline-flex items-center gap-1.5"
          >
            <Check size={14} /> Save Gemini Key
          </button>
          {apiKey && (
            <span className="text-xs text-emerald-400 font-medium">● Connected</span>
          )}
          {savedBanner && <span className="text-xs text-[#c8e635]">Saved!</span>}
        </div>
      </div>

      {/* Active Avatar Selector */}
      <div className="rounded-2xl bg-[#19191b] border border-white/10 p-4 space-y-2.5">
        <div className="font-bold text-sm">Default Avatar Persona</div>
        {DEFAULT_AVATARS.map((av) => (
          <button
            key={av.id}
            onClick={() => onChangeAvatar(av.name)}
            className={`w-full text-left p-3 rounded-xl border transition-colors ${
              selectedAvatar === av.name
                ? 'border-[#c8e635] bg-[#c8e635]/10'
                : 'border-white/10 bg-[#222226]'
            }`}
          >
            <div className="text-sm font-semibold">{av.name}</div>
            <div className="text-xs text-zinc-400 mt-0.5">{av.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
