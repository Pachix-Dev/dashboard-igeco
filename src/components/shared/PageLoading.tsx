'use client';

interface PageLoadingProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'dots';
}

export function PageLoading({ 
  message = 'Cargando...', 
  variant = 'default' 
}: PageLoadingProps) {
  
  if (variant === 'minimal') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-3 text-sm text-slate-400">{message}</p>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" style={{animationDelay: '0s'}}></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-500" style={{animationDelay: '0.1s'}}></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    );
  }

  // Default variant - full page
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          {/* Spinner con efecto glow */}
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
            <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          </div>
          
          {/* Mensaje */}
          <p className="mt-6 text-sm font-medium text-slate-300">{message}</p>
          
          {/* Decoración de puntos animados */}
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500/60" style={{animationDelay: '0s'}}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-500/60" style={{animationDelay: '0.15s'}}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500/60" style={{animationDelay: '0.3s'}}></div>
          </div>
        </div>
      </div>
    </main>
  );
}
