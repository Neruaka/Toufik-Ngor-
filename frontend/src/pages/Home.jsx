import { useEffect } from "react";
import { Link } from "react-router-dom";
import useItemStore from "../stores/itemStore";
import ItemCard from "../components/ItemCard";
import FilterBar from "../components/FilterBar";

const Home = () => {
    const { items, loading, error, fetchItems } = useItemStore();

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Mes Livres</h1>
                <Link to="/items/new" style={styles.addButton}>
                    + Ajouter un livre
                </Link>
            </div>

            <FilterBar />

            {loading && <p>Chargement...</p>}
            
            {error && <p style={styles.error}>{error}</p>}

            {!loading && items.length === 0 && (
                <p style={styles.empty}>
                    Aucun livre pour le moment. Ajoute ton premier livre !
                </p>
            )}

            <div style={styles.grid}>
                {items.map((item) => (
                    <ItemCard key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1000px",
        margin: "0 auto"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px"
    },
    error: {
        color: "red"
    },
    empty: {
        textAlign: "center",
        color: "#666",
        marginTop: "50px"
    }
};

export default Home;