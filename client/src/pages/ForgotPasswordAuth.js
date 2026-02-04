import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordAuth.css";
import { API_BASE_URL } from "../utils/apiConfig";

const ForgotPasswordAuth = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Choose method, 3: Reset
  const [email, setEmail] = useState("");
  const [resetMethod, setResetMethod] = useState(""); // "authenticator" or "backup"
  const [otp, setOtp] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Step 1: Check email and verify authenticator is enabled
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/check-authenticator/${email}`,
      );

      if (!response.data.isAuthenticatorEnabled) {
        setError(
          "⚠️ Authenticator App not enabled for this account. Please enable it in Security settings first.",
        );
        setLoading(false);
        return;
      }

      setStep(2); // Move to method selection
      setSuccess("");
    } catch (err) {
      setError(err.response?.data?.message || "Error checking email");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Choose reset method
  const handleChooseMethod = (method) => {
    setResetMethod(method);
    setStep(3);
    setError("");
    if (method === "authenticator") {
      setSuccess("✅ Enter the 6-digit OTP from your authenticator app");
    } else {
      setSuccess("✅ Enter one of your 8-character backup codes");
    }
  };

  // Step 3: Verify and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (resetMethod === "authenticator") {
      if (!otp || otp.length !== 6) {
        setError("OTP must be 6 digits");
        setLoading(false);
        return;
      }
    } else {
      if (!backupCode || backupCode.length !== 8) {
        setError("Backup code must be 8 characters");
        setLoading(false);
        return;
      }
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      let endpoint = `${API_BASE_URL}/auth/reset-password-authenticator`;
      let data = { email, otp, newPassword };

      if (resetMethod === "backup") {
        endpoint = `${API_BASE_URL}/auth/reset-password-backup-code`;
        data = { email, backupCode, newPassword };
      }

      const response = await axios.post(endpoint, data);

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="forgot-password-auth-container">
      <div className="forgot-password-auth-card">
        <h1>🔐 Reset Password</h1>

        {step === 1 && (
          <form onSubmit={handleCheckEmail} className="forgot-password-form">
            <h2>Step 1: Enter Your Email</h2>
            <p className="info-text">
              You need Authenticator App enabled to reset your password
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Checking..." : "Next"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="method-selection">
            <h2>Step 2: Choose Reset Method</h2>
            <p className="info-text">
              How would you like to verify your identity?
            </p>

            <div className="method-options">
              <button
                className="method-btn authenticator-method"
                onClick={() => handleChooseMethod("authenticator")}
              >
                🔑 Authenticator App
                <span>Use your authenticator app OTP</span>
              </button>

              <button
                className="method-btn backup-method"
                onClick={() => handleChooseMethod("backup")}
              >
                💾 Backup Code
                <span>Use one of your backup codes</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="reset-form">
            <h2>Step 3: Verify & Reset Password</h2>

            {resetMethod === "authenticator" && (
              <div className="authenticator-section">
                <p className="info-text">
                  🔑 Enter the 6-digit OTP from your authenticator app
                </p>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength="6"
                  required
                  disabled={loading}
                  className="form-input otp-input"
                />
              </div>
            )}

            {resetMethod === "backup" && (
              <div className="backup-section">
                <p className="info-text">
                  💾 Enter one of your 8-character backup codes
                </p>
                <input
                  type="text"
                  placeholder="ABCD1234"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  maxLength="8"
                  required
                  disabled={loading}
                  className="form-input backup-input"
                />
                <p className="hint-text">
                  ⚠️ Each backup code can only be used once
                </p>
              </div>
            )}

            <div className="password-section">
              <p className="section-title">Set New Password</p>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                className="form-input"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button className="btn-back" onClick={handleBack}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordAuth;
