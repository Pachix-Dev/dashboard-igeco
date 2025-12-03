import { useTranslations } from "next-intl"

export function AccountDisableLight() {
    const t = useTranslations('AccountDisabled')
    return (
        <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-8 shadow-2xl shadow-red-500/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-300">
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
                    <div>
                        <h3 className="text-lg font-bold text-red-100">
                            {t('title')}
                        </h3>
                        <p className="text-sm leading-relaxed text-red-200/90">
                            {t('message')}
                        </p>
                    </div>
                </div>                
                
            </div>
        </div>
    )
}