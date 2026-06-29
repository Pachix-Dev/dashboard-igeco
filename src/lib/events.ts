export const EVENT_OPTIONS = [
  'ECOMONDO',
  'RE+ MEXICO',
  'SMART TECHNOLOGY EXPO'
] as const;

type SupportedLocale = 'es' | 'en' | 'it';
type EventName = (typeof EVENT_OPTIONS)[number];

type EventDetails = {
  name: EventName;
  dates: Record<SupportedLocale, string>;
  venue: Record<SupportedLocale, string>;
};

const EVENT_DETAILS: Record<EventName, EventDetails> = {
  ECOMONDO: {
    name: 'ECOMONDO',
    dates: {
      es: '14 - 16 de abril 2026',
      en: 'April 14 - 16, 2026',
      it: '14 - 16 aprile 2026'
    },
    venue: {
      es: 'Expo Guadalajara, Jalisco',
      en: 'Expo Guadalajara, Jalisco',
      it: 'Expo Guadalajara, Jalisco'
    }
  },
  'RE+ MEXICO': {
    name: 'RE+ MEXICO',
    dates: {
      es: '14 - 16 de abril 2026',
      en: 'April 14 - 16, 2026',
      it: '14 - 16 aprile 2026'
    },
    venue: {
      es: 'Expo Guadalajara, Jalisco',
      en: 'Expo Guadalajara, Jalisco',
      it: 'Expo Guadalajara, Jalisco'
    }
  },
  'SMART TECHNOLOGY EXPO': {
    name: 'SMART TECHNOLOGY EXPO',
    dates: {
      es: '18 - 20  de noviembre 2026',
      en: 'November 18 - 20, 2026',
      it: '18 - 20 novembre 2026'
    },
    venue: {
      es: 'Expo Guadalajara, Jalisco',
      en: 'Expo Guadalajara, Jalisco',
      it: 'Expo Guadalajara, Jalisco'
    }
  }
};

const EVENT_ALIASES: Record<string, EventName> = {
  'ECOMONDO': 'ECOMONDO',
  'RE+ MEXICO': 'RE+ MEXICO',
  'RE+MEXICO': 'RE+ MEXICO',
  'SMART TECHNOLOGY EXPO': 'SMART TECHNOLOGY EXPO'
};

export function getSupportedLocale(locale?: string): SupportedLocale {
  if (locale === 'en' || locale === 'it') return locale;
  return 'es';
}

export function normalizeEventName(event?: string | null): EventName | null {
  if (!event) return null;

  const normalized = event
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*\+\s*/g, '+');

  return EVENT_ALIASES[normalized] || null;
}

export function getEventDetails(event?: string | null): EventDetails | null {
  const eventName = normalizeEventName(event);
  return eventName ? EVENT_DETAILS[eventName] : null;
}
