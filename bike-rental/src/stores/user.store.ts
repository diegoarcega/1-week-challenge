import create from 'zustand';
import { User } from 'types/user.type';
import { getUser } from 'utils/user';

interface UserState {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}
export const useUserStore = create<UserState>((set) => ({
  user: getUser(),
  setUser: (userData: User) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));
