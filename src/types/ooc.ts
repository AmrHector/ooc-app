export type ModelTierId = 'max' | 'apex' | 'superb' | 'skillful' | 'extensive' | 'basic';

export interface ModelTier {
  id: ModelTierId;
  name: string;
  description: string;
  cost: number;
  geminiModel: string;
  color: string;
  badgeType: 'crown' | 'spark' | 'grid' | 'diamond' | 'star' | 'circle';
}

export type StatusDisplayMode = 'hidden' | 'minimal' | 'full';

export type MainTab = 'home' | 'history' | 'my-titles' | 'my';

export interface LoreSection {
  heading?: string;
  text?: string;
  image?: string;
}

export interface StoryComment {
  id: string;
  author: string;
  handle: string;
  timeAgo: string;
  text: string;
  likes: number;
}

export interface StoryItem {
  rank: number;
  id: string;
  title: string;
  views: string;
  author: string;
  original: boolean;
  cover: string;
  genre: string;
  audience: string;
  imageCount: number;
  tagline: string;
  tags: string[];
  likesCount: string;
  commentsCount: string;
  prologue: string;
  loreSections: LoreSection[];
  systemPrompt: string;
  openingChoices: string[];
  openingImage?: string;
  worldDefaults?: {
    date: string;
    location: string;
    time: string;
    bankName: string;
    currencySymbol: string;
    startingObjective: string;
  };
}

export interface HudState {
  date: string;
  location: string;
  time: string;
  bankLabel: string;
  cash: string;
  card: string;
  assets: string;
  inventory: string;
  adventurerCard: string;
  skillName: string;
  abilities: string[];
  objective: string;
  turn: number;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  hud?: HudState;
  infoBanner?: {
    title: string;
    detail?: string;
  };
  image?: string;
  choices?: string[];
  truncated?: boolean;
  isModePrompt?: boolean;
  isSkillPrompt?: boolean;
}

export interface StorySession {
  id: string;
  storyId: string;
  storyTitle: string;
  storyCover: string;
  tierId: ModelTierId;
  statusMode: StatusDisplayMode;
  avatarName: string;
  messages: ChatMessage[];
  unlockedImages: string[];
  userNotes: string;
  lengthDepth: 'Short' | 'Standard' | '1.5x Output' | 'Long';
  writingStyle: 'Immersive RPG' | 'Light Novel' | 'Gritty Realism' | 'Cinematic';
  memories: string[];
  viewSceneImage: boolean;
  updatedAt: number;
}

export interface AvatarProfile {
  id: string;
  name: string;
  description: string;
}
