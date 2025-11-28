import { create } from "zustand";
import { registerUser, loginUser } from "../services/auth.api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  register: async (email, username, password) => {
    set({ loading: true, error: null });
    try {
      await registerUser({ email, username, password });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de l'inscription";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await loginUser({ identifier: email, password });
      const { token, user } = response.data;
      console.log(token)
      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true, loading: false });

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de la connexion";
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;