import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate("/signin");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🍽 Meal Tracker
      </Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/meals" style={styles.link}>
              My Meals
            </Link>
            <Link to="/meals/new" style={styles.link}>
              Log Meal
            </Link>
            <Link to="/reports" style={styles.link}>
              Reports
            </Link>
            <button onClick={handleSignout} style={styles.button}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" style={styles.link}>
              Sign In
            </Link>
            <Link to="/signup" style={styles.link}>
              Sign Up
            </Link>
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
    padding: "1rem 2rem",
    backgroundColor: "#1a1a2e",
    color: "#fff",
  },
  brand: {
    color: "#e94560",
    textDecoration: "none",
    fontSize: "1.4rem",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "1.2rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.95rem",
  },
  button: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.4rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
};

export default Navbar;
