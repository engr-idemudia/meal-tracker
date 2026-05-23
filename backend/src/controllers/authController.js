const pool = require("../db/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: "Email already in use." });

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, password_hash],
    );

    res.status(201).json({ message: "Account created.", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { signup, signin };
