import { RequirementsSkeleton } from '@/components/requirements/RequirementsSkeleton';

export default function RequirementsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <RequirementsSkeleton showExhibitors />
      </section>
    </main>
  );
}
