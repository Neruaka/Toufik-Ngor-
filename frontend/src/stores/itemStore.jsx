import { create } from "zustand";
import api from "../services/api";

const useItemStore = create((set, get) => ({
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    success: null,
    filter: null,

    fetchItems: async () => {
        set({ loading: true, error: null });
        try {
            const filter = get().filter;
            const query = filter ? `?status=${filter}` : "";
            
            const response = await api.get(`/items${query}`);
            
            set({ 
                items: response.data.data, 
                loading: false 
            });
        } catch (err) {
            set({ 
                loading: false, 
                error: err.response?.data?.message || "Erreur lors du chargement" 
            });
        }
    },

    fetchItem: async (id) => {
        set({ loading: true, error: null, currentItem: null });
        try {
            const response = await api.get(`/items/${id}`);
            
            set({ 
                currentItem: response.data.data, 
                loading: false 
            });
        } catch (err) {
            set({ 
                loading: false, 
                error: err.response?.data?.message || "Livre non trouvé" 
            });
        }
    },

    createItem: async (data) => {
        set({ loading: true, error: null, success: null });
        try {
            const response = await api.post("/items", data);
            
            set((state) => ({ 
                items: [response.data.data, ...state.items],
                loading: false,
                success: "Livre ajouté avec succès"
            }));
            
            return { success: true, data: response.data.data };
        } catch (err) {
            const message = err.response?.data?.message || "Erreur lors de la création";
            set({ loading: false, error: message });
            return { success: false, message };
        }
    },

    updateItem: async (id, data) => {
        set({ loading: true, error: null, success: null });
        try {
            const response = await api.patch(`/items/${id}`, data);
            
            set((state) => ({
                items: state.items.map(item => 
                    item._id === id ? response.data.data : item
                ),
                currentItem: response.data.data,
                loading: false,
                success: "Livre mis à jour"
            }));
            
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Erreur lors de la modification";
            set({ loading: false, error: message });
            return { success: false, message };
        }
    },

    deleteItem: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/items/${id}`);
            
            set((state) => ({
                items: state.items.filter(item => item._id !== id),
                loading: false,
                success: "Livre supprimé"
            }));
            
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Erreur lors de la suppression";
            set({ loading: false, error: message });
            return { success: false, message };
        }
    },

    setFilter: (filter) => {
        set({ filter });
    },

    clearMessages: () => set({ error: null, success: null })
}));

export default useItemStore;