import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // style dynamique pour NavLink
    const getNavLinkStyle = ({ isActive }) => ({
        color: isActive ? "#f5c518" : "#fff",
        textDecoration: "none",
        fontWeight: isActive ? "bold" : "normal"
    });

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <NavLink to="/" style={getNavLinkStyle}>
                    📚 Ma Bibliothèque
                </NavLink>
            </div>

            <div style={styles.right}>
                {isAuthenticated ? (
                    <>
                        <NavLink to="/items/new" style={getNavLinkStyle}>
                            + Ajouter
                        </NavLink>
                        <span style={styles.username}>
                            {user?.username || "Utilisateur"}
                        </span>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" style={getNavLinkStyle}>
                            Connexion
                        </NavLink>
                        <NavLink to="/register" style={getNavLinkStyle}>
                            Inscription
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#333",
        color: "#fff"
    },
    left: {
        display: "flex",
        alignItems: "center"
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },
    username: {
        color: "#aaa",
        fontSize: "14px"
    },
    logoutButton: {
        padding: "8px 15px",
        backgroundColor: "transparent",
        color: "#fff",
        border: "1px solid #fff",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px"
    }
};

export default Navbar;