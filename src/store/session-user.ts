import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    userSession: { id: number; name: string; email: string; role: string, maxexhibitors: number, maxsessions: number, token: string, event?: string, company?: string } | null;
    setUserSession: (user: { id: number; name: string; email: string; role: string, maxexhibitors: number, maxsessions: number, token:string, event?: string, company?: string } | null) => void;
    updateMaxExhibitors: (newMax: number) => void;
    clear: () => void;
}

const useSessionUser = create<UserState, [["zustand/persist", UserState]]>(
    persist(
        (set) => ({
            userSession: null,
            setUserSession: (userSession) => set({ userSession }),
            updateMaxExhibitors: (newMax) => set((state) => ({
                userSession: state.userSession 
                    ? { ...state.userSession, maxexhibitors: newMax }
                    : null
            })),
            clear: () => set({ userSession: null })
        }),
        { name: "session-user" }
    )
);

export { useSessionUser };