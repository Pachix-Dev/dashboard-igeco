'use client';

interface ExhibitorStatsProps {
  total: number;
  maxExhibitors: number;
  remaining: number;
  usagePercentage: number;
  translations: {
    registered: string;
    limit: string;
    remaining: string;
    usage: string;
  };
}

export default function ExhibitorStats({ total, maxExhibitors, remaining, usagePercentage, translations }: ExhibitorStatsProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total registrados */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/20 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-xs text-slate-400">{translations.registered}</p>
          </div>
        </div>
      </div>

      {/* Límite total */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/20 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{maxExhibitors}</p>
            <p className="text-xs text-slate-400">{translations.limit}</p>
          </div>
        </div>
      </div>

      {/* Espacios disponibles */}
      <div className={`rounded-2xl border border-white/10 p-4 shadow-lg ${
        remaining === 0 
          ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10' 
          : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-3 ${
            remaining === 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${
              remaining === 0 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{remaining}</p>
            <p className="text-xs text-slate-400">{translations.remaining}</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-800/30 p-4 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">{translations.usage}</p>
            <p className="text-xs font-bold text-white">{usagePercentage.toFixed(0)}%</p>
          </div>
          <div className="h-3 rounded-full bg-slate-700/50 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercentage >= 100 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                  : usagePercentage >= 80
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">{total} / {maxExhibitors}</p>
        </div>
      </div>
    </div>
  );
}
