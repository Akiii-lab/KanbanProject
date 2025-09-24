import { LoggedUser, User } from '@/types/user';
import { create } from 'zustand';

interface UserState {
    user: LoggedUser | null;
    sidebarCollapsed: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

function getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

export const useUserStore = create<UserState>((set) => ({
    user: getStoredUser(),
    sidebarCollapsed: typeof window !== 'undefined' ? (localStorage.getItem('sidebarCollapsed') === 'true') : false,
    setUser: (user) => {
        set({ user });
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },
    clearUser: () => {
        set({ user: null });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    },
    setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', String(collapsed));
        }
    },
}));