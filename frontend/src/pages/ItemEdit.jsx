import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useItemStore from "../stores/itemStore";
import ItemForm from "../components/ItemForm";

const ItemEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentItem, loading, error, fetchItem, updateItem } = useItemStore();

    useEffect(() => {
        fetchItem(id);
    }, [id]);

    const handleSubmit = async (data) => {
        const result = await updateItem(id, data);
        
        if (result.success) {
            navigate(`/items/${id}`);
        }
    };

    if (loading && !currentItem) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={styles.container}>
            <Link to={`/items/${id}`} style={styles.backLink}>← Retour</Link>

            <h1>Modifier le livre</h1>

            {error && <p style={styles.error}>{error}</p>}

            {currentItem && (
                <ItemForm 
                    initialData={currentItem} 
                    onSubmit={handleSubmit} 
                    loading={loading} 
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "0 auto"
    },
    backLink: {
        color: "#333",
        textDecoration: "none",
        display: "inline-block",
        marginBottom: "20px"
    },
    error: {
        color: "red",
        marginBottom: "15px"
    }
};

export default ItemEdit;