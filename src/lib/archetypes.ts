import type { Personality } from './types';

export function getVisiblePersonalities(personalities: Personality[]) {
  return personalities.filter((personality) => !personality.hiddenRule);
}

export function groupPersonalities(personalities: Personality[]) {
  const visible = getVisiblePersonalities(personalities);
  const groups = new Map<string, Personality[]>();

  for (const personality of visible) {
    const key = personality.group ?? '未分组';
    const existing = groups.get(key) ?? [];
    existing.push(personality);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([group, items]) => ({
    group,
    items,
  }));
}
