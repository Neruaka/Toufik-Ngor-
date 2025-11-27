import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useItemStore from "../stores/itemStore";
import StarRating from "../components/StarRating";

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentItem, loading, error, fetchItem, updateItem, deleteItem } = useItemStore();

    useEffect(() => {
        fetchItem(id);
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        await updateItem(id, { status: newStatus });
    };

    const handleRatingChange = async (newRating) => {
        await updateItem(id, { rating: newRating });
    };

    const handleDelete = async () => {
        if (window.confirm("Supprimer ce livre ?")) {
            const result = await deleteItem(id);
            if (result.success) {
                navigate("/");
            }
        }
    };

    const statusLabels = {
        to_read: "À lire",
        reading: "En cours",
        finished: "Terminé"
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!currentItem) return <p>Livre non trouvé</p>;

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.backLink}>← Retour</Link>

            <div style={styles.content}>
                {currentItem.imageUrl && (
                    <img 
                        src={currentItem.imageUrl} 
                        alt={currentItem.title} 
                        style={styles.image} 
                    />
                )}

                <div style={styles.info}>
                    <h1 style={styles.title}>{currentItem.title}</h1>
                    <p style={styles.author}>par {currentItem.author}</p>

                    {currentItem.description && (
                        <p style={styles.description}>{currentItem.description}</p>
                    )}

                    {currentItem.tags && currentItem.tags.length > 0 && (
                        <div style={styles.tags}>
                            {currentItem.tags.map((tag, index) => (
                                <span key={index} style={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* statut */}
                    <div style={styles.section}>
                        <h3>Statut</h3>
                        <div style={styles.statusButtons}>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => handleStatusChange(value)}
                                    style={{
                                        ...styles.statusButton,
                                        backgroundColor: currentItem.status === value ? "#333" : "#fff",
                                        color: currentItem.status === value ? "#fff" : "#333"
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* note */}
                    <div style={styles.section}>
                        <h3>Ma note</h3>
                        <StarRating 
                            rating={currentItem.rating || 0} 
                            onRate={handleRatingChange} 
                        />
                    </div>

                    {/* actions */}
                    <div style={styles.actions}>
                        <Link to={`/items/${id}/edit`} style={styles.editButton}>
                            Modifier
                        </Link>
                        <button onClick={handleDelete} style={styles.deleteButton}>
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto"
    },
    backLink: {
        color: "#333",
        textDecoration: "none",
        display: "inline-block",
        marginBottom: "20px"
    },
    content: {
        display: "flex",
        gap: "30px",
        flexWrap: "wrap"
    },
    image: {
        width: "250px",
        height: "350px",
        objectFit: "cover",
        borderRadius: "8px"
    },
    info: {
        flex: 1,
        minWidth: "300px"
    },
    title: {
        margin: "0 0 10px 0"
    },
    author: {
        color: "#666",
        fontSize: "18px",
        marginBottom: "20px"
    },
    description: {
        lineHeight: "1.6",
        marginBottom: "20px"
    },
    tags: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "20px"
    },
    tag: {
        backgroundColor: "#eee",
        padding: "4px 10px",
        borderRadius: "15px",
        fontSize: "14px"
    },
    section: {
        marginBottom: "25px"
    },
    statusButtons: {
        display: "flex",
        gap: "10px"
    },
    statusButton: {
        padding: "8px 16px",
        border: "1px solid #333",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px"
    },
    actions: {
        display: "flex",
        gap: "15px",
        marginTop: "30px"
    },
    editButton: {
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px"
    },
    deleteButton: {
        padding: "10px 20px",
        backgroundColor: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default ItemDetail;