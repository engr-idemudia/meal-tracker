const pool = require("../db/pool");

const getReports = async (req, res) => {
  const userId = req.userId;
  const { start_date, end_date } = req.query;

  const dateFilter = (column) => {
    const conditions = [];
    const values = [];

    if (start_date) {
      values.push(`${start_date} 00:00:00`);
      conditions.push(`${column} >= $${values.length}`);
    }
    if (end_date) {
      values.push(`${end_date} 23:59:59`);
      conditions.push(`${column} <= $${values.length}`);
    }

    return { conditions, values };
  };

  try {
    const { conditions, values } = dateFilter("um.created_at");
    const dateWhere =
      conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

    // Most consumed meal
    const mostConsumed = await pool.query(
      `SELECT um.meal_id, COUNT(um.meal_id) AS total_count, m.name
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = $${values.length + 1} ${dateWhere}
       GROUP BY um.meal_id, m.name
       ORDER BY total_count DESC
       LIMIT 1`,
      [...values, userId],
    );

    // Highest calorie meal
    const highestCalorie = await pool.query(
      `SELECT um.meal_id, SUM(um.calories) AS total_calories, m.name
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = $${values.length + 1} ${dateWhere}
       GROUP BY um.meal_id, m.name
       ORDER BY total_calories DESC
       LIMIT 1`,
      [...values, userId],
    );

    // Favourite meal (highest average rating)
    const favourite = await pool.query(
      `SELECT um.meal_id, AVG(um.rating) AS average_rating, m.name
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = $${values.length + 1} ${dateWhere}
       GROUP BY um.meal_id, m.name
       ORDER BY average_rating DESC
       LIMIT 1`,
      [...values, userId],
    );

    // Totals
    const totals = await pool.query(
      `SELECT
         COUNT(DISTINCT um.meal_id) AS unique_meals,
         COUNT(um.id) AS total_entries,
         SUM(um.calories) AS total_calories,
         ROUND(AVG(um.rating)::numeric, 2) AS average_rating
       FROM user_meals um
       WHERE um.user_id = $${values.length + 1} ${dateWhere}`,
      [...values, userId],
    );

    // Per meal breakdown (paginated)
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const breakdown = await pool.query(
      `SELECT um.meal_id, m.name,
         COUNT(um.meal_id) AS total_count,
         SUM(um.calories) AS total_calories,
         ROUND(AVG(um.rating)::numeric, 2) AS average_rating
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = $${values.length + 1} ${dateWhere}
       GROUP BY um.meal_id, m.name
       ORDER BY total_count DESC
       LIMIT $${values.length + 2} OFFSET $${values.length + 3}`,
      [...values, userId, limit, offset],
    );

    res.json({
      mostConsumed: mostConsumed.rows[0] || null,
      highestCalorie: highestCalorie.rows[0] || null,
      favourite: favourite.rows[0] || null,
      totals: totals.rows[0],
      breakdown: breakdown.rows,
      page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { getReports };
