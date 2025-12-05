'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BuyScanLeads } from './BuyScanLeads';

interface ScanLeadsUpsellProps {
  userId: number;
  userName: string;
  userEmail: string;
}

// SVG Icons
const QrCodeIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="8" height="8" rx="1" />
    <rect x="13" y="3" width="8" height="8" rx="1" />
    <rect x="3" y="13" width="8" height="8" rx="1" />
    <path d="M13 13h2v2h-2z" />
    <path d="M17 13h2v2h-2z" />
    <path d="M13 17h2v2h-2z" />
    <path d="M17 17h2v2h-2z" />
    <path d="M19 19h2v2h-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 20V10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 20V4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 20v-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZapIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ScanLeadsUpsell({ userId, userName, userEmail }: ScanLeadsUpsellProps) {
  const t = useTranslations('ScanLeadsUpsell');
  const [showPayPal, setShowPayPal] = useState(false);

  const features = [
    {
      icon: QrCodeIcon,
      title: t('features.qr.title'),
      description: t('features.qr.description'),
    },
    {
      icon: UsersIcon,
      title: t('features.contacts.title'),
      description: t('features.contacts.description'),
    },
    {
      icon: BarChartIcon,
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
    },
    {
      icon: DownloadIcon,
      title: t('features.export.title'),
      description: t('features.export.description'),
    },
    {
      icon: ZapIcon,
      title: t('features.instant.title'),
      description: t('features.instant.description'),
    },
    {
      icon: ShieldIcon,
      title: t('features.secure.title'),
      description: t('features.secure.description'),
    },
  ];

  const benefits = [
    t('benefits.0'),
    t('benefits.1'),
    t('benefits.2'),
    t('benefits.3'),
    t('benefits.4'),
    t('benefits.5'),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-7xl space-y-16 px-6 py-16">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-500/20">
            <ZapIcon />
            {t('badge')}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Price Card */}
        <div className="max-w-md mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 border border-emerald-500/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            
            <div className="relative space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  {t('pricing.label')}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-white">$10,750</span>
                  <span className="text-2xl text-slate-400">MXN</span>
                </div>
                <p className="text-sm text-slate-500">{t('pricing.single')}</p>
              </div>

              {!showPayPal ? (
                <button
                  onClick={() => setShowPayPal(true)}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t('pricing.cta')}
                </button>
              ) : (
                <BuyScanLeads 
                  userId={userId}                                  
                />
              )}

                <p className="text-center text-xs text-slate-500">
                    {t('pricing.guarantee')}
                </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">{t('featuresTitle')}</h2>
            <p className="text-slate-400">{t('featuresSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl bg-white/5 p-6 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:border-emerald-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative space-y-3">
                    <div className="inline-flex rounded-lg bg-emerald-500/10 p-3 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                      <Icon />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits List */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-white/5 p-8 md:p-12 backdrop-blur-sm border border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              {t('benefitsTitle')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 rounded-full bg-emerald-500/20 p-1">
                    <CheckIcon />
                  </div>
                  <p className="text-slate-300 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-slate-500 max-w-2xl mx-auto">
          <p>{t('footer.note')}</p>
        </div>

      </section>
    </main>
  );
}
