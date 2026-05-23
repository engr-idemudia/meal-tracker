import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../api/axios";

const EditMeal = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const selectedMealId = watch("meal_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, entryRes] = await Promise.all([
          api.get("/meals"),
          api.get(`/user-meals/${id}`),
        ]);
        setMeals(mealsRes.data);
        const entry = entryRes.data;
        reset({
          meal_id: entry.meal_id,
          calories: entry.calories,
          rating: entry.rating,
        });
      } catch (err) {
        toast.error("Failed to load meal data.");
        navigate("/meals");
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("meal_id", data.meal_id);
      formData.append("meal_name", data.meal_name || "");
      formData.append("calories", data.calories);
      formData.append("rating", data.rating);
      if (data.image[0]) formData.append("image", data.image[0]);

      await api.put(`/user-meals/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Meal updated successfully.");
      navigate("/meals");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update meal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Meal</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Meal</label>
            <select
              style={styles.input}
              {...register("meal_id", { required: "Please select a meal." })}
            >
              <option value="">-- Select a meal --</option>
              {meals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
              <option value="0">Other (type below)</option>
            </select>
            {errors.meal_id && (
              <p style={styles.error}>{errors.meal_id.message}</p>
            )}
          </div>

          {String(selectedMealId) === "0" && (
            <div style={styles.field}>
              <label style={styles.label}>Meal Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter meal name"
                {...register("meal_name", {
                  required: "Meal name is required.",
                })}
              />
              {errors.meal_name && (
                <p style={styles.error}>{errors.meal_name.message}</p>
              )}
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Calories</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              {...register("calories", {
                required: "Calories are required.",
                min: { value: 1, message: "Must be at least 1." },
              })}
            />
            {errors.calories && (
              <p style={styles.error}>{errors.calories.message}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Rating (0 – 5)</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              max="5"
              {...register("rating", {
                required: "Rating is required.",
                min: { value: 0, message: "Minimum is 0." },
                max: { value: 5, message: "Maximum is 5." },
              })}
            />
            {errors.rating && (
              <p style={styles.error}>{errors.rating.message}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Image (optional — replaces existing)
            </label>
            <input
              style={styles.input}
              type="file"
              accept="image/*"
              {...register("image")}
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Meal"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f1a",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "2.5rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "480px",
  },
  title: { color: "#fff", marginBottom: "1.5rem", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { color: "#ccc", fontSize: "0.9rem" },
  input: {
    padding: "0.6rem",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#0f0f1a",
    color: "#fff",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
  error: { color: "#e94560", fontSize: "0.8rem", margin: 0 },
};

export default EditMeal;
