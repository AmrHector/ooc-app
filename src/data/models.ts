import { AvatarProfile, ModelTier } from '../types/ooc';

export const MODEL_TIERS: ModelTier[] = [
  {
    id: 'max',
    name: 'Max',
    description: 'Uncompromising realism',
    cost: 195,
    geminiModel: 'gemini-2.5-pro',
    color: '#c084fc',
    badgeType: 'crown',
  },
  {
    id: 'apex',
    name: 'Apex',
    description: 'Gripping, character-driven stories',
    cost: 90,
    geminiModel: 'gemini-2.5-pro',
    color: '#f472b6',
    badgeType: 'spark',
  },
  {
    id: 'superb',
    name: 'Superb',
    description: 'Best quality, most immersive',
    cost: 90,
    geminiModel: 'gemini-2.5-flash',
    color: '#fb7185',
    badgeType: 'grid',
  },
  {
    id: 'skillful',
    name: 'Skillful',
    description: 'Vivid and descriptive narratives',
    cost: 60,
    geminiModel: 'gemini-2.5-flash',
    color: '#f59e0b',
    badgeType: 'diamond',
  },
  {
    id: 'extensive',
    name: 'Extensive',
    description: 'Strong details and long narratives',
    cost: 60,
    geminiModel: 'gemini-2.5-flash',
    color: '#2dd4bf',
    badgeType: 'star',
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Light and cheap',
    cost: 30,
    geminiModel: 'gemini-2.5-flash-lite',
    color: '#38bdf8',
    badgeType: 'circle',
  },
];

export const DEFAULT_AVATARS: AvatarProfile[] = [
  {
    id: 'herbert',
    name: 'Herbert EctorHjf9Db',
    description: 'Quick-witted traveler, calm under pressure, pragmatic tactician.',
  },
  {
    id: 'pats',
    name: 'Pats',
    description: 'Observant strategist who tests every system rule to its limit.',
  },
  {
    id: 'kael',
    name: 'Kael Vance',
    description: 'Former academy dropout with sharp instincts and dry humor.',
  },
];

export const CREDIT_PACKAGES = [
  {
    id: 'pack-first',
    credits: 21000,
    bonus: 0,
    price: 'US$19.99',
    originalPrice: 'US$28.49',
    badge: 'First Purchase Special Discount',
    discount: '30% OFF',
    timer: '23:53:57',
  },
  {
    id: 'pack-2000',
    credits: 2000,
    bonus: 0,
    price: 'US$2.89',
  },
  {
    id: 'pack-10000',
    credits: 10000,
    bonus: 300,
    price: 'US$14.49',
    popular: true,
  },
  {
    id: 'pack-20000',
    credits: 20000,
    bonus: 1000,
    price: 'US$28.49',
  },
  {
    id: 'pack-50000',
    credits: 50000,
    bonus: 3500,
    price: 'US$71.00',
  },
  {
    id: 'pack-100000',
    credits: 100000,
    bonus: 8000,
    price: 'US$139.99',
  },
];
