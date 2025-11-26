import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    userSession: { id: number; name: string; email: string; role: string, maxexhibitors: number, maxsessions: number, token: string, event?: string, company?: string } | null;
    setUserSession: (user: { id: number; name: string; email: string; role: string, maxexhibitors: number, maxsessions: number, token:string, event?: string, company?: string } | null) => void;
    clear: () => void;
}

const useSessionUser = create<UserState, [["zustand/persist", UserState]]>(
    persist(
        (set) => ({
            userSession: null,
            setUserSession: (userSession) => set({ userSession }),
            clear: () => set({ userSession: null })
        }),
        { name: "session-user" }
    )
);

export { useSessionUser };