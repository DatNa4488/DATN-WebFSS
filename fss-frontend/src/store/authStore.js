import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tài khoản demo (hiện tại vẫn là mock phía client)
const DEMO_ACCOUNTS_SEED = [
  { id: 1, name: 'Nguyễn Văn Đạt', email: 'dat@example.com', password: '123456', role: 'customer', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Admin FSS', email: 'admin@fss.vn', password: 'admin123', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Lưu mảng tài khoản trong state để đăng ký vẫn đăng nhập được sau khi reload.
      // Lưu ý: đây chỉ là mock client (có chứa password) nên không phù hợp production.
      accounts: DEMO_ACCOUNTS_SEED,
      user: null,
      isAuthenticated: false,
      authError: null,

      login: (email, password) => {
        const { accounts } = get();
        const found = accounts.find((u) => u.email === email && u.password === password);
        if (found) {
          const { password: _, ...safeUser } = found;
          set({ user: safeUser, isAuthenticated: true, authError: null });
          return { success: true, role: safeUser.role };
        } else {
          set({ authError: 'Email hoặc mật khẩu không đúng.' });
          return { success: false };
        }
      },

      register: (name, email, password) => {
        const { accounts } = get();
        const exists = accounts.find((u) => u.email === email);
        if (exists) {
          set({ authError: 'Email này đã được sử dụng.' });
          return { success: false };
        }

        const nextId = Math.max(0, ...accounts.map((u) => u.id)) + 1;
        const newUser = {
          id: nextId,
          name,
          email,
          role: 'customer',
          avatar: `https://i.pravatar.cc/150?img=${nextId + 10}`,
        };

        const nextAccount = { ...newUser, password };
        set((state) => ({
          accounts: [...state.accounts, nextAccount],
          user: newUser,
          isAuthenticated: true,
          authError: null,
        }));
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false, authError: null }),

      clearError: () => set({ authError: null }),

      updateProfile: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'fss-auth',
      partialize: (state) => ({
        accounts: state.accounts,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
