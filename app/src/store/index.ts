import { create } from 'zustand';

export type UserRole = 'admin' | 'company' | 'guest';

export interface CartItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  price: number;
  trialDays: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  mockLogin: (role: UserRole) => void;
}

interface UIState {
  language: 'en' | 'fa';
  sidebarOpen: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'fa') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  cartTotal: () => number;
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    email: 'admin@lida.ai',
    name: 'Admin User',
    role: 'admin',
  },
  company: {
    id: '2',
    email: 'company@example.com',
    name: 'Company Admin',
    role: 'company',
    companyId: 'comp-1',
  },
  guest: {
    id: '3',
    email: 'guest@example.com',
    name: 'Guest',
    role: 'guest',
  },
};

export const useAuthStore = create<AuthState & UIState & CartState>((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // UI state
  language: 'en',
  sidebarOpen: true,

  // Cart state
  cartItems: [],
  checkoutStep: 0,
  showCart: false,

  // Auth actions
  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const role: UserRole = email.includes('admin') ? 'admin' : 'company';
    set({
      user: { ...mockUsers[role], email },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  mockLogin: (role: UserRole) => {
    set({
      user: mockUsers[role],
      isAuthenticated: role !== 'guest',
    });
  },

  // UI actions
  toggleLanguage: () => {
    set((state) => {
      const newLang = state.language === 'en' ? 'fa' : 'en';
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
      return { language: newLang };
    });
  },

  setLanguage: (lang: 'en' | 'fa') => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    set({ language: lang });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  // Cart actions
  addToCart: (item: CartItem) => {
    set((state) => {
      if (state.cartItems.find((i) => i.id === item.id)) return state;
      return { cartItems: [...state.cartItems, item] };
    });
  },

  removeFromCart: (id: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== id),
    }));
  },

  clearCart: () => {
    set({ cartItems: [], checkoutStep: 0 });
  },

  isInCart: (id: string) => {
    return get().cartItems.some((i) => i.id === id);
  },

  cartTotal: () => {
    return get().cartItems.reduce((sum, i) => sum + i.price, 0);
  },

  setCheckoutStep: (step: number) => {
    set({ checkoutStep: step });
  },

  setShowCart: (show: boolean) => {
    set({ showCart: show });
  },
}));
