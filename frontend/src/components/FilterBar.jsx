import useItemStore from "../stores/itemStore";

const FilterBar = () => {
    const { filter, setFilter, fetchItems } = useItemStore();

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        fetchItems();
    };

    const filters = [
        { value: null, label: "Tous" },
        { value: "to_read", label: "À lire" },
        { value: "reading", label: "En cours" },
        { value: "finished", label: "Terminés" }
    ];

    return (
        <div style={styles.container}>
            {filters.map((f) => (
                <button
                    key={f.value || "all"}
                    onClick={() => handleFilterChange(f.value)}
                    style={{
                        ...styles.button,
                        backgroundColor: filter === f.value ? "#333" : "#fff",
                        color: filter === f.value ? "#fff" : "#333"
                    }}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
    },
    button: {
        padding: "8px 16px",
        border: "1px solid #333",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px"
    }
};

export default FilterBar;