"use client";

import { useToaster } from "@/context/ToasterContext";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { getScanLeadValue } from "@/lib/scanleads-fields";

export function AddNotes({ lead, onUpdate }) {
  const t = useTranslations("ScanLeadsPage.notes");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewport, setViewport] = useState(null);
  const [saveError, setSaveError] = useState("");
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const notesId = useId();
  const { notify } = useToaster();
  const handleClose = () => setIsOpen(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { notes: lead.notes ?? "" } });

  const handleOpen = () => {
    reset({ notes: lead.notes ?? "" });
    setSaveError("");
    setViewport(null);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const visualViewport = window.visualViewport;
    const updateViewport = () => {
      const next = {
        height: visualViewport?.height ?? window.innerHeight,
        top: visualViewport?.offsetTop ?? 0,
      };
      setViewport((current) =>
        current?.height === next.height && current?.top === next.top ? current : next
      );
    };

    document.body.style.overflow = "hidden";
    updateViewport();
    window.addEventListener("resize", updateViewport);
    visualViewport?.addEventListener("resize", updateViewport);
    visualViewport?.addEventListener("scroll", updateViewport);
    const focusFrame = requestAnimationFrame(() => {
      dialogRef.current?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("resize", updateViewport);
      visualViewport?.removeEventListener("resize", updateViewport);
      visualViewport?.removeEventListener("scroll", updateViewport);
      document.body.style.overflow = originalOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !viewport) return;

    const frame = requestAnimationFrame(() => {
      const content = contentRef.current;
      const active = document.activeElement;
      if (!content || !(active instanceof HTMLElement) || !content.contains(active)) return;

      const bounds = content.getBoundingClientRect();
      const field = active.getBoundingClientRect();
      if (field.height > content.clientHeight || field.bottom > bounds.bottom - 8) {
        content.scrollTop += field.bottom - bounds.bottom + 8;
      } else if (field.top < bounds.top + 8) {
        content.scrollTop -= bounds.top - field.top + 8;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, viewport]);

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape" && !isLoading) {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll(
      'button:not([disabled]), textarea:not([disabled])'
    );
    if (!focusable?.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === dialogRef.current)) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleUser = async ({ notes }) => {
    setIsLoading(true);
    setSaveError("");
    try {
      const response = await fetch(`/api/scanleads`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: lead.uuid, notes }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        // ignore parse errors
      }

      if (response.ok && data?.status === 200) {
        const savedNotes = typeof data.notes === "string" ? data.notes : notes.slice(0, 1000);
        notify(t("success"), "success");
        // Actualizar el lead en el componente padre sin recargar
        if (onUpdate) {
          onUpdate(lead.uuid, savedNotes);
        }
        handleClose();
      } else {
        const message = !response.ok && typeof data?.message === "string" ? data.message : t("error");
        setSaveError(message);
        notify(message, "error");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      setSaveError(t("error"));
      notify(t("error"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="group relative flex justify-center">
        <span className="pointer-events-none absolute -top-10 right-0 z-10 whitespace-nowrap rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
          <span className="mr-1">✨</span>
          {t("tooltip")}
        </span>
        <button
          ref={triggerRef}
          type="button"
          aria-label={t("tooltip")}
          onClick={handleOpen}
          className="group rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-2 text-emerald-400 transition hover:from-emerald-500/20 hover:to-teal-500/20 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 transition group-hover:scale-110"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </div>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-x-0 top-0 z-[100] flex h-[100dvh] min-h-0 items-center justify-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-6"
          style={viewport ? { top: viewport.top, height: viewport.height, padding: viewport.height < 420 ? 8 : undefined } : undefined}
          onKeyDown={handleDialogKeyDown}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="flex max-h-full min-h-0 w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-emerald-500/20 outline-none sm:rounded-3xl"
          >
            {/* Header con gradiente */}
            <div
              className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 sm:px-6 sm:py-4"
              style={viewport?.height < 420 ? { paddingTop: 8, paddingBottom: 8 } : undefined}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="hidden shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg shadow-emerald-500/30 sm:block"
                  style={viewport?.height < 420 ? { display: "none" } : undefined}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 id={titleId} className="text-lg font-bold text-white sm:text-xl">{t("title")}</h2>
                  <p id={descriptionId} className={viewport?.height < 420 ? "hidden" : "text-xs text-slate-400 sm:text-sm"}>
                    {t("subtitle")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={t("cancel")}
                onClick={handleClose}
                disabled={isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-40"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                  <path strokeLinecap="round" d="m6 6 12 12M6 18 18 6" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleUser)} className="flex min-h-0 flex-col">
              <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
                {/* Info del Lead */}
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t("leadInfo")}
                  </p>
                  <p className="text-base font-medium text-white [overflow-wrap:anywhere]">
                    {[getScanLeadValue(lead, "name"), getScanLeadValue(lead, "paternSurname")].filter(Boolean).join(" ")}
                  </p>
                  <p className="text-sm capitalize text-slate-400 [overflow-wrap:anywhere]">{lead.position}</p>
                  {lead.company && (
                    <p className="mt-1 flex items-start gap-2 text-sm text-slate-400 [overflow-wrap:anywhere]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mt-0.5 h-4 w-4 shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                        />
                      </svg>
                      <span className="min-w-0">{lead.company}</span>
                    </p>
                  )}
                </div>

                {/* Textarea de notas */}
                <div>
                  <label htmlFor={notesId} className="mb-2 block text-sm font-semibold text-slate-300">
                    {t("label")}
                  </label>
                  <textarea
                    {...register("notes", {
                      required: t("required"),
                    })}
                    id={notesId}
                    aria-invalid={Boolean(errors.notes)}
                    aria-describedby={errors.notes ? `${notesId}-error` : undefined}
                    maxLength={1000}
                    disabled={isLoading}
                    rows={viewport?.height < 420 ? 3 : 5}
                    placeholder={t("placeholder")}
                    className="min-h-28 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-base text-white placeholder-slate-500 shadow-inner shadow-black/20 transition focus:border-emerald-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  {errors.notes && (
                    <p id={`${notesId}-error`} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
                      {errors.notes.message}
                    </p>
                  )}
                </div>

                {saveError && <p role="alert" className="mt-3 text-sm text-red-400">{saveError}</p>}
              </div>

              {/* Botones */}
              <div className="flex shrink-0 gap-2 border-t border-white/10 bg-slate-900/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-h-11 min-w-0 flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("saving")}
                    </span>
                  ) : (
                    t("save")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
