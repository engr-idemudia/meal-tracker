import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import MealCard from "../components/MealCard";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchMeals = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/user-meals?page=${p}`);
      setMeals(res.data.data);
      setTotalPages(res.data.totalPages);
      setPage(p);
    } catch (err) {
      toast.error("Failed to load meals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDelete = (id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Meals</h2>
        <Link to="/meals/new" style={styles.addBtn}>
          + Log Meal
        </Link>
      </div>

      {loading ? (
        <p style={styles.message}>Loading...</p>
      ) : meals.length === 0 ? (
        <p style={styles.message}>
          No meals logged yet.{" "}
          <Link to="/meals/new" style={styles.link}>
            Log your first meal.
          </Link>
        </p>
      ) : (
        <>
          <div style={styles.grid}>
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
            ))}
          </div>
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              onClick={() => fetchMeals(page - 1)}
              disabled={page <= 1}
            >
              ← Prev
            </button>
            <span style={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              style={styles.pageBtn}
              onClick={() => fetchMeals(page + 1)}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: { color: "#fff", margin: 0 },
  addBtn: {
    backgroundColor: "#e94560",
    color: "#fff",
    padding: "0.5rem 1.2rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.2rem",
  },
  message: { color: "#ccc", textAlign: "center", marginTop: "3rem" },
  link: { color: "#e94560" },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2rem",
  },
  pageBtn: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    border: "1px solid #333",
    padding: "0.4rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  pageInfo: { color: "#ccc", fontSize: "0.9rem" },
};

export default Meals;
