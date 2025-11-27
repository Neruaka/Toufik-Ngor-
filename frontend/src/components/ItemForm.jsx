import { useState, useEffect } from "react";

const ItemForm = ({ initialData = {}, onSubmit, loading }) => {
    const [title, setTitle] = useState(initialData.title || "");
    const [author, setAuthor] = useState(initialData.author || "");
    const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
    const [description, setDescription] = useState(initialData.description || "");
    const [tags, setTags] = useState(initialData.tags?.join(", ") || "");

    useEffect(() => {
        if (initialData.title) {
            setTitle(initialData.title);
            setAuthor(initialData.author || "");
            setImageUrl(initialData.imageUrl || "");
            setDescription(initialData.description || "");
            setTags(initialData.tags?.join(", ") || "");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            title,
            author,
            imageUrl: imageUrl || null,
            description: description || null,
            tags: tags ? tags.split(",").map(t => t.trim()) : []
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                placeholder="Titre du livre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
            />

            <input
                type="text"
                placeholder="Auteur"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                style={styles.input}
            />

            <input
                type="url"
                placeholder="URL de l'image (optionnel)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={styles.input}
            />

            <textarea
                placeholder="Description (optionnel)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
            />

            <input
                type="text"
                placeholder="Tags séparés par des virgules (optionnel)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={styles.input}
            />

            <button type="submit" disabled={loading} style={styles.button}>
                {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
        </form>
    );
};

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        maxWidth: "500px"
    },
    input: {
        padding: "12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px"
    },
    textarea: {
        padding: "12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        minHeight: "100px",
        resize: "vertical"
    },
    button: {
        padding: "12px",
        fontSize: "16px",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default ItemForm;