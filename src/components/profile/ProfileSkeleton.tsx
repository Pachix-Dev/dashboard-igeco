export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto px-6 py-10 space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-9 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-800 rounded w-64"></div>
        </div>

        {/* Profile Card skeleton */}
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl shadow-blue-500/5 backdrop-blur">
          {/* Cover gradient skeleton */}
          <div className="h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
          </div>

          <div className="px-6 pb-8">
            {/* Avatar & Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16 relative">
              <div className="flex gap-6 animate-pulse">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-[14px] bg-slate-900"></div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-slate-700 rounded-full border-4 border-slate-900"></div>
                </div>

                {/* Name & Status */}
                <div className="flex-1 space-y-3 sm:mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-24"></div>
                    <div className="h-7 bg-slate-800 rounded w-48"></div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <div className="h-4 bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
              
              {/* Edit button skeleton */}
              <div className="sm:mb-4 animate-pulse">
                <div className="h-10 bg-slate-800 rounded-xl w-32"></div>
              </div>
            </div>

            {/* Info grid skeleton */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 w-9 h-9"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-700 rounded w-20"></div>
                      <div className="h-5 bg-slate-700 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description skeleton */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-sm animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
                <div className="h-5 bg-slate-800 rounded w-32"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-slate-700 rounded w-4/6"></div>
              </div>
            </div>

            {/* Phone skeleton */}
            <div className="mt-6 animate-pulse">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30">
                <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
                <div className="flex-1">
                  <div className="h-3 bg-slate-700 rounded w-16 mb-2"></div>
                  <div className="h-5 bg-slate-700 rounded w-32"></div>
                </div>
              </div>
            </div>

            {/* Social links skeleton */}
            <div className="mt-6 animate-pulse">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
                <div className="h-5 bg-slate-800 rounded w-28"></div>
              </div>
              <div className="flex flex-wrap gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 w-12 rounded-xl bg-slate-800/50 border border-slate-700/30"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
