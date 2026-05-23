const pool = require("../db/pool");

// GET /api/meals — all known meals (for dropdown)
const getAllMeals = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM meals ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

// GET /api/user-meals — current user's logged meals (paginated)
const getUserMeals = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT um.*, m.name AS meal_name
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = $1
       ORDER BY um.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.userId, limit, offset],
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM user_meals WHERE user_id = $1",
      [req.userId],
    );

    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

// POST /api/user-meals — log a meal
const createUserMeal = async (req, res) => {
  const { meal_id, meal_name, calories, rating } = req.body;
  const image_url = req.file ? req.file.path : null;

  if (!calories || !rating)
    return res.status(400).json({ error: "Calories and rating are required." });

  if (rating < 0 || rating > 5)
    return res.status(400).json({ error: "Rating must be between 0 and 5." });

  try {
    let finalMealId = meal_id;

    // if meal_id is 0, user typed a new meal name
    if (!meal_id || parseInt(meal_id) === 0) {
      if (!meal_name || meal_name.trim().length === 0)
        return res.status(400).json({ error: "Meal name is required." });

      const existing = await pool.query(
        "SELECT id FROM meals WHERE name = $1",
        [meal_name.trim()],
      );

      if (existing.rows.length > 0) {
        finalMealId = existing.rows[0].id;
      } else {
        const newMeal = await pool.query(
          "INSERT INTO meals (name) VALUES ($1) RETURNING id",
          [meal_name.trim()],
        );
        finalMealId = newMeal.rows[0].id;
      }
    }

    const result = await pool.query(
      `INSERT INTO user_meals (user_id, meal_id, calories, rating, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.userId, finalMealId, calories, rating, image_url],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

// PUT /api/user-meals/:id — update a meal entry
const updateUserMeal = async (req, res) => {
  const { id } = req.params;
  const { meal_id, meal_name, calories, rating } = req.body;
  const image_url = req.file ? req.file.path : null;

  try {
    const existing = await pool.query(
      "SELECT * FROM user_meals WHERE id = $1 AND user_id = $2",
      [id, req.userId],
    );

    if (existing.rows.length === 0)
      return res.status(404).json({ error: "Meal entry not found." });

    let finalMealId = meal_id;

    if (!meal_id || parseInt(meal_id) === 0) {
      if (!meal_name || meal_name.trim().length === 0)
        return res.status(400).json({ error: "Meal name is required." });

      const mealExists = await pool.query(
        "SELECT id FROM meals WHERE name = $1",
        [meal_name.trim()],
      );

      if (mealExists.rows.length > 0) {
        finalMealId = mealExists.rows[0].id;
      } else {
        const newMeal = await pool.query(
          "INSERT INTO meals (name) VALUES ($1) RETURNING id",
          [meal_name.trim()],
        );
        finalMealId = newMeal.rows[0].id;
      }
    }

    const updatedImageUrl = image_url || existing.rows[0].image_url;

    const result = await pool.query(
      `UPDATE user_meals
       SET meal_id = $1, calories = $2, rating = $3, image_url = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [finalMealId, calories, rating, updatedImageUrl, id, req.userId],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

// DELETE /api/user-meals/:id — delete a meal entry
const deleteUserMeal = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM user_meals WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Meal entry not found." });

    res.json({ message: "Meal entry deleted." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  getAllMeals,
  getUserMeals,
  createUserMeal,
  updateUserMeal,
  deleteUserMeal,
};
