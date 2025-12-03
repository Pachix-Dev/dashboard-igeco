import { useTranslations } from 'next-intl'

export function AccountDisable() {
  const t = useTranslations('AccountDisabled')
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            <section className="mx-auto max-w-4xl px-6 py-20">
            <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-8 shadow-2xl shadow-red-500/20">
                <div className="flex flex-col items-center gap-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-red-500/20">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-10 w-10 text-red-400"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                    </svg>
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-red-100">
                    {t('title')}
                    </h2>
                    <p className="text-lg leading-relaxed text-red-200/90">
                    {t('message')}
                    </p>
                </div>
                <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-6 py-4">
                    <p className="text-sm font-semibold text-red-200">
                    {t('contact')}
                    </p>
                </div>
                </div>
            </div>
            </section>
      </main>
    )
}