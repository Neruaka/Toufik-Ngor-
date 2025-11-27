import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const Register = () => {
    const navigate = useNavigate();
    const { register, loading, error } = useAuthStore();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        // vérifier que les mots de passe correspondent
        if (password !== confirmPassword) {
            setLocalError("Les mots de passe ne correspondent pas");
            return;
        }

        const result = await register(email, username, password);

        if (result.success) {
            navigate("/login");
        }
    };

    return (
        <div style={styles.container}>
            <h1>Inscription</h1>

            {(error || localError) && (
                <p style={styles.error}>{localError || error}</p>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
            </form>

            <p style={styles.link}>
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    input: {
        padding: "12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px"
    },
    button: {
        padding: "12px",
        fontSize: "16px",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    error: {
        color: "red",
        marginBottom: "10px"
    },
    link: {
        marginTop: "20px"
    }
};

export default Register;
