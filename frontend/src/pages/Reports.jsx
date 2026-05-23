import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../api/axios";

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit } = useForm();

  const fetchReport = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/reports?${params}`);
      setReport(res.data);
    } catch (err) {
      toast.error("Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const onSubmit = (data) => {
    fetchReport(data);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reports</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.filterForm}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>From</label>
          <input style={styles.input} type="date" {...register("start_date")} />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>To</label>
          <input style={styles.input} type="date" {...register("end_date")} />
        </div>
        <button style={styles.filterBtn} type="submit">
          Filter
        </button>
        <button
          style={styles.resetBtn}
          type="button"
          onClick={() => fetchReport()}
        >
          Reset
        </button>
      </form>

      {loading ? (
        <p style={styles.message}>Loading report...</p>
      ) : !report ? (
        <p style={styles.message}>No data available.</p>
      ) : (
        <>
          <div style={styles.highlights}>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Most Consumed</p>
              <p style={styles.cardValue}>{report.mostConsumed?.name || "—"}</p>
              <p style={styles.cardSub}>
                {report.mostConsumed?.total_count || 0} times
              </p>
            </div>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Highest Calories</p>
              <p style={styles.cardValue}>
                {report.highestCalorie?.name || "—"}
              </p>
              <p style={styles.cardSub}>
                {report.highestCalorie?.total_calories || 0} kcal total
              </p>
            </div>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Favourite</p>
              <p style={styles.cardValue}>{report.favourite?.name || "—"}</p>
              <p style={styles.cardSub}>
                Avg rating: {report.favourite?.average_rating || 0}
              </p>
            </div>
          </div>

          <div style={styles.totals}>
            <h3 style={styles.sectionTitle}>Overall Totals</h3>
            <div style={styles.totalsGrid}>
              <div style={styles.totalItem}>
                <p style={styles.totalValue}>
                  {report.totals?.unique_meals || 0}
                </p>
                <p style={styles.totalLabel}>Unique Meals</p>
              </div>
              <div style={styles.totalItem}>
                <p style={styles.totalValue}>
                  {report.totals?.total_entries || 0}
                </p>
                <p style={styles.totalLabel}>Total Entries</p>
              </div>
              <div style={styles.totalItem}>
                <p style={styles.totalValue}>
                  {report.totals?.total_calories || 0}
                </p>
                <p style={styles.totalLabel}>Total Calories</p>
              </div>
              <div style={styles.totalItem}>
                <p style={styles.totalValue}>
                  {report.totals?.average_rating || 0}
                </p>
                <p style={styles.totalLabel}>Avg Rating</p>
              </div>
            </div>
          </div>

          {report.breakdown.length > 0 && (
            <div style={styles.breakdown}>
              <h3 style={styles.sectionTitle}>Meal Breakdown</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Meal</th>
                    <th style={styles.th}>Times</th>
                    <th style={styles.th}>Total Calories</th>
                    <th style={styles.th}>Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {report.breakdown.map((row) => (
                    <tr key={row.meal_id}>
                      <td style={styles.td}>{row.name}</td>
                      <td style={styles.td}>{row.total_count}</td>
                      <td style={styles.td}>{row.total_calories}</td>
                      <td style={styles.td}>{row.average_rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" },
  title: { color: "#fff", marginBottom: "1.5rem" },
  filterForm: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-end",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { color: "#ccc", fontSize: "0.85rem" },
  input: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#1a1a2e",
    color: "#fff",
  },
  filterBtn: {
    backgroundColor: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.2rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  resetBtn: {
    backgroundColor: "#16213e",
    color: "#fff",
    border: "1px solid #333",
    padding: "0.5rem 1.2rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  highlights: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "1.2rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  cardLabel: { color: "#888", fontSize: "0.8rem", margin: "0 0 0.3rem" },
  cardValue: {
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "bold",
    margin: "0 0 0.2rem",
  },
  cardSub: { color: "#e94560", fontSize: "0.85rem", margin: 0 },
  totals: { marginBottom: "2rem" },
  sectionTitle: { color: "#fff", marginBottom: "1rem" },
  totalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
  },
  totalItem: {
    backgroundColor: "#1a1a2e",
    padding: "1rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  totalValue: {
    color: "#e94560",
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0 0 0.3rem",
  },
  totalLabel: { color: "#ccc", fontSize: "0.8rem", margin: 0 },
  breakdown: { marginBottom: "2rem" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    color: "#888",
    fontSize: "0.85rem",
    padding: "0.6rem",
    textAlign: "left",
    borderBottom: "1px solid #333",
  },
  td: {
    color: "#fff",
    padding: "0.6rem",
    borderBottom: "1px solid #1a1a2e",
    fontSize: "0.9rem",
  },
  message: { color: "#ccc", textAlign: "center", marginTop: "3rem" },
};

export default Reports;
