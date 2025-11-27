import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const ItemCard = ({ item }) => {
    const statusLabels = {
        to_read: "À lire",
        reading: "En cours",
        finished: "Terminé"
    };

    const statusColors = {
        to_read: "#e74c3c",
        reading: "#f39c12",
        finished: "#27ae60"
    };

    return (
        <Link to={`/items/${item._id}`} style={styles.link}>
            <div style={styles.card}>
                {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} style={styles.image} />
                )}
                
                <div style={styles.content}>
                    <h3 style={styles.title}>{item.title}</h3>
                    <p style={styles.author}>{item.author}</p>
                    
                    <span style={{
                        ...styles.status,
                        backgroundColor: statusColors[item.status]
                    }}>
                        {statusLabels[item.status]}
                    </span>

                    {item.rating && (
                        <StarRating rating={item.rating} readonly />
                    )}
                </div>
            </div>
        </Link>
    );
};

const styles = {
    link: {
        textDecoration: "none",
        color: "inherit"
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        backgroundColor: "#fff",
        transition: "box-shadow 0.2s",
        cursor: "pointer"
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
        borderRadius: "5px",
        marginBottom: "10px"
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    title: {
        margin: 0,
        fontSize: "16px"
    },
    author: {
        margin: 0,
        color: "#666",
        fontSize: "14px"
    },
    status: {
        alignSelf: "flex-start",
        padding: "4px 8px",
        borderRadius: "4px",
        color: "#fff",
        fontSize: "12px"
    }
};

export default ItemCard;