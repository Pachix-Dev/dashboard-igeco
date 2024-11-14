import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    userSession: { id: number | null; name: string; email: string; role: string } | null;
    setUserSession: (user: { id: number; name: string; email: string; role: string } | null) => void;
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