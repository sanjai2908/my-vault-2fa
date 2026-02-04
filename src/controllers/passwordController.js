const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const speakeasy = require("speakeasy");
const crypto = require("crypto");

// @desc    Request password reset (generate and send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiry (10 minutes)
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send OTP via email
    const message = `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset OTP",
        message,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Use the OTP below:</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
              ${otp}
            </div>
            <p><strong>This OTP is valid for 10 minutes.</strong></p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      });

      res.status(200).json({
        success: true,
        message: "OTP sent to email successfully",
      });
    } catch (error) {
      // If email fails, clear OTP from database
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Error sending email. Please try again later.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, OTP and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find user with OTP
    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpiry: { $gt: Date.now() },
    }).select("+resetOtp +resetOtpExpiry");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check if user has authenticator enabled
// @route   GET /api/auth/check-authenticator/:email
// @access  Public
exports.checkAuthenticatorEnabled = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    res.status(200).json({
      success: true,
      isAuthenticatorEnabled: user.isAuthenticatorEnabled,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset password using Authenticator OTP (Email not required)
// @route   POST /api/auth/reset-password-authenticator
// @access  Public
exports.resetPasswordWithAuthenticator = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, OTP and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find user
    const user = await User.findOne({ email }).select(
      "+authenticatorSecret +isAuthenticatorEnabled",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    if (!user.isAuthenticatorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Authenticator is not enabled for this user",
      });
    }

    // Verify OTP against authenticator secret
    const verified = speakeasy.totp.verify({
      secret: user.authenticatorSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully using Authenticator. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset password using backup code
// @route   POST /api/auth/reset-password-backup-code
// @access  Public
exports.resetPasswordWithBackupCode = async (req, res) => {
  try {
    const { email, backupCode, newPassword } = req.body;

    // Validate input
    if (!email || !backupCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, backup code and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find user with authenticatorSecret selected
    const user = await User.findOne({ email }).select("+authenticatorSecret");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    if (!user.isAuthenticatorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Authenticator is not enabled for this user",
      });
    }

    // Find and verify backup code
    const backupCodeEntry = user.backupCodes.find(
      (bc) => bc.code === backupCode.toUpperCase() && !bc.used,
    );

    if (!backupCodeEntry) {
      return res.status(400).json({
        success: false,
        message: "Invalid or already used backup code",
      });
    }

    // Mark backup code as used
    backupCodeEntry.used = true;
    backupCodeEntry.usedAt = new Date();

    // Update password
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully using backup code. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
