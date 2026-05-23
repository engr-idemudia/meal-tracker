import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const MealCard = ({ meal, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm("Delete this meal entry?")) return;
    try {
      await api.delete(`/user-meals/${meal.id}`);
      toast.success("Meal deleted.");
      onDelete(meal.id);
    } catch (err) {
      toast.error("Failed to delete meal.");
    }
  };

  return (
    <div style={styles.card}>
      {meal.image_url && (
        <img src={meal.image_url} alt={meal.meal_name} style={styles.image} />
      )}
      <div style={styles.body}>
        <h3 style={styles.name}>{meal.meal_name}</h3>
        <p style={styles.meta}>🔥 {meal.calories} kcal</p>
        <p style={styles.meta}>⭐ {meal.rating} / 5</p>
        <p style={styles.date}>
          {new Date(meal.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div style={styles.actions}>
          <Link to={`/meals/${meal.id}/edit`} style={styles.editBtn}>
            Edit
          </Link>
          <button onClick={handleDelete} style={styles.deleteBtn}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  image: { width: "100%", height: "180px", objectFit: "cover" },
  body: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  name: { color: "#fff", margin: 0, fontSize: "1.1rem" },
  meta: { color: "#ccc", margin: 0, fontSize: "0.9rem" },
  date: { color: "#888", fontSize: "0.8rem", margin: 0 },
  actions: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" },
  editBtn: {
    backgroundColor: "#16213e",
    color: "#fff",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "0.85rem",
  },
  deleteBtn: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
};

export default MealCard;
