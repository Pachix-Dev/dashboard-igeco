import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getTranslations } from 'next-intl/server';
import LanguageSelector from './LanguageSelector';
import MenuClient from './MenuClient';

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  status?: number;
}

async function getUserSession(): Promise<{ role: string | null; status: number | null }> {
  try {
    const token = cookies().get('access_token')?.value;
    if (!token) return { role: null, status: null };
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    return {
      role: payload.role || null,
      status: Number(payload.status ?? 1),
    };
  } catch {
    return { role: null, status: null };
  }
}

export default async function MenuServer() {
  const session = await getUserSession();
  const t = await getTranslations('Menu');

  // Serialize translations for client
  const translations = {
    profile: t('profile'),
    users: t('users'),
    speakers: t('speakers'),
    badges: t('badges'),
    myRecord: t('myRecord'),
    program: t('program'),
    scanLeads: t('scanLeads'),
    logout: t('logout')
  };

  return (
    <MenuClient
      translations={translations}
      role={session.role}
      status={session.status}
      languageSelector={<LanguageSelector />}
    />
  );
}
