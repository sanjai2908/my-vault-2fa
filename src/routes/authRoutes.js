const express = require("express");
const router = express.Router();
const {
  register,
  login,
  enableAuthenticator,
  verifyAuthenticatorOTP,
  disableAuthenticator,
  getBackupCodes,
  regenerateBackupCodes,
} = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
  checkAuthenticatorEnabled,
  resetPasswordWithAuthenticator,
  resetPasswordWithBackupCode,
} = require("../controllers/passwordController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Authenticator routes
router.post("/authenticator/enable", protect, enableAuthenticator);
router.post("/authenticator/verify", protect, verifyAuthenticatorOTP);
router.post("/authenticator/disable", protect, disableAuthenticator);
router.get("/authenticator/backup-codes", protect, getBackupCodes);
router.post(
  "/authenticator/regenerate-backup-codes",
  protect,
  regenerateBackupCodes,
);
router.get("/check-authenticator/:email", checkAuthenticatorEnabled);
router.post("/reset-password-authenticator", resetPasswordWithAuthenticator);
router.post("/reset-password-backup-code", resetPasswordWithBackupCode);

module.exports = router;
