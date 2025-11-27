const StarRating = ({ rating, onRate, readonly = false }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div style={styles.container}>
            {stars.map((star) => (
                <span
                    key={star}
                    onClick={() => !readonly && onRate && onRate(star)}
                    style={{
                        ...styles.star,
                        color: star <= rating ? "#f5c518" : "#ccc",
                        cursor: readonly ? "default" : "pointer"
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        gap: "5px"
    },
    star: {
        fontSize: "24px"
    }
};

export default StarRating;