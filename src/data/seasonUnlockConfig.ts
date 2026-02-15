export type LockedSeason = 2 | 3 | 4;

export interface SeasonUnlockState {
  startedAt: number | null;
  unlockedByCode: boolean;
}

export type UnlockStateMap = Record<LockedSeason, SeasonUnlockState>;

export interface SeasonUnlockConfigEntry {
  waitMs: number;
  code: string;
  contactHint: string;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

// Update only this object to change season wait times, codes, or hint text.
export const SEASON_UNLOCK_CONFIG: Record<LockedSeason, SeasonUnlockConfigEntry> = {
  2: {
    waitMs: ONE_HOUR_MS,
    code: 'manoj2901',
    contactHint: 'If you want to open it now, ask the code to Manoj.',
  },
  3: {
    waitMs: ONE_HOUR_MS,
    code: 'manoj3101',
    contactHint: 'If you want to open it now, ask the code to Manoj.',
  },
  4: {
    waitMs: ONE_HOUR_MS,
    code: 'manoj2502',
    contactHint: 'If you want to open it now, ask the code to Manoj.',
  },
};

export const LOCKED_SEASONS: LockedSeason[] = [2, 3, 4];

export const createInitialUnlockState = (): UnlockStateMap => ({
  2: { startedAt: null, unlockedByCode: false },
  3: { startedAt: null, unlockedByCode: false },
  4: { startedAt: null, unlockedByCode: false },
});
