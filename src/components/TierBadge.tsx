import React from 'react';
import { MODEL_TIERS } from '../data/models';
import { ModelTierId } from '../types/ooc';

export const TierIcon: React.FC<{ tierId: ModelTierId; size?: number }> = ({ tierId, size = 14 }) => {
  const tier = MODEL_TIERS.find((t) => t.id === tierId) ?? MODEL_TIERS[3];
  const color = tier.color;

  if (tierId === 'max') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M5 18L12 5L19 18H5Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="2" fill={color} />
      </svg>
    );
  }
  if (tierId === 'apex') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 17L12 4L20 17L12 20L4 17Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tierId === 'superb') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth="2" />
        <path d="M9 9L15 15M15 9L9 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (tierId === 'skillful') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill={color} />
      </svg>
    );
  }
  if (tierId === 'extensive') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2V22M2 12H22M4.9 4.9L19.1 19.1M19.1 4.9L4.9 19.1" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2.4" />
      <circle cx="12" cy="12" r="3.5" fill={color} />
    </svg>
  );
};
