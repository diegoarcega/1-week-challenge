import { User } from 'types/user.type';
import create from 'zustand';

interface UserState {
  user: User | undefined;
  setUser: (userData: User) => void;
  clearUser: () => void;
}
export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (userData: User) => set({ user: userData }),
  clearUser: () => set({ user: undefined }),
}));
