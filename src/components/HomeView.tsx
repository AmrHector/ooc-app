import React, { useMemo, useState } from 'react';
import { Bell, ChevronDown, Tv, Search, X, Sparkles, UserCheck } from 'lucide-react';
import { FEATURED_STORIES, STORIES } from '../data/stories';
import { StoryItem } from '../types/ooc';

interface HomeViewProps {
  onSelectStory: (story: StoryItem) => void;
  onOpenNotifications: () => void;
}

const CATEGORIES = ['New Ranking', 'Rankings', 'Today', 'Fantasy', 'Academy', 'Romance', 'Action', 'Isekai', 'Urban', 'Sci-Fi'];

const FEATURED_CHARACTERS = [
  { id: 'ch1', name: 'Reina Vance', role: 'Crimson Vanguard', storyRank: 29, image: '/assets/scenes/party.jpg', chats: '1.8M', creator: 'Nuzelle' },
  { id: 'ch2', name: 'Seraphina Lumencia', role: 'Arch-Mage Heir', storyRank: 1, image: '/assets/covers/cover_001.jpg', chats: '4.2M', creator: 'OOC' },
  { id: 'ch3', name: 'Hana & Yuna', role: 'Menhera & Yandere Duo', storyRank: 47, image: '/assets/scenes/hero_menhera.jpg', chats: '980K', creator: 'OOC' },
  { id: 'ch4', name: 'Aoi Kurosawa', role: 'Monster Academy Bunny', storyRank: 20, image: '/assets/covers/cover_020.jpg', chats: '612K', creator: 'OOC' },
  { id: 'ch5', name: 'Astra', role: 'Shrine Blade Master', storyRank: 30, image: '/assets/covers/cover_030.jpg', chats: '1.1M', creator: 'OOC' },
  { id: 'ch6', name: 'Vespera', role: 'Void System Guide', storyRank: 35, image: '/assets/covers/cover_035.jpg', chats: '2.3M', creator: 'OOC' },
];

