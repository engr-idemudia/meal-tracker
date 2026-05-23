import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/signup", data);
      toast.success("Account created. Please sign in.");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              {...register("email", { required: "Email is required." })}
            />
            {errors.email && <p style={styles.error}>{errors.email.message}</p>}
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              {...register("password", {
                required: "Password is required.",
                minLength: { value: 6, message: "Minimum 6 characters." },
              })}
            />
            {errors.password && (
              <p style={styles.error}>{errors.password.message}</p>
            )}
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/signin" style={styles.link}>
            Sign in
          </Link>
        </p>
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
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "2.5rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "420px",
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
  footer: {
    color: "#ccc",
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.9rem",
  },
  link: { color: "#e94560" },
};

export default Signup;
