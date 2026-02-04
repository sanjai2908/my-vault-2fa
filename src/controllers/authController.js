const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const crypto = require("crypto");

// Generate random backup code
const generateBackupCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// Generate 10 backup codes
const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push({
      code: generateBackupCode(),
      used: false,
    });
  }
  return codes;
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Register request received:", { name, email });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log("User created successfully:", user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email });

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("Login successful for user:", email);

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Enable Authenticator App
// @route   POST /api/auth/authenticator/enable
// @access  Private
exports.enableAuthenticator = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "+authenticatorSecret",
    );

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `My Vault (${user.email})`,
      issuer: "My Vault",
      length: 32,
    });

    // Save secret to user (not enabled yet, until verified)
    user.authenticatorSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.status(200).json({
      success: true,
      message: "QR code generated successfully",
      qrCode,
      secret: secret.base32,
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    console.error("Enable authenticator error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Authenticator OTP and Enable it
// @route   POST /api/auth/authenticator/verify
// @access  Private
exports.verifyAuthenticatorOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const user = await User.findById(req.user.id).select(
      "+authenticatorSecret",
    );

    if (!user.authenticatorSecret) {
      return res.status(400).json({
        success: false,
        message: "Authenticator secret not found. Enable authenticator first.",
      });
    }

    // Verify OTP
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

    // Enable authenticator for user
    user.isAuthenticatorEnabled = true;

    // Generate backup codes
    user.backupCodes = generateBackupCodes();
    await user.save();

    // Return backup codes to user (only time they see them)
    const backupCodes = user.backupCodes.map((bc) => bc.code);

    res.status(200).json({
      success: true,
      message: "Authenticator enabled successfully",
      backupCodes: backupCodes,
    });
  } catch (error) {
    console.error("Verify authenticator error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Disable Authenticator App
// @route   POST /api/auth/authenticator/disable
// @access  Private
exports.disableAuthenticator = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required to disable authenticator",
      });
    }

    const user = await User.findById(req.user.id).select(
      "+authenticatorSecret",
    );

    if (!user.isAuthenticatorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Authenticator is not enabled",
      });
    }

    // Verify OTP before disabling
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

    // Disable authenticator
    user.authenticatorSecret = null;
    user.isAuthenticatorEnabled = false;
    user.backupCodes = []; // Clear backup codes
    await user.save();

    res.status(200).json({
      success: true,
      message: "Authenticator disabled successfully",
    });
  } catch (error) {
    console.error("Disable authenticator error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Backup Codes
// @route   GET /api/auth/authenticator/backup-codes
// @access  Private
exports.getBackupCodes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.isAuthenticatorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Authenticator is not enabled",
      });
    }

    const unusedCodes = user.backupCodes
      .filter((bc) => !bc.used)
      .map((bc) => bc.code);

    res.status(200).json({
      success: true,
      backupCodes: unusedCodes,
      total: user.backupCodes.length,
      used: user.backupCodes.filter((bc) => bc.used).length,
    });
  } catch (error) {
    console.error("Get backup codes error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Regenerate Backup Codes
// @route   POST /api/auth/authenticator/regenerate-backup-codes
// @access  Private
exports.regenerateBackupCodes = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required to regenerate backup codes",
      });
    }

    const user = await User.findById(req.user.id).select(
      "+authenticatorSecret",
    );

    if (!user.isAuthenticatorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Authenticator is not enabled",
      });
    }

    // Verify OTP before regenerating
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

    // Generate new backup codes
    user.backupCodes = generateBackupCodes();
    await user.save();

    const backupCodes = user.backupCodes.map((bc) => bc.code);

    res.status(200).json({
      success: true,
      message: "Backup codes regenerated successfully",
      backupCodes: backupCodes,
    });
  } catch (error) {
    console.error("Regenerate backup codes error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
