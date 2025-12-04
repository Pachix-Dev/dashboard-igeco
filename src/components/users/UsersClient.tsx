"use client";

import { useEffect, useState } from "react";

import { AddUser } from "@/components/users/AddUser";
import { ListUsers } from "@/components/users/ListUsers";
import type { DashboardUser } from "@/lib/actions/users";

type UsersClientProps = {
  initialUsers: DashboardUser[];
  header: {
    panel: string;
    title: string;
    subtitle: string;
  };
};

export function UsersClient({ initialUsers, header }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleUserCreated = (user?: DashboardUser) => {
    if (!user) return;
    setUsers((prev) => [user, ...prev]);
  };

  const handleUserUpdated = (user?: DashboardUser) => {
    if (!user) return;
    setUsers((prev) =>
      prev.map((current) => (current.id === user.id ? user : current))
    );
  };

  return (
    <section className="mx-auto max-w-8xl space-y-8 px-6 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {header.panel}
          </p>
          <div className="flex items-end gap-3">
            <h1 className="text-3xl font-bold text-white">{header.title}</h1>
          </div>
          <p className="text-sm text-slate-400">{header.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AddUser onUserCreated={handleUserCreated} />
        </div>
      </header>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur">
        <ListUsers
          users={users}
          onUserUpdated={handleUserUpdated}
        />
      </div>
    </section>
  );
}