export const HomeView: React.FC<HomeViewProps> = ({ onSelectStory, onOpenNotifications }) => {
  const [topMode, setTopMode] = useState<'story' | 'character'>('story');
  const [activeCategory, setActiveCategory] = useState<string>('Rankings');
  const [timeFilter, setTimeFilter] = useState<'Daily' | 'Weekly' | 'All-Time'>('Daily');
  const [originFilter, setOriginFilter] = useState<'All' | 'Original' | 'Community'>('All');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [showOriginMenu, setShowOriginMenu] = useState(false);

  const featured = FEATURED_STORIES[featuredIdx];

  const filteredStories = useMemo(() => {
    let list = [...STORIES];
    if (activeCategory === 'New Ranking') {
      list = [...STORIES].sort((a, b) => b.rank - a.rank).slice(0, 50);
    } else if (activeCategory === 'Today') {
      list = STORIES.filter((s) => s.rank <= 40 || s.original);
    } else if (activeCategory !== 'Rankings') {
      list = STORIES.filter((s) => s.genre.toLowerCase() === activeCategory.toLowerCase());
    }

    if (originFilter === 'Original') {
      list = list.filter((s) => s.original);
    } else if (originFilter === 'Community') {
      list = list.filter((s) => !s.original);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeCategory, originFilter, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#121213] text-[#f5f5f7] overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2.5 shrink-0 bg-[#121213]/95 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTopMode('story')}
            className={`text-[21px] font-bold tracking-tight transition-colors ${
              topMode === 'story' ? 'text-white' : 'text-[#6e6e73]'
            }`}
          >
            Story
          </button>
          <button
            onClick={() => setTopMode('character')}
            className={`text-[21px] font-bold tracking-tight transition-colors ${
              topMode === 'character' ? 'text-white' : 'text-[#6e6e73]'
            }`}
          >
            Character
          </button>
        </div>

        <div className="flex items-center gap-4 text-[#e5e5e7]">
          <button
            onClick={() => setFeaturedIdx((prev) => (prev + 1) % FEATURED_STORIES.length)}
            title="Cycle spotlight"
            className="p-1 hover:text-white transition-colors"
          >
            <Tv size={20} strokeWidth={1.8} />
          </button>
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="relative p-1 hover:text-white transition-colors"
          >
            <Bell size={20} strokeWidth={1.8} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444]" />
          </button>
          <button
            onClick={() => setSearchOpen((v) => !v)}
            title="Search stories"
            className="p-1 hover:text-white transition-colors"
          >
            <Search size={20} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* Search Bar Drawer */}
      {searchOpen && (
        <div className="px-4 pb-2.5 shrink-0 animate-slide-up">
          <div className="flex items-center gap-2 bg-[#1e1e21] border border-white/10 rounded-xl px-3 py-2">
            <Search size={16} className="text-zinc-400 shrink-0" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Top 100 stories, genres, or authors..."
              className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none flex-1"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-white">
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto thin-scrollbar pb-20">
        {topMode === 'character' ? (
          <div className="px-4 pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold">Featured Characters</h2>
              <span className="text-xs text-zinc-400">Tap to enter their world</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FEATURED_CHARACTERS.map((char) => {
                const story = STORIES.find((s) => s.rank === char.storyRank) ?? STORIES[0];
                return (
                  <button
                    key={char.id}
                    onClick={() => onSelectStory(story)}
                    className="bg-[#1a1a1c] border border-white/10 rounded-2xl overflow-hidden text-left hover:border-white/25 transition-all group"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5">
                        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                          <UserCheck size={12} /> {char.role}
                        </div>
                        <div className="text-sm font-bold text-white truncate">{char.name}</div>
                        <div className="text-[11px] text-zinc-300">{char.chats}·{char.creator}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Spotlight Carousel (matches OOC blurred hero card) */}
            {!searchQuery && activeCategory === 'Rankings' && (
              <div
                onClick={() => {
                  const found = STORIES.find((s) => s.rank === featured.rank);
                  if (found) onSelectStory(found);
                }}
                className="relative mx-0 mb-3 overflow-hidden cursor-pointer select-none"
              >
                {/* Blurred backdrop */}
                <div
                  className="absolute inset-0 bg-cover bg-center scale-125 blur-2xl opacity-45"
                  style={{ backgroundImage: `url(${featured.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#121213]/30 via-[#121213]/40 to-[#121213]" />

                <div className="relative flex flex-col items-center pt-2 pb-4 px-5">
                  <div className="relative w-[178px] h-[238px] rounded-xl overflow-hidden shadow-2xl border border-white/15">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Page indicator 4/6 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeaturedIdx((prev) => (prev + 1) % FEATURED_STORIES.length);
                    }}
                    className="absolute top-3 right-4 bg-black/55 backdrop-blur-sm text-[11px] font-medium text-zinc-200 px-2 py-0.5 rounded-md border border-white/10"
                  >
                    {featuredIdx + 1}/{FEATURED_STORIES.length}
                  </button>

                  <h2 className="mt-2.5 text-center text-[19px] font-bold leading-tight text-white max-w-[300px] drop-shadow">
                    {featured.title}
                  </h2>
                  <p className="mt-1 text-center text-[12px] text-zinc-300 max-w-[290px] line-clamp-2">
                    {featured.subtitle}
                  </p>
                </div>
              </div>
            )}

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3.5 py-2">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                      active
                        ? 'border border-[#c8e635] text-[#c8e635] bg-[#c8e635]/10 font-semibold'
                        : 'border border-white/10 bg-[#1a1a1c] text-zinc-300 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Section Header: Top 100 + Daily v + All v */}
            <div className="flex items-center justify-between px-3.5 pt-2 pb-2.5 relative z-10">
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-bold tracking-tight text-white">
                  {activeCategory === 'Rankings' ? 'Top 100' : activeCategory}
                </h1>
                {searchQuery && (
                  <span className="text-xs text-zinc-400">({filteredStories.length} results)</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[13px] text-zinc-400">
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowTimeMenu((v) => !v);
                      setShowOriginMenu(false);
                    }}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {timeFilter} <ChevronDown size={14} />
                  </button>
                  {showTimeMenu && (
                    <div className="absolute right-0 mt-1.5 w-28 bg-[#222225] border border-white/10 rounded-xl shadow-xl py-1 z-30">
                      {(['Daily', 'Weekly', 'All-Time'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setTimeFilter(opt);
                            setShowTimeMenu(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 text-xs ${
                            timeFilter === opt ? 'text-[#c8e635] font-semibold' : 'text-zinc-300 hover:bg-white/5'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowOriginMenu((v) => !v);
                      setShowTimeMenu(false);
                    }}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {originFilter} <ChevronDown size={14} />
                  </button>
                  {showOriginMenu && (
                    <div className="absolute right-0 mt-1.5 w-32 bg-[#222225] border border-white/10 rounded-xl shadow-xl py-1 z-30">
                      {(['All', 'Original', 'Community'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setOriginFilter(opt);
                            setShowOriginMenu(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 text-xs ${
                            originFilter === opt ? 'text-[#c8e635] font-semibold' : 'text-zinc-300 hover:bg-white/5'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3-Column Top 100 Story Grid */}
            <div className="grid grid-cols-3 gap-x-2.5 gap-y-4 px-3.5 pb-6">
              {filteredStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => onSelectStory(story)}
                  className="text-left group focus:outline-none"
                >
                  <div className="relative aspect-[2/3] w-full rounded-[10px] overflow-hidden bg-[#1a1a1c] border border-white/5">
                    <img
                      src={story.cover}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                  </div>
                  <div className="mt-1.5 text-[12.5px] font-semibold leading-[1.25] text-[#f3f4f6] line-clamp-2 min-h-[31px]">
                    {story.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#8e8e93] truncate">
                    {story.views}·{story.author}
                  </div>
                </button>
              ))}
            </div>

            {filteredStories.length === 0 && (
              <div className="py-16 text-center text-zinc-400 text-sm">
                <Sparkles className="mx-auto mb-2 text-zinc-500" size={24} />
                No stories match your filter.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
