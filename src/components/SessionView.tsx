import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  Menu,
  MoreVertical,
  Pencil,
  Play,
  RotateCw,
  Share2,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import { MODEL_TIERS } from '../data/models';
import { ChatMessage, HudState, ModelTierId, StatusDisplayMode, StorySession } from '../types/ooc';
import { TierIcon } from './TierBadge';

interface SessionViewProps {
  session: StorySession;
  isGenerating: boolean;
  loadingStage: string;
  onBack: () => void;
  onOpenTierModal: () => void;
  onOpenDrawer: () => void;
  onSendAction: (action: string) => void;
  onStopGenerating: () => void;
  onRegenerateLast: () => void;
  onContinueGenerating: () => void;
  onSetStatusMode: (mode: StatusDisplayMode) => void;
  onOpenImage: (src: string) => void;
}

const SLASH_COMMANDS = [
  { cmd: '/status', desc: 'Inspect your full RPG status panel' },
  { cmd: '/inventory', desc: 'Examine carried items and equipment' },
  { cmd: '/timeskip 1 hour', desc: 'Advance time smoothly in the current area' },
  { cmd: '/ooc ', desc: 'Give a direct out-of-character instruction to the AI DM' },
  { cmd: '/roll d20', desc: 'Roll a 20-sided fate check for your next move' },
  { cmd: '/recap', desc: 'Summarize events and active quests so far' },
];

