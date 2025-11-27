// import { create } from "zustand";
// import api from "../services/api";

// const useItemStore = create((set, get) => ({
//     items: [],
//     currentItem: null,
//     loading: false,
//     error: null,
//     success: null,
//     filter: null,  // "to_read", "reading", "finished" ou null (tous)

//     // récupérer tous les livres
//     fetchItems: async () => {
//         set({ loading: true, error: null });
//         try {
//             const filter = get().filter;
//             const query = filter ? `?status=${filter}` : "";
            
//             const response = await api.get(`/items${query}`);
            
//             set({ 
//                 items: response.data.data, 
//                 loading: false 
//             });
//         } catch (err) {
//             set({ 
//                 loading: false, 
//                 error: err.response?.data?.message || "Erreur lors du chargement" 
//             });
//         }
//     },

//     // récupérer un livre par id
//     fetchItem: async (id) => {
//         set({ loading: true, error: null, currentItem: null });
//         try {
//             const response = await api.get(`/items/${id}`);
            
//             set({ 
//                 currentItem: response.data.data, 
//                 loading: false 
//             });
//         } catch (err) {
//             set({ 
//                 loading: false, 
//                 error: err.response?.data?.message || "Livre non trouvé" 
//             });
//         }
//     },

//     // créer un livre
//     createItem: async (data) => {
//         set({ loading: true, error: null, success: null });
//         try {
//             const response = await api.post("/items", data);
            
//             set((state) => ({ 
//                 items: [response.data.data, ...state.items],
//                 loading: false,
//                 success: "Livre ajouté avec succès"
//             }));
            
//             return { success: true, data: response.data.data };
//         } catch (err) {
//             const message = err.response?.data?.message || "Erreur lors de la création";
//             set({ loading: false, error: message });
//             return { success: false, message };
//         }
//     },

//     // modifier un livre
//     updateItem: async (id, data) => {
//         set({ loading: true, error: null, success: null });
//         try {
//             const response = await api.patch(`/items/${id}`, data);
            
//             set((state) => ({
//                 items: state.items.map(item => 
//                     item._id === id ? response.data.data : item
//                 ),
//                 currentItem: response.data.data,
//                 loading: false,
//                 success: "Livre mis à jour"
//             }));
            
//             return { success: true };
//         } catch (err) {
//             const message = err.response?.data?.message || "Erreur lors de la modification";
//             set({ loading: false, error: message });
//             return { success: false, message };
//         }
//     },

//     // supprimer un livre
//     deleteItem: async (id) => {
//         set({ loading: true, error: null });
//         try {
//             await api.delete(`/items/${id}`);
            
//             set((state) => ({
//                 items: state.items.filter(item => item._id !== id),
//                 loading: false,
//                 success: "Livre supprimé"
//             }));
            
//             return { success: true };
//         } catch (err) {
//             const message = err.response?.data?.message || "Erreur lors de la suppression";
//             set({ loading: false, error: message });
//             return { success: false, message };
//         }
//     },

//     // changer le filtre
//     setFilter: (filter) => {
//         set({ filter });
//     },

//     // reset messages
//     clearMessages: () => set({ error: null, success: null })
// }));

// export default useItemStore;


import { create } from "zustand";

// données fake pour tester
const fakeItems = [
    {
        _id: "1",
        title: "Harry Potter à l'école des sorciers",
        author: "J.K. Rowling",
        status: "finished",
        rating: 5,
        imageUrl: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
        description: "Le premier tome de la saga Harry Potter",
        tags: ["fantasy", "magie"]
    },
    {
        _id: "2",
        title: "Le Seigneur des Anneaux",
        author: "J.R.R. Tolkien",
        status: "reading",
        rating: 4,
        imageUrl: "https://covers.openlibrary.org/b/id/8743426-L.jpg",
        description: "Une aventure épique en Terre du Milieu",
        tags: ["fantasy", "aventure"]
    },
    {
        _id: "3",
        title: "1984",
        author: "George Orwell",
        status: "to_read",
        rating: null,
        imageUrl: "https://covers.openlibrary.org/b/id/8575141-L.jpg",
        description: "Un classique dystopique",
        tags: ["dystopie", "classique"]
    }
];

const useItemStore = create((set, get) => ({
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    success: null,
    filter: null,

    // FAKE : simule le chargement des items
    fetchItems: async () => {
        set({ loading: true, error: null });
        
        // simule un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const filter = get().filter;
        let items = [...fakeItems];
        
        if (filter) {
            items = items.filter(item => item.status === filter);
        }
        
        set({ items, loading: false });
    },

    // FAKE : simule la récupération d'un item
    fetchItem: async (id) => {
        set({ loading: true, error: null, currentItem: null });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const item = fakeItems.find(i => i._id === id);
        
        if (!item) {
            set({ loading: false, error: "Livre non trouvé" });
            return;
        }
        
        set({ currentItem: item, loading: false });
    },

    // FAKE : simule la création
    createItem: async (data) => {
        set({ loading: true, error: null, success: null });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newItem = {
            _id: Date.now().toString(),
            ...data,
            status: "to_read",
            rating: null
        };
        
        fakeItems.push(newItem);
        
        set((state) => ({
            items: [newItem, ...state.items],
            loading: false,
            success: "Livre ajouté avec succès"
        }));
        
        return { success: true, data: newItem };
    },

    // FAKE : simule la modification
    updateItem: async (id, data) => {
        set({ loading: true, error: null, success: null });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = fakeItems.findIndex(i => i._id === id);
        
        if (index === -1) {
            set({ loading: false, error: "Livre non trouvé" });
            return { success: false };
        }
        
        fakeItems[index] = { ...fakeItems[index], ...data };
        
        set((state) => ({
            items: state.items.map(item => 
                item._id === id ? fakeItems[index] : item
            ),
            currentItem: fakeItems[index],
            loading: false,
            success: "Livre mis à jour"
        }));
        
        return { success: true };
    },

    // FAKE : simule la suppression
    deleteItem: async (id) => {
        set({ loading: true, error: null });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = fakeItems.findIndex(i => i._id === id);
        
        if (index !== -1) {
            fakeItems.splice(index, 1);
        }
        
        set((state) => ({
            items: state.items.filter(item => item._id !== id),
            loading: false,
            success: "Livre supprimé"
        }));
        
        return { success: true };
    },

    setFilter: (filter) => {
        set({ filter });
    },

    clearMessages: () => set({ error: null, success: null })
}));

export default useItemStore;