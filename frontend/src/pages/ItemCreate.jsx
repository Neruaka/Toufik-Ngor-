import { useNavigate } from "react-router-dom";
import useItemStore from "../stores/itemStore";
import ItemForm from "../components/ItemForm";

const ItemCreate = () => {
    const navigate = useNavigate();
    const { createItem, loading, error } = useItemStore();

    const handleSubmit = async (data) => {
        const result = await createItem(data);
        
        if (result.success) {
            navigate("/");
        }
    };

    return (
        <div style={styles.container}>
            <h1>Ajouter un livre</h1>

            {error && <p style={styles.error}>{error}</p>}

            <ItemForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "0 auto"
    },
    error: {
        color: "red",
        marginBottom: "15px"
    }
};

export default ItemCreate;