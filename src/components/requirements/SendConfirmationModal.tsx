'use client';

type SendConfirmationModalProps = {
  open: boolean;
  standTypeLabel: string;
  requiredLoaded: number;
  requiredTotal: number;
  requiredPending: number;
  optionalLoaded: number;
  totalDocs: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SendConfirmationModal({
  open,
  standTypeLabel,
  requiredLoaded,
  requiredTotal,
  requiredPending,
  optionalLoaded,
  totalDocs,
  onCancel,
  onConfirm
}: SendConfirmationModalProps) {
  if (!open) return null;

  const partial = requiredPending > 0;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white">Confirmacion de envio</h3>
        <p className="mt-2 text-sm text-slate-300">
          Revisa el resumen antes de enviar la documentacion del expositor.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            <span className="text-slate-400">Tipo de stand: </span>{standTypeLabel}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            <span className="text-slate-400">Total de documentos: </span>{totalDocs}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            <span className="text-slate-400">Obligatorios cargados: </span>{requiredLoaded}/{requiredTotal}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            <span className="text-slate-400">Obligatorios pendientes: </span>{requiredPending}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200 sm:col-span-2">
            <span className="text-slate-400">Opcionales cargados: </span>{optionalLoaded}
          </div>
        </div>

        {partial && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            Estas por enviar tu documentacion de forma parcial. Algunos documentos obligatorios aun estan pendientes de carga y deberan completarse posteriormente.
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-white/30"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl border border-blue-500/40 bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-100 hover:bg-blue-600/30"
          >
            Confirmar envio
          </button>
        </div>
      </div>
    </div>
  );
}
