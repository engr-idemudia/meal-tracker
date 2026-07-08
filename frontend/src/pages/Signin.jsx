import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { signin } = useAuth();
  const navigate = useNavigate();

  const fillDemo = () => {
    setValue("email", "demo@idemudia.dev");
    setValue("password", "password123");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", data);
      signin(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/meals");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signin failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.column}>
        <div style={styles.demoBox} onClick={fillDemo}>
          <p style={styles.demoTitle}>Demo login — click to fill the form</p>
          <p style={styles.demoLine}>
            Email: <strong>demo@idemudia.dev</strong>
          </p>
          <p style={styles.demoLine}>
            Password: <strong>password123</strong>
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Sign In</h2>
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                {...register("email", { required: "Email is required." })}
              />
              {errors.email && (
                <p style={styles.error}>{errors.email.message}</p>
              )}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                {...register("password", { required: "Password is required." })}
              />
              {errors.password && (
                <p style={styles.error}>{errors.password.message}</p>
              )}
            </div>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={styles.footer}>
            No account?{" "}
            <Link to="/signup" style={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
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
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "420px",
  },
  demoBox: {
    border: "1px solid #e94560",
    borderRadius: "8px",
    padding: "1rem",
    cursor: "pointer",
    backgroundColor: "#1a1a2e",
  },
  demoTitle: { color: "#fff", margin: "0 0 0.5rem 0", fontSize: "0.9rem" },
  demoLine: { color: "#ccc", margin: 0, fontSize: "0.9rem" },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "2.5rem",
    borderRadius: "8px",
    width: "100%",
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

export default Signin;
