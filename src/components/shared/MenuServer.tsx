import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getTranslations } from 'next-intl/server';
import LanguageSelector from './LanguageSelector';
import MenuClient from './MenuClient';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

async function getUserRole(): Promise<string | null> {
  try {
    const token = cookies().get('access_token')?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    return payload.role || null;
  } catch {
    return null;
  }
}

export default async function MenuServer() {
  const role = await getUserRole();
  const t = await getTranslations('Menu');

  // Serialize translations for client
  const translations = {
    profile: t('profile'),
    users: t('users'),
    speakers: t('speakers'),
    badges: t('badges'),
    program: t('program'),
    scanLeads: t('scanLeads'),
    logout: t('logout')
  };

  return <MenuClient translations={translations} role={role} languageSelector={<LanguageSelector />} />;
}
