const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { uploadProfile } = require("../config/multer");

router.get("/profile", protect, getProfile);
router.put(
  "/profile",
  protect,
  uploadProfile.single("profileImage"),
  updateProfile,
);
router.put("/change-password", protect, changePassword);

module.exports = router;
