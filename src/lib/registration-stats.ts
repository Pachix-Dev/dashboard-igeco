export const registrationTypes = [
  { key: 'visitors', value: 'VISITANTE' },
  { key: 'exhibitors', value: 'EXPOSITOR' },
  { key: 'speakers', value: 'CONFERENCISTA' },
  { key: 'vip', value: 'VIP' },
  { key: 'media', value: 'MEDIO' },
] as const;

export type RegistrationType = (typeof registrationTypes)[number]['key'];

export type RegistrationStatsData = {
  counts: Record<RegistrationType, number>;
  total: number;
};

export type RegistrationStatsResult =
  | { success: true; data: RegistrationStatsData }
  | { success: false; error: 'unauthorized' | 'unavailable' };