const renderFormattedParagraph = (text: string) => {
  // Highlight **word** or quoted dialogue lines cleanly
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="text-zinc-400 font-semibold">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

const InfoHudCard: React.FC<{
  hud: HudState;
  mode: StatusDisplayMode;
  defaultOpen?: boolean;
}> = ({ hud, mode, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  if (mode === 'hidden') return null;

  return (
    <div className="my-3 rounded-xl border border-white/15 bg-[#19191b] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-[#222225] border-b border-white/10 text-[11px] font-bold tracking-widest text-zinc-300"
      >
        <span>INFO</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="p-3.5 text-[13px] leading-relaxed text-zinc-200 space-y-2 font-sans">
          <div>
            📅 <span className="font-semibold text-white">Date:</span> {hud.date}
            {mode === 'full' && (
              <>
                {' / '}📍 <span className="font-semibold text-white">Location:</span>{' '}
                <span className="text-sky-300">{hud.location}</span>
              </>
            )}
            {' / '}🕒 <span className="font-semibold text-white">Time:</span> {hud.time}
          </div>

          <div className="space-y-0.5 text-zinc-300">
            <div>🏦 {hud.bankLabel}</div>
            <div>💵 Cash: {hud.cash}</div>
            <div>💳 Card: {hud.card}</div>
            {mode === 'full' && (
              <>
                <div>💎 Assets: {hud.assets}</div>
                <div>🎒 Inventory: {hud.inventory}</div>
                <div>🏷️ Adventurer Card: {hud.adventurerCard}</div>
              </>
            )}
          </div>

          <div className="space-y-0.5">
            <div>
              💠 <span className="font-semibold text-white">Skill:</span> 👁️ {hud.skillName}
            </div>
            {hud.abilities.map((ab, idx) => (
              <div key={idx} className="pl-4 text-zinc-300 text-[12.5px]">
                └ ⏱️ {ab}
              </div>
            ))}
          </div>

          {mode === 'full' && (
            <div className="pt-0.5">
              🎯 <span className="font-semibold text-white">Current Objective:</span> {hud.objective}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const SessionView: React.FC<SessionViewProps> = ({
  session,
  isGenerating,
  loadingStage,
  onBack,
  onOpenTierModal,
  onOpenDrawer,
  onSendAction,
  onStopGenerating,
  onRegenerateLast,
  onContinueGenerating,
  onSetStatusMode,
  onOpenImage,
}) => {
  const [input, setInput] = useState('');
  const [showSlashTip, setShowSlashTip] = useState(true);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tier = MODEL_TIERS.find((t) => t.id === session.tierId) ?? MODEL_TIERS[3];

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages.length, isGenerating]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distFromBottom > 180);
  };

  const handleSubmit = () => {
    const val = input.trim();
    if (!val || isGenerating) return;
    setInput('');
    setSlashMenuOpen(false);
    onSendAction(val);
  };

  const handleSelectChoice = (choice: string, immediate: boolean) => {
    if (isGenerating) return;
    // Detect status mode selection if it's a mode prompt
    const lower = choice.toLowerCase();
    if (lower.includes('with full')) onSetStatusMode('full');
    else if (lower.includes('choose minimal')) onSetStatusMode('minimal');
    else if (lower.includes('ignore the prompts')) onSetStatusMode('hidden');

    if (immediate) {
      onSendAction(choice);
    } else {
      setInput(choice);
    }
  };

  const latestAssistant = [...session.messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div className="flex flex-col h-full bg-[#121213] text-[#e5e5e7] relative overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-3 py-2.5 bg-[#121213] border-b border-white/[0.06] shrink-0 z-20">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-[15.5px] font-semibold text-white truncate">
            {session.storyTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenTierModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1e21] border border-white/10 text-[13px] font-medium text-white hover:bg-[#27272b] transition-colors"
          >
            <TierIcon tierId={tier.id as ModelTierId} size={14} />
            <span>{tier.name}</span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          <button
            onClick={onOpenDrawer}
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-300"
            title="Session Drawer"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Narrative Chat Stream */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto thin-scrollbar px-4 pt-3 space-y-5 ${
          showSlashTip ? 'pb-12' : 'pb-4'
        }`}
      >
        <div className="text-[13px] text-zinc-500 font-serif-narrative leading-relaxed">
          *This session is an AI fiction. No content is factual or real.*
        </div>

        {session.messages.map((msg, mIdx) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="pt-2 pb-1 border-b border-white/[0.07]">
                <div className="text-[16px] leading-relaxed font-serif-narrative text-zinc-100">
                  {msg.content}
                </div>
              </div>
            );
          }

          const paragraphs = msg.content.split(/\n\n+/);
          const isLastAssistant = latestAssistant?.id === msg.id;

          return (
            <div key={msg.id} className="space-y-3.5 animate-slide-up">
              {/* Optional RPG INFO HUD at top of turn */}
              {msg.hud && <InfoHudCard hud={msg.hud} mode={session.statusMode} />}

              {/* Narrative Paragraphs & Inline Tags */}
              <div className="font-serif-narrative text-[17px] leading-[1.68] text-[#d4d4d8] space-y-4">
                {paragraphs.map((para, pIdx) => {
                  const trimmed = para.trim();
                  if (trimmed === '[[INFO_BANNER]]' && msg.infoBanner) {
                    return (
                      <div
                        key={pIdx}
                        className="font-sans rounded-xl border border-white/15 bg-[#19191b] overflow-hidden my-2"
                      >
                        <div className="px-3.5 py-1.5 bg-[#222225] border-b border-white/10 text-[11px] font-bold tracking-widest text-zinc-300">
                          INFO
                        </div>
                        <div className="px-3.5 py-2.5 text-[14px] font-semibold text-white">
                          {msg.infoBanner.title}
                          {msg.infoBanner.detail && (
                            <div className="mt-1 text-[13px] font-normal text-zinc-300">
                              {msg.infoBanner.detail}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (trimmed === '[[IMAGE]]' && msg.image && session.viewSceneImage) {
                    return (
                      <div
                        key={pIdx}
                        onClick={() => onOpenImage(msg.image!)}
                        className="my-2 -mx-4 cursor-pointer overflow-hidden bg-black"
                      >
                        <img
                          src={msg.image}
                          alt="Scene illustration"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    );
                  }

                  if (trimmed.startsWith('C H O O S E')) {
                    return (
                      <div
                        key={pIdx}
                        className="font-sans text-[13px] tracking-[0.22em] font-semibold text-zinc-200 pt-2"
                      >
                        {trimmed}
                      </div>
                    );
                  }

                  return (
                    <p key={pIdx} className="whitespace-pre-line">
                      {renderFormattedParagraph(para)}
                    </p>
                  );
                })}
              </div>

              {/* Standalone Image if not placed via [[IMAGE]] token */}
              {msg.image && !msg.content.includes('[[IMAGE]]') && session.viewSceneImage && (
                <div
                  onClick={() => onOpenImage(msg.image!)}
                  className="my-2 -mx-4 cursor-pointer overflow-hidden bg-black"
                >
                  <img
                    src={msg.image}
                    alt="Scene illustration"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Skill Prompt Header + Play Guide on Opening Beat */}
              {msg.isSkillPrompt && (
                <div className="space-y-4 pt-2">
                  <div className="text-[13px] tracking-[0.2em] font-semibold text-zinc-200 uppercase">
                    CHOOSE YOUR SKILL
                  </div>
                  <div className="space-y-2.5 text-[14px] tracking-[0.15em] text-zinc-300 font-serif-narrative">
                    <div>» S H A P E S H I F T E R</div>
                    <div>» A D A P T A T I O N</div>
                    <div>» S K I L L   T H I E F</div>
                    <div>» A U T H O R I T Y</div>
                    <div>» B E A S T   T A M E R</div>
                  </div>
                  <div className="rounded-xl bg-[#19191b] border border-white/10 p-3.5 text-[13px] text-zinc-300 space-y-1.5">
                    <div className="font-semibold text-zinc-100">Play Guide</div>
                    <p>
                      For the best long-term experience, keep your User Notes updated at important moments. AI
                      memory can sometimes deteriorate over very long sessions.
                    </p>
                    <p className="text-zinc-400 text-[12px]">
                      • 1.5x output Length is recommended for Full mode. You can configure this anytime in the
                      right Sidebar → Play Guide.
                    </p>
                  </div>
                </div>
              )}

              {/* Interactive Status Display Preview Examples (HIDDEN / MINIMAL / FULL) */}
              {msg.isModePrompt && (
                <div className="space-y-4 pt-1">
                  <div className="rounded-xl border border-white/10 bg-[#171719] p-3.5 space-y-1.5">
                    <div className="text-[13px] tracking-[0.18em] font-semibold text-zinc-200">
                      » H I D D E N
                    </div>
                    <p className="text-[13.5px] font-serif-narrative text-zinc-300">
                      Your Status panel is never shown unless a specific system demands it. You navigate the
                      world blind—by memory and instinct alone.
                    </p>
                    <div className="text-[12px] italic text-zinc-500">
                      Example: No panel is ever displayed. You simply... play.
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#171719] p-3.5 space-y-2">
                    <div className="text-[13px] tracking-[0.18em] font-semibold text-zinc-200">
                      » M I N I M A L
                    </div>
                    <p className="text-[13.5px] font-serif-narrative text-zinc-300">
                      A compact readout. Only your finances, date, time, skill, and stolen abilities are
                      tracked visibly.
                    </p>
                    <InfoHudCard
                      hud={{
                        date: 'Monday, Jan 1, 742 A.E.',
                        location: '',
                        time: '8:00 AM',
                        bankLabel: 'Aurel Bank: Haven (0 km)',
                        cash: '₳0',
                        card: '₳0',
                        assets: 'None',
                        inventory: 'None',
                        adventurerCard: 'Unregistered',
                        skillName: 'Skill Thief',
                        abilities: ['Time Stop (5 sec) — 30s cooldown'],
                        objective: '—',
                        turn: 1,
                      }}
                      mode="minimal"
                    />
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#171719] p-3.5 space-y-2">
                    <div className="text-[13px] tracking-[0.18em] font-semibold text-zinc-200">
                      » F U L L
                    </div>
                    <p className="text-[13.5px] font-serif-narrative text-zinc-300">
                      The complete Status panel—every system tracked, every detail visible at all times.
                    </p>
                    <InfoHudCard
                      hud={{
                        date: 'Monday, Jan 1, 742 A.E.',
                        location: 'Aetheria / Arden / — / — / —',
                        time: '8:00 AM',
                        bankLabel: 'Aurel Bank: Haven (265 km)',
                        cash: '₳0',
                        card: '₳0',
                        assets: 'None',
                        inventory: 'None',
                        adventurerCard: 'Unregistered',
                        skillName: 'Skill Thief',
                        abilities: ['Time Stop (5 sec) — 30s cooldown'],
                        objective: '—',
                        turn: 1,
                      }}
                      mode="full"
                    />
                  </div>
                </div>
              )}

              {/* Message Action Bar */}
              <div className="flex items-center justify-between pt-1 text-zinc-400">
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(msg.content).catch(() => {});
                      setCopiedMsgId(msg.id);
                      setTimeout(() => setCopiedMsgId(null), 1500);
                    }}
                    className="hover:text-white transition-colors"
                    title="Copy response"
                  >
                    <Copy size={15} />
                  </button>
                  {isLastAssistant && (
                    <button
                      onClick={onRegenerateLast}
                      className="hover:text-white transition-colors"
                      title="Regenerate response"
                    >
                      <RotateCw size={15} />
                    </button>
                  )}
                  <button className="hover:text-white transition-colors" title="Share">
                    <Share2 size={15} />
                  </button>
                  <button className="hover:text-white transition-colors" title="More">
                    <MoreVertical size={15} />
                  </button>
                  {copiedMsgId === msg.id && (
                    <span className="text-[11px] text-[#c8e635]">Copied</span>
                  )}
                </div>

                {isLastAssistant && !isGenerating && (
                  <button
                    onClick={onContinueGenerating}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1e21] border border-white/10 text-[12px] text-zinc-300 hover:text-white hover:bg-[#27272b] transition-colors"
                  >
                    <Sparkles size={12} className="text-amber-300" />
                    Continue generating
                  </button>
                )}
              </div>

              {/* Suggested Action Cards (only on latest assistant turn) */}
              {isLastAssistant && msg.choices && msg.choices.length > 0 && !isGenerating && (
                <div className="space-y-2 pt-2">
                  {msg.choices.map((choice, cIdx) => {
                    const firstDot = choice.indexOf('.');
                    const lead = firstDot > 0 && firstDot < 55 ? choice.slice(0, firstDot + 1) : '';
                    const rest = lead ? choice.slice(firstDot + 1) : choice;

                    return (
                      <div
                        key={cIdx}
                        className="flex items-center gap-2.5 rounded-2xl bg-[#19191b] border border-white/[0.09] px-3 py-2.5 hover:border-white/20 transition-colors"
                      >
                        <button
                          onClick={() => handleSelectChoice(choice, false)}
                          title="Edit into input"
                          className="p-1.5 text-zinc-400 hover:text-white shrink-0"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => handleSelectChoice(choice, true)}
                          className="flex-1 text-left text-[13.5px] leading-snug text-zinc-300 font-serif-narrative"
                        >
                          {lead && <span className="font-semibold text-white">{lead}</span>}
                          <span>{rest}</span>
                        </button>

                        <button
                          onClick={() => handleSelectChoice(choice, true)}
                          title="Send immediately"
                          className="w-7 h-7 rounded-full bg-[#242428] hover:bg-white hover:text-black flex items-center justify-center text-zinc-300 shrink-0 transition-colors"
                        >
                          <ArrowUp size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Multi-stage Loading Indicator */}
        {isGenerating && (
          <div className="py-3 space-y-2 animate-slide-up">
            <div className="flex items-center gap-2 text-[14px] text-zinc-400 font-serif-narrative">
              <span className="inline-block w-2 h-2 rounded-full bg-[#c8e635] animate-pulse-soft" />
              <span>{loadingStage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute right-4 bottom-20 w-9 h-9 rounded-full bg-white text-black shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-20"
        >
          <ChevronDown size={18} />
        </button>
      )}

      {/* Slash Commands Menu */}
      {slashMenuOpen && (
        <div className="mx-3 mb-2 rounded-2xl bg-[#1d1d20] border border-white/15 shadow-2xl overflow-hidden z-30 animate-slide-up">
          <div className="px-3.5 py-2 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Slash Commands
          </div>
          {SLASH_COMMANDS.map((sc) => (
            <button
              key={sc.cmd}
              onClick={() => {
                setInput(sc.cmd);
                setSlashMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-white/5 flex items-center justify-between gap-3 border-b border-white/5 last:border-0"
            >
              <span className="text-xs font-mono text-[#c8e635]">{sc.cmd}</span>
              <span className="text-xs text-zinc-400 truncate">{sc.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Bar */}
      <div className="relative px-3 pb-3 pt-1.5 bg-[#121213] border-t border-white/[0.06] shrink-0">
        {showSlashTip && (
          <div className="absolute -top-9 right-12 bg-[#f4f4f5] text-[#111113] text-[12px] font-medium px-3 py-1 rounded-lg shadow-lg flex items-center gap-2 z-20">
            <span>Try slash commands</span>
            <button onClick={() => setShowSlashTip(false)} className="text-zinc-600 hover:text-black">
              <X size={13} />
            </button>
            <div className="absolute -bottom-1 right-6 w-2.5 h-2.5 bg-[#f4f4f5] rotate-45" />
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-[#1c1c1f] border border-white/10 rounded-2xl pl-3.5 pr-1.5 py-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="What do you do?"
            className="flex-1 bg-transparent text-[14px] text-white placeholder-zinc-500 outline-none min-w-0"
          />

          <button
            onClick={() => setInput((v) => (v ? `${v} *...*` : '*...*'))}
            title="Insert action formatting"
            className="w-8 h-8 rounded-full border border-white/10 bg-[#252529] text-zinc-300 hover:text-white flex items-center justify-center text-sm font-bold shrink-0"
          >
            *
          </button>

          <button
            onClick={() => {
              setSlashMenuOpen((v) => !v);
              setShowSlashTip(false);
            }}
            title="Slash commands"
            className="w-8 h-8 rounded-full border border-white/10 bg-[#252529] text-zinc-300 hover:text-white flex items-center justify-center text-sm font-bold shrink-0"
          >
            /
          </button>

          <button
            onClick={() => onOpenDrawer()}
            title="Notes & Length Settings"
            className="w-8 h-8 rounded-full border border-white/10 bg-[#252529] text-zinc-300 hover:text-white flex items-center justify-center text-xs font-semibold shrink-0"
          >
            =±
          </button>

          {isGenerating ? (
            <button
              onClick={onStopGenerating}
              title="Stop generating"
              className="w-9 h-9 rounded-xl bg-zinc-200 text-black flex items-center justify-center shrink-0 hover:bg-white"
            >
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              title="Send action"
              className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0 hover:bg-zinc-200 transition-colors"
            >
              <Play size={14} fill="currentColor" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
