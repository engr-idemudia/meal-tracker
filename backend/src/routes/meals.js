const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const {
  getAllMeals,
  getUserMeals,
  createUserMeal,
  updateUserMeal,
  deleteUserMeal,
} = require("../controllers/mealsController");

// Public — get all known meals for dropdown
router.get("/meals", getAllMeals);

// Protected — user meal entries
router.get("/user-meals", authMiddleware, getUserMeals);
router.post(
  "/user-meals",
  authMiddleware,
  upload.single("image"),
  createUserMeal,
);
router.put(
  "/user-meals/:id",
  authMiddleware,
  upload.single("image"),
  updateUserMeal,
);
router.delete("/user-meals/:id", authMiddleware, deleteUserMeal);

module.exports = router;
