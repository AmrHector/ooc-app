import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { HomeView } from './components/HomeView';
import { MyCreditModal, SessionDrawer, TierSelectorModal } from './components/SessionModals';
import { SessionView } from './components/SessionView';
import { StoryInfoView } from './components/StoryInfoView';
import { BottomNav, HistoryView, MyProfileView, MyTitlesView } from './components/TabsAndNav';
import { DEFAULT_AVATARS, MODEL_TIERS } from './data/models';
import { STORIES } from './data/stories';
import { generateDmTurn } from './services/geminiDm';
import {
  ChatMessage,
  MainTab,
  ModelTierId,
  StatusDisplayMode,
  StoryItem,
  StorySession,
} from './types/ooc';

const STORAGE_SESSIONS = 'ooc_sessions_v1';
const STORAGE_CREDITS = 'ooc_credits_v1';
const STORAGE_LIKED = 'ooc_liked_v1';
const STORAGE_CUSTOM = 'ooc_custom_stories_v1';
const STORAGE_API_KEY = 'ooc_gemini_api_key_v1';

function createInitialSession(story: StoryItem, avatarName: string): StorySession {
  const isOpSkill2 = story.rank === 29;
  const openingMsg: ChatMessage = {
    id: `m-${Date.now()}`,
    role: 'assistant',
    content: story.prologue,
    image: story.openingImage,
    isSkillPrompt: isOpSkill2,
    choices: story.openingChoices,
  };

  return {
    id: `sess-${story.id}-${Date.now()}`,
    storyId: story.id,
    storyTitle: story.title,
    storyCover: story.rank === 29 ? '/assets/scenes/op_skill_2_cover.jpg' : story.cover,
    tierId: isOpSkill2 ? 'superb' : 'skillful',
    statusMode: 'full',
    avatarName,
    messages: [openingMsg],
    unlockedImages: story.openingImage ? [story.openingImage] : [],
    userNotes: '',
    lengthDepth: 'Standard',
    writingStyle: 'Immersive RPG',
    memories: [],
    viewSceneImage: true,
    updatedAt: Date.now(),
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [sessions, setSessions] = useState<StorySession[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SESSIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [credits, setCredits] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CREDITS);
      return raw ? Number(raw) : 650;
    } catch {
      return 650;
    }
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_LIKED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [customStories, setCustomStories] = useState<StoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_API_KEY) ?? '';
  });

  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATARS[0].name);
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Syncing your actions to the universe...');
  const cancelRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CREDITS, String(credits));
  }, [credits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LIKED, JSON.stringify(likedIds));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(customStories));
  }, [customStories]);

  const allStories = useMemo(() => [...customStories, ...STORIES], [customStories]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );

  const updateSession = (sessionId: string, patch: Partial<StorySession>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, ...patch, updatedAt: Date.now() } : s)),
    );
  };

  const handleStartNewSession = (story: StoryItem) => {
    const newSess = createInitialSession(story, selectedAvatar);
    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
    setSelectedStory(null);
  };

  const handleResumeForStory = (story: StoryItem) => {
    const existing = sessions.find((s) => s.storyId === story.id);
    if (existing) {
      setActiveSessionId(existing.id);
      setSelectedStory(null);
    }
  };

  const runTurn = async (session: StorySession, actionText: string, replaceLastAssistant = false) => {
    const story = allStories.find((st) => st.id === session.storyId) ?? STORIES[28];
    const tier = MODEL_TIERS.find((t) => t.id === session.tierId) ?? MODEL_TIERS[3];

    cancelRef.current = false;
    setIsGenerating(true);
    setLoadingStage('Syncing your actions to the universe...');

    const stageTimer1 = setTimeout(() => {
      if (!cancelRef.current) setLoadingStage('Weaving new events into the story...');
    }, 550);
    const stageTimer2 = setTimeout(() => {
      if (!cancelRef.current) setLoadingStage('Calculating story outcomes...');
    }, 1250);

    let baseMessages = [...session.messages];
    if (replaceLastAssistant) {
      // Drop trailing assistant message to regenerate
      if (baseMessages[baseMessages.length - 1]?.role === 'assistant') {
        baseMessages = baseMessages.slice(0, -1);
      }
    } else {
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: actionText,
      };
      baseMessages = [...baseMessages, userMsg];
      updateSession(session.id, { messages: baseMessages });
    }

    try {
      const result = await generateDmTurn({
        apiKey,
        story,
        messages: baseMessages,
        userAction: actionText,
        tierId: session.tierId,
        avatarName: session.avatarName,
        userNotes: session.userNotes,
        lengthDepth: session.lengthDepth,
        writingStyle: session.writingStyle,
        memories: session.memories,
      });

      if (cancelRef.current) return;

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: result.narrative,
        hud: result.hud,
        infoBanner: result.infoBanner,
        image: result.image,
        choices: result.choices,
        isModePrompt: result.modePrompt,
      };

      const nextUnlocked = result.image && !session.unlockedImages.includes(result.image)
        ? [...session.unlockedImages, result.image]
        : session.unlockedImages;

      updateSession(session.id, {
        messages: [...baseMessages, aiMsg],
        unlockedImages: nextUnlocked,
      });

      setCredits((c) => Math.max(0, c - tier.cost));
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setIsGenerating(false);
    }
  };

  const handleSendAction = (actionText: string) => {
    if (!activeSession || isGenerating) return;
    runTurn(activeSession, actionText, false);
  };

  const handleRegenerateLast = () => {
    if (!activeSession || isGenerating) return;
    const lastUser = [...activeSession.messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    runTurn(activeSession, lastUser.content, true);
  };

  const handleContinueGenerating = () => {
    if (!activeSession || isGenerating) return;
    runTurn(activeSession, 'Continue the current scene seamlessly with more detail.', false);
  };

  const handleCreateCustomStory = (title: string, genre: string, premise: string) => {
    const newStory: StoryItem = {
      rank: 101 + customStories.length,
      id: `custom-${Date.now()}`,
      title,
      views: '1',
      author: selectedAvatar,
      original: true,
      cover: '/assets/covers/cover_035.jpg',
      genre,
      audience: 'All-oriented',
      imageCount: 10,
      tagline: premise,
      tags: [`#${genre}`, '#Custom', '#OOC'],
      likesCount: '1',
      commentsCount: '0',
      prologue: `${premise}\n\nYour journey begins right here. What is your first move?`,
      loreSections: [{ heading: title, text: premise }],
      openingChoices: [
        'Observe the area closely and assess who is nearby.',
        'Act boldly and set the tone immediately.',
        'Check my status and abilities before moving.',
      ],
      systemPrompt: `You are the AI Dungeon Master for "${title}" (${genre}). Premise: ${premise}. Write vivid interactive RPG prose.`,
    };
    setCustomStories((prev) => [newStory, ...prev]);
    handleStartNewSession(newStory);
  };

  return (
    <div className="h-full w-full bg-[#070708] flex items-center justify-center overflow-hidden">
      {/* Mobile-first phone shell (full-screen on mobile, clean phone frame on desktop) */}
      <div className="relative w-full h-full md:max-w-[430px] md:h-[min(94vh,880px)] md:rounded-[34px] md:border md:border-white/15 md:shadow-[0_24px_80px_rgba(0,0,0,0.85)] bg-[#121213] flex flex-col overflow-hidden">
        {activeSession ? (
          <SessionView
            session={activeSession}
            isGenerating={isGenerating}
            loadingStage={loadingStage}
            onBack={() => setActiveSessionId(null)}
            onOpenTierModal={() => setTierModalOpen(true)}
            onOpenDrawer={() => setDrawerOpen(true)}
            onSendAction={handleSendAction}
            onStopGenerating={() => {
              cancelRef.current = true;
              setIsGenerating(false);
            }}
            onRegenerateLast={handleRegenerateLast}
            onContinueGenerating={handleContinueGenerating}
            onSetStatusMode={(mode: StatusDisplayMode) =>
              updateSession(activeSession.id, { statusMode: mode })
            }
            onOpenImage={(src) => setLightboxImage(src)}
          />
        ) : selectedStory ? (
          <StoryInfoView
            story={selectedStory}
            liked={likedIds.includes(selectedStory.id)}
            selectedAvatar={selectedAvatar}
            hasExistingSession={sessions.some((s) => s.storyId === selectedStory.id)}
            onChangeAvatar={setSelectedAvatar}
            onToggleLike={() =>
              setLikedIds((prev) =>
                prev.includes(selectedStory.id)
                  ? prev.filter((id) => id !== selectedStory.id)
                  : [...prev, selectedStory.id],
              )
            }
            onBack={() => setSelectedStory(null)}
            onStartNewSession={() => handleStartNewSession(selectedStory)}
            onResumeSession={() => handleResumeForStory(selectedStory)}
          />
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              {activeTab === 'home' && (
                <HomeView
                  onSelectStory={(story) => setSelectedStory(story)}
                  onOpenNotifications={() => setNotificationsOpen(true)}
                />
              )}
              {activeTab === 'history' && (
                <HistoryView
                  sessions={sessions}
                  onOpenSession={(sid) => setActiveSessionId(sid)}
                  onDeleteSession={(sid) =>
                    setSessions((prev) => prev.filter((s) => s.id !== sid))
                  }
                />
              )}
              {activeTab === 'my-titles' && (
                <MyTitlesView
                  likedStories={allStories.filter((s) => likedIds.includes(s.id))}
                  customStories={customStories}
                  onSelectStory={(story) => setSelectedStory(story)}
                  onCreateCustomStory={handleCreateCustomStory}
                />
              )}
              {activeTab === 'my' && (
                <MyProfileView
                  credits={credits}
                  apiKey={apiKey}
                  selectedAvatar={selectedAvatar}
                  onChangeAvatar={setSelectedAvatar}
                  onSaveApiKey={(k) => {
                    setApiKey(k);
                    localStorage.setItem(STORAGE_API_KEY, k);
                  }}
                  onOpenCredits={() => setCreditModalOpen(true)}
                />
              )}
            </div>
            <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
          </>
        )}

        {/* Modals & Drawers */}
        {activeSession && (
          <>
            <TierSelectorModal
              open={tierModalOpen}
              activeTier={activeSession.tierId}
              onSelect={(tierId: ModelTierId) => updateSession(activeSession.id, { tierId })}
              onClose={() => setTierModalOpen(false)}
            />
            <SessionDrawer
              open={drawerOpen}
              credits={credits}
              session={activeSession}
              onClose={() => setDrawerOpen(false)}
              onOpenCredits={() => {
                setDrawerOpen(false);
                setCreditModalOpen(true);
              }}
              onOpenImage={(src) => setLightboxImage(src)}
              onUpdateSession={(patch) => updateSession(activeSession.id, patch)}
              onResetSession={() => {
                const story = allStories.find((s) => s.id === activeSession.storyId);
                if (story) {
                  const fresh = createInitialSession(story, activeSession.avatarName);
                  setSessions((prev) =>
                    prev.map((s) => (s.id === activeSession.id ? { ...fresh, id: s.id } : s)),
                  );
                }
              }}
            />
          </>
        )}

        <MyCreditModal
          open={creditModalOpen}
          credits={credits}
          onClose={() => setCreditModalOpen(false)}
          onAddCredits={(amt) => setCredits((c) => c + amt)}
        />

        {/* Notifications Sheet */}
        {notificationsOpen && (
          <div
            onClick={() => setNotificationsOpen(false)}
            className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] rounded-2xl bg-[#19191b] border border-white/15 p-4 space-y-3 animate-slide-up"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Bell size={16} className="text-[#c8e635]" /> Notifications
                </div>
                <button onClick={() => setNotificationsOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="p-3 rounded-xl bg-[#222226] border border-white/5">
                  <div className="font-semibold text-white">Daily Top 100 Updated</div>
                  <div className="text-zinc-400 mt-0.5">
                    Lumencia Academy (#1) & Reincarnated With an OP Skill 2 (#29) are trending today.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#222226] border border-white/5">
                  <div className="font-semibold text-white">Gemini AI Dungeon Master Ready</div>
                  <div className="text-zinc-400 mt-0.5">
                    Add your Gemini API key in MY to unlock live AI narration across all 100 stories.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Image Lightbox */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-3"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center"
            >
              <X size={20} />
            </button>
            <img
              src={lightboxImage}
              alt="Scene preview"
              className="max-w-full max-h-[90vh] rounded-xl object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
