import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tài khoản demo (trong thực tế sẽ call API)
const DEMO_ACCOUNTS = [
  { id: 1, name: 'Nguyễn Văn Đạt', email: 'dat@example.com', password: '123456', role: 'customer', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Admin FSS', email: 'admin@fss.vn', password: 'admin123', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      authError: null,

      login: (email, password) => {
        const found = DEMO_ACCOUNTS.find(
          (u) => u.email === email && u.password === password
        );
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
        const exists = DEMO_ACCOUNTS.find((u) => u.email === email);
        if (exists) {
          set({ authError: 'Email này đã được sử dụng.' });
          return { success: false };
        }
        const newUser = {
          id: DEMO_ACCOUNTS.length + 1,
          name,
          email,
          role: 'customer',
          avatar: `https://i.pravatar.cc/150?img=${DEMO_ACCOUNTS.length + 10}`,
        };
        DEMO_ACCOUNTS.push({ ...newUser, password });
        set({ user: newUser, isAuthenticated: true, authError: null });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false, authError: null }),

      clearError: () => set({ authError: null }),

      updateProfile: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'fss-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
