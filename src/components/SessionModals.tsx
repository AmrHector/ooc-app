import React, { useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Film,
  HelpCircle,
  Lock,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { CREDIT_PACKAGES, DEFAULT_AVATARS, MODEL_TIERS } from '../data/models';
import { ModelTierId, StatusDisplayMode, StorySession } from '../types/ooc';
import { TierIcon } from './TierBadge';

/* -------------------------------------------------------------------------- */
/* 1. Model Tier Selector Bottom Sheet                                         */
/* -------------------------------------------------------------------------- */
export const TierSelectorModal: React.FC<{
  open: boolean;
  activeTier: ModelTierId;
  onSelect: (tier: ModelTierId) => void;
  onClose: () => void;
}> = ({ open, activeTier, onSelect, onClose }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/70 backdrop-blur-[2px] flex items-end justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] bg-[#19191b] border-t border-white/10 rounded-t-3xl px-4 pt-3 pb-6 space-y-2 animate-slide-up"
      >
        <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-2" />
        {MODEL_TIERS.map((tier) => {
          const selected = tier.id === activeTier;
          return (
            <button
              key={tier.id}
              onClick={() => {
                onSelect(tier.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-colors ${
                selected ? 'bg-white/10 border border-white/15' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-white">
                  <TierIcon tierId={tier.id} size={15} />
                  <span>{tier.name}</span>
                </div>
                <div className="text-[12.5px] text-zinc-400 mt-0.5">{tier.description}</div>
              </div>

              <div className="inline-flex items-center gap-1 text-[13px] font-medium text-zinc-300">
                <Film size={14} className="text-zinc-400" />
                <span>{tier.cost}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Right-Side Session Drawer                                                */
/* -------------------------------------------------------------------------- */
export const SessionDrawer: React.FC<{
  open: boolean;
  credits: number;
  session: StorySession;
  onClose: () => void;
  onOpenCredits: () => void;
  onOpenImage: (src: string) => void;
  onUpdateSession: (patch: Partial<StorySession>) => void;
  onResetSession: () => void;
}> = ({
  open,
  credits,
  session,
  onClose,
  onOpenCredits,
  onOpenImage,
  onUpdateSession,
  onResetSession,
}) => {
  const [subPanel, setSubPanel] = useState<
    null | 'guide' | 'avatars' | 'notes' | 'length' | 'style' | 'memories'
  >(null);
  const [notesDraft, setNotesDraft] = useState(session.userNotes);
  const [memoryDraft, setMemoryDraft] = useState('');

  if (!open) return null;

  return (
    <div onClick={onClose} className="absolute inset-0 z-40 bg-black/65 flex justify-end">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[86%] max-w-[360px] h-full bg-[#151517] border-l border-white/10 flex flex-col animate-slide-left overflow-y-auto thin-scrollbar"
      >
        {/* Top Row: Credits Pill */}
        <div className="flex items-center justify-end px-4 pt-3.5 pb-2">
          <button
            onClick={onOpenCredits}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222226] border border-white/10 text-[13.5px] font-bold text-white hover:bg-[#2b2b30]"
          >
            <Film size={14} className="text-zinc-300" />
            <span>{credits}</span>
          </button>
        </div>

        {subPanel ? (
          <div className="p-4 space-y-4 flex-1">
            <button
              onClick={() => setSubPanel(null)}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white"
            >
              <ChevronLeft size={16} /> Back to Settings
            </button>

            {subPanel === 'guide' && (
              <div className="space-y-3 text-sm text-zinc-300">
                <h3 className="text-base font-bold text-white">Play Guide</h3>
                <p>
                  Keep your User Notes updated at key milestones so the AI Dungeon Master remembers alliances,
                  debts, and hidden skills across long campaigns.
                </p>
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-bold uppercase text-zinc-400">Status Display Mode</div>
                  {(['hidden', 'minimal', 'full'] as StatusDisplayMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => onUpdateSession({ statusMode: m })}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-xs uppercase tracking-wider font-semibold ${
                        session.statusMode === m
                          ? 'border-[#c8e635] text-[#c8e635] bg-[#c8e635]/10'
                          : 'border-white/10 bg-[#1d1d20] text-zinc-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {subPanel === 'avatars' && (
              <div className="space-y-2.5">
                <h3 className="text-base font-bold text-white">Avatars</h3>
                {DEFAULT_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => {
                      onUpdateSession({ avatarName: av.name });
                      setSubPanel(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border ${
                      session.avatarName === av.name
                        ? 'border-[#c8e635] bg-[#c8e635]/10'
                        : 'border-white/10 bg-[#1c1c1f]'
                    }`}
                  >
                    <div className="font-semibold text-sm text-white">{av.name}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{av.description}</div>
                  </button>
                ))}
              </div>
            )}

            {subPanel === 'notes' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">User Notes</h3>
                <textarea
                  rows={7}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Write persistent rules, character goals, or world facts..."
                  className="w-full rounded-xl bg-[#1d1d20] border border-white/10 p-3 text-sm text-white outline-none"
                />
                <button
                  onClick={() => {
                    onUpdateSession({ userNotes: notesDraft });
                    setSubPanel(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-sm"
                >
                  Save Notes
                </button>
              </div>
            )}

            {subPanel === 'length' && (
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Length & Depth</h3>
                {(['Short', 'Standard', '1.5x Output', 'Long'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onUpdateSession({ lengthDepth: opt });
                      setSubPanel(null);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm ${
                      session.lengthDepth === opt
                        ? 'border-[#c8e635] bg-[#c8e635]/10 text-[#c8e635] font-semibold'
                        : 'border-white/10 bg-[#1c1c1f] text-zinc-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {subPanel === 'style' && (
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Writing Style</h3>
                {(['Immersive RPG', 'Light Novel', 'Gritty Realism', 'Cinematic'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onUpdateSession({ writingStyle: opt });
                      setSubPanel(null);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm ${
                      session.writingStyle === opt
                        ? 'border-[#c8e635] bg-[#c8e635]/10 text-[#c8e635] font-semibold'
                        : 'border-white/10 bg-[#1c1c1f] text-zinc-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {subPanel === 'memories' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Memories</h3>
                <div className="flex gap-2">
                  <input
                    value={memoryDraft}
                    onChange={(e) => setMemoryDraft(e.target.value)}
                    placeholder="Add key memory..."
                    className="flex-1 rounded-xl bg-[#1d1d20] border border-white/10 px-3 py-2 text-sm text-white outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!memoryDraft.trim()) return;
                      onUpdateSession({ memories: [...session.memories, memoryDraft.trim()] });
                      setMemoryDraft('');
                    }}
                    className="px-3 rounded-xl bg-white text-black text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {session.memories.length === 0 ? (
                    <p className="text-xs text-zinc-500">No pinned memories yet.</p>
                  ) : (
                    session.memories.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#1d1d20] border border-white/10 text-xs text-zinc-200"
                      >
                        <span>{m}</span>
                        <button
                          onClick={() =>
                            onUpdateSession({
                              memories: session.memories.filter((_, i) => i !== idx),
                            })
                          }
                          className="text-zinc-500 hover:text-white"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 pb-6 space-y-5">
            {/* Story Header */}
            <div className="flex items-center gap-3">
              <img
                src={session.storyCover}
                alt={session.storyTitle}
                className="w-10 h-12 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="text-[15px] font-semibold text-white truncate">
                {session.storyTitle}
              </div>
            </div>

            {/* Images X/50 Gallery */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[14px]">
                <span className="font-semibold text-white">Images</span>
                <span className="text-zinc-400">{session.unlockedImages.length}/50</span>
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  N
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {session.unlockedImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenImage(img)}
                    className="w-[74px] h-[74px] rounded-xl overflow-hidden border border-white/15 shrink-0"
                  >
                    <img src={img} alt="Unlocked" className="w-full h-full object-cover" />
                  </button>
                ))}
                <div className="w-[74px] h-[74px] rounded-xl bg-[#1f1f23] border border-white/10 flex items-center justify-center text-zinc-500 shrink-0">
                  <Lock size={18} />
                </div>
              </div>
            </div>

            {/* Session Settings List */}
            <div className="space-y-1">
              <div className="text-[12.5px] font-medium text-zinc-400 pb-1">Session Settings</div>

              {[
                { key: 'guide' as const, label: 'Play Guide', icon: BookOpen },
                { key: 'avatars' as const, label: 'Avatars', icon: User, sub: session.avatarName },
                { key: 'notes' as const, label: 'User Notes', icon: FileText },
                { key: 'length' as const, label: 'Length & Depth', icon: Clock, sub: session.lengthDepth },
                { key: 'style' as const, label: 'Writing Style', icon: Sparkles, sub: session.writingStyle },
                { key: 'memories' as const, label: 'Memories', icon: Film },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <button
                    key={row.key}
                    onClick={() => setSubPanel(row.key)}
                    className="w-full flex items-center justify-between py-2.5 px-1 text-left hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className="text-zinc-300" />
                      <div>
                        <div className="text-[14px] text-zinc-100">{row.label}</div>
                        {row.sub && <div className="text-[11px] text-zinc-500">{row.sub}</div>}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-500" />
                  </button>
                );
              })}

              {/* View Scene Image Toggle */}
              <div className="flex items-center justify-between py-2.5 px-1">
                <div className="flex items-center gap-3">
                  <Film size={17} className="text-zinc-300" />
                  <span className="text-[14px] text-zinc-100">View Scene Image</span>
                </div>
                <button
                  onClick={() => onUpdateSession({ viewSceneImage: !session.viewSceneImage })}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    session.viewSceneImage ? 'bg-[#c8e635]' : 'bg-zinc-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      session.viewSceneImage ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Starting Scenarios */}
            <div className="space-y-1 pt-2 border-t border-white/10">
              <div className="text-[12.5px] font-medium text-zinc-400 pb-1">Starting Scenarios</div>
              <button
                onClick={() => {
                  onResetSession();
                  onClose();
                }}
                className="w-full flex items-center justify-between py-2.5 px-1 hover:bg-white/5 rounded-xl"
              >
                <span className="text-[14px] text-zinc-100">Default (Restart Session)</span>
                <ChevronRight size={16} className="text-zinc-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. My Credit Screen Modal                                                   */
/* -------------------------------------------------------------------------- */
export const MyCreditModal: React.FC<{
  open: boolean;
  credits: number;
  onClose: () => void;
  onAddCredits: (amount: number) => void;
}> = ({ open, credits, onClose, onAddCredits }) => {
  const [tab, setTab] = useState<'buy' | 'auto' | 'free'>('buy');
  const [selectedPackId, setSelectedPackId] = useState('pack-first');
  const [purchasedMsg, setPurchasedMsg] = useState<string | null>(null);

  if (!open) return null;

  const selectedPack = CREDIT_PACKAGES.find((p) => p.id === selectedPackId) ?? CREDIT_PACKAGES[0];

  const handleBuy = () => {
    const total = selectedPack.credits + (selectedPack.bonus ?? 0);
    onAddCredits(total);
    setPurchasedMsg(`Added +${total.toLocaleString()} credits!`);
    setTimeout(() => setPurchasedMsg(null), 2200);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#121213] flex flex-col animate-slide-up">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 text-zinc-300 hover:text-white">
            <ChevronLeft size={22} />
          </button>
          <span className="text-[17px] font-bold text-white">My Credit</span>
          <HelpCircle size={16} className="text-zinc-400" />
        </div>
      </header>

      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <Film size={22} className="text-zinc-200" />
          <span>{credits.toLocaleString()}</span>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-[#1e1e21] border border-white/10 text-xs text-zinc-300">
          Credit History
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-white/10 px-2">
        {[
          { id: 'buy' as const, label: 'Buy Credits' },
          { id: 'auto' as const, label: 'Auto-Reload' },
          { id: 'free' as const, label: 'Free Credits' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-2.5 text-sm font-semibold relative ${
              tab === t.id ? 'text-white' : 'text-zinc-500'
            }`}
          >
            {t.label}
            {tab === t.id && <span className="absolute bottom-0 inset-x-3 h-[2px] bg-white" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-2.5 pb-24">
        {tab === 'buy' &&
          CREDIT_PACKAGES.map((pack) => {
            const active = selectedPackId === pack.id;
            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`w-full rounded-2xl p-3.5 text-left border transition-all ${
                  active
                    ? 'bg-[#1d2018] border-[#c8e635]'
                    : 'bg-[#19191b] border-white/10 hover:border-white/20'
                }`}
              >
                {pack.badge && (
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-[#c8e635] font-semibold">{pack.badge}</span>
                    <span className="text-zinc-400">⏱ {pack.timer}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        active ? 'border-[#c8e635]' : 'border-zinc-500'
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-[#c8e635]" />}
                    </span>
                    <div>
                      <div className="text-[15px] font-bold text-white">
                        {pack.credits.toLocaleString()} Credits
                      </div>
                      {pack.bonus > 0 && (
                        <div className="text-[11.5px] text-zinc-400">
                          +{pack.bonus.toLocaleString()} Bonus Credits
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {pack.originalPrice && (
                      <div className="text-[11px] text-zinc-500 line-through">
                        {pack.originalPrice}{' '}
                        <span className="text-[#c8e635] font-bold no-underline">{pack.discount}</span>
                      </div>
                    )}
                    {pack.popular && (
                      <div className="text-[10px] font-bold text-emerald-400">Popular</div>
                    )}
                    <div className="text-[14px] font-bold text-white">{pack.price}</div>
                  </div>
                </div>
              </button>
            );
          })}

        {tab === 'auto' && (
          <div className="rounded-2xl bg-[#19191b] border border-white/10 p-4 text-sm text-zinc-300 space-y-2">
            <div className="font-bold text-white">Auto-Reload</div>
            <p className="text-xs text-zinc-400">
              Automatically top up credits when your balance drops below 100. Note: Using your own Gemini API
              key runs turns directly via Google Gemini.
            </p>
          </div>
        )}

        {tab === 'free' && (
          <div className="rounded-2xl bg-[#19191b] border border-white/10 p-4 space-y-3">
            <div className="font-bold text-white text-sm">Daily Check-In Bonus</div>
            <p className="text-xs text-zinc-400">Claim +150 free credits right now for testing stories.</p>
            <button
              onClick={() => {
                onAddCredits(150);
                setPurchasedMsg('Claimed +150 Free Credits!');
                setTimeout(() => setPurchasedMsg(null), 2000);
              }}
              className="px-4 py-2 rounded-xl bg-[#c8e635] text-black font-bold text-xs"
            >
              Claim +150 Credits
            </button>
          </div>
        )}

        {purchasedMsg && (
          <div className="text-center text-sm font-semibold text-[#c8e635] pt-2">{purchasedMsg}</div>
        )}
      </div>

      {tab === 'buy' && (
        <div className="p-4 border-t border-white/10 bg-[#121213]">
          <button
            onClick={handleBuy}
            className="w-full py-3 rounded-xl bg-[#f4f4f5] hover:bg-white text-black font-bold text-[15px]"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};
