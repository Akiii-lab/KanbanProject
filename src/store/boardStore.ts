import { UserBoard } from '@/types/user';
import { create } from 'zustand';

interface BoardState {
    users: UserBoard[];
    usersLoading: boolean;
    usersLastFetch: number | null;
    setUsers: (users: UserBoard[]) => void;
    setUsersLoading: (loading: boolean) => void;
    fetchUsers: () => Promise<void>;
    clearUsersCache: () => void;
    shouldRefetchUsers: () => boolean;
}

const CACHE_DURATION = 15 * 60 * 1000; 

export const useBoardStore = create<BoardState>((set, get) => ({
    users: [],
    usersLoading: false,
    usersLastFetch: null,

    setUsers: (users) => set({ 
        users, 
        usersLastFetch: Date.now() 
    }),

    setUsersLoading: (loading) => set({ 
        usersLoading: loading 
    }),

    shouldRefetchUsers: () => {
        const { usersLastFetch } = get();
        if (!usersLastFetch) return true;
        return Date.now() - usersLastFetch > CACHE_DURATION;
    },

    fetchUsers: async () => {
        const { shouldRefetchUsers, setUsersLoading, setUsers } = get();
        
        // Si no necesitamos refetch y ya tenemos usuarios, no hacer nada
        if (!shouldRefetchUsers() && get().users.length > 0) {
            return;
        }

        setUsersLoading(true);
        try {
            const response = await fetch('/api/board/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (data.ok) {
                setUsers(data.data);
            } else {
                console.error('Failed to fetch users');
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        } finally {
            setUsersLoading(false);
        }
    },

    clearUsersCache: () => set({ 
        users: [], 
        usersLastFetch: null 
    }),
}));