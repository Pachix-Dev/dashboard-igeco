export default function ExhibitorsSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-8xl space-y-8 px-6 py-10">
        {/* Header skeleton */}
        <header className="flex flex-col gap-4 animate-pulse">
          <div className="space-y-1">
            <div className="h-3 bg-slate-800 rounded w-24"></div>
            <div className="flex items-end gap-3">
              <div className="h-9 bg-slate-800 rounded w-48"></div>
              <div className="h-6 bg-slate-800 rounded-full w-16"></div>
            </div>
            <div className="h-4 bg-slate-800 rounded w-64"></div>
          </div>

          {/* Stats Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/20 to-slate-800/10 p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-800 w-12 h-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-7 bg-slate-700 rounded w-12"></div>
                    <div className="h-3 bg-slate-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons skeleton */}
          <div className="flex flex-wrap justify-end gap-3">
            <div className="h-11 bg-slate-800 rounded-2xl w-40"></div>
            <div className="h-11 bg-slate-800 rounded-2xl w-40"></div>
          </div>
        </header>

        {/* Table skeleton */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur animate-pulse">
          <div className="space-y-6">
            {/* List header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded w-24"></div>
                <div className="h-6 bg-slate-800 rounded w-48"></div>
                <div className="h-4 bg-slate-800 rounded w-64"></div>
              </div>
              <div className="h-10 bg-slate-800 rounded-xl w-72"></div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5">
                  <thead className="bg-white/5">
                    <tr>
                      {[...Array(6)].map((_, i) => (
                        <th key={i} className="px-6 py-3">
                          <div className="h-4 bg-slate-700 rounded w-20"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[...Array(6)].map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-32"></div>
                            <div className="h-3 bg-slate-700 rounded w-24"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-700 rounded w-40"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-700 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-slate-700 rounded-lg w-32"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-700 rounded w-8"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <div className="h-6 w-6 bg-slate-700 rounded"></div>
                            <div className="h-6 w-6 bg-slate-700 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination skeleton */}
              <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="h-4 bg-slate-700 rounded w-32"></div>
                <div className="flex items-center gap-2">
                  <div className="h-10 bg-slate-700 rounded-lg w-24"></div>
                  <div className="h-10 bg-slate-700 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
