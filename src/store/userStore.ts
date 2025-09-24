import { LoggedUser, User } from '@/types/user';
import { create } from 'zustand';

interface UserState {
    user: LoggedUser | null;
    setUser: (user: User) => void;
    clearUser: () => void;
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
}));
