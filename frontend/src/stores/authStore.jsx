// import { create } from "zustand";
// import api from "../services/api";

// const useAuthStore = create((set) => ({
//     user: null,
//     token: localStorage.getItem("token") || null,
//     isAuthenticated: !!localStorage.getItem("token"),
//     loading: false,
//     error: null,

//     // inscription
//     register: async (email, username, password) => {
//         set({ loading: true, error: null });
//         try {
//             const response = await api.post("/auth/signup", {
//                 email,
//                 username,
//                 password
//             });

//             set({ loading: false });
//             return { success: true };

//         } catch (err) {
//             const message = err.response?.data?.message || "Erreur lors de l'inscription";
//             set({ loading: false, error: message });
//             return { success: false, message };
//         }
//     },

//     // connexion
//     login: async (email, password) => {
//         set({ loading: true, error: null });
//         try {
//             const response = await api.post("/auth/signin", {
//                 email,
//                 password
//             });

//             const { token, user } = response.data.data;

//             localStorage.setItem("token", token);
//             set({
//                 user,
//                 token,
//                 isAuthenticated: true,
//                 loading: false
//             });

//             return { success: true };

//         } catch (err) {
//             const message = err.response?.data?.message || "Erreur lors de la connexion";
//             set({ loading: false, error: message });
//             return { success: false, message };
//         }
//     },

//     // déconnexion
//     logout: () => {
//         localStorage.removeItem("token");
//         set({
//             user: null,
//             token: null,
//             isAuthenticated: false
//         });
//     },

//     // reset l'erreur
//     clearError: () => set({ error: null })
// }));

// export default useAuthStore;

import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
    // TEMPORAIRE : on simule un utilisateur connecté
    user: { _id: "fake123", username: "TestUser", email: "test@mail.com" },
    token: "fake_token_temporaire",
    isAuthenticated: true,  // ← forcé à true pour tester
    loading: false,
    error: null,

    register: async (email, username, password) => {
        // TODO: à implémenter quand le back sera prêt
        console.log("register:", { email, username, password });
        return { success: true };
    },

    login: async (email, password) => {
        // TODO: à implémenter quand le back sera prêt
        console.log("login:", { email, password });
        set({
            user: { _id: "fake123", username: "TestUser", email },
            token: "fake_token",
            isAuthenticated: true
        });
        return { success: true };
    },

    logout: () => {
        localStorage.removeItem("token");
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    },

    clearError: () => set({ error: null })
}));

export default useAuthStore;