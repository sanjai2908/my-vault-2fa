import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthenticatorSetup.css";

const API_BASE_URL = "http://localhost:5000/api";

const AuthenticatorSetup = () => {
  const [step, setStep] = useState(1); // 1: Display QR, 2: Verify OTP, 3: Show Backup Codes
  const [qrCode, setQrCode] = useState(null);
  const [manualKey, setManualKey] = useState(null);
  const [otp, setOtp] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showManualKey, setShowManualKey] = useState(false);
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Step 1: Generate QR Code
  const handleEnableAuthenticator = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/authenticator/enable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setQrCode(response.data.qrCode);
      setManualKey(response.data.manualEntryKey);
      setStep(2);
      setSuccess("QR code generated! Scan it with Google Authenticator.");
    } catch (err) {
      setError(err.response?.data?.message || "Error generating QR code");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || otp.length !== 6) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/authenticator/verify`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setBackupCodes(response.data.backupCodes || []);
      setSuccess(response.data.message);
      setStep(3); // Move to backup codes display
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    const content = `My Vault - Backup Codes\n\n${backupCodes.join("\n")}\n\nIMPORTANT:\n- Save these codes in a secure location\n- Each code can only be used once\n- You can regenerate codes from Security settings`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-vault-backup-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy backup codes to clipboard
  const copyBackupCodes = () => {
    const content = backupCodes.join("\n");
    navigator.clipboard.writeText(content);
    alert("Backup codes copied to clipboard!");
  };

  // Complete setup
  const handleComplete = () => {
    navigate("/dashboard");
  };

  // Reset and go back
  const handleCancel = () => {
    setStep(1);
    setQrCode(null);
    setManualKey(null);
    setOtp("");
    setError("");
    setSuccess("");
    navigate("/dashboard");
  };

  return (
    <div className="authenticator-container">
      <div className="authenticator-card">
        <h1>🔐 Setup Authenticator App</h1>

        {step === 1 && (
          <div className="authenticator-step">
            <h2>Step 1: Enable Authenticator</h2>
            <p>
              Use this QR code to set up two-factor authentication with Google
              Authenticator or any TOTP app.
            </p>

            <button
              className="btn-primary"
              onClick={handleEnableAuthenticator}
              disabled={loading}
            >
              {loading ? "Generating QR Code..." : "Generate QR Code"}
            </button>
          </div>
        )}

        {step === 2 && qrCode && (
          <div className="authenticator-step">
            <h2>Step 2: Scan & Verify</h2>

            <div className="qr-section">
              <h3>Scan this QR code with your authenticator app:</h3>
              <img src={qrCode} alt="QR Code" className="qr-code" />
            </div>

            {!showManualKey && (
              <button
                className="btn-link"
                onClick={() => setShowManualKey(true)}
              >
                Can't scan? Enter key manually
              </button>
            )}

            {showManualKey && (
              <div className="manual-key">
                <p>Enter this key in your authenticator app:</p>
                <code className="key-display">{manualKey}</code>
              </div>
            )}

            <div className="otp-input-section">
              <h3>Enter 6-digit OTP from your authenticator app:</h3>
              <form onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength="6"
                  className="otp-input"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            </div>

            <div className="help-text">
              <p>📱 Download Google Authenticator or Microsoft Authenticator</p>
              <p>🔄 OTP refreshes every 30 seconds</p>
            </div>
          </div>
        )}

        {step === 3 && backupCodes.length > 0 && (
          <div className="backup-codes-section">
            <h2>⚠️ Save Your Backup Codes</h2>
            <p className="warning-text">
              These codes can be used to reset your password if you lose access
              to your authenticator app. Each code can only be used once.
            </p>

            <div className="backup-codes-grid">
              {backupCodes.map((code, index) => (
                <div key={index} className="backup-code-item">
                  {code}
                </div>
              ))}
            </div>

            <div className="backup-actions">
              <button className="btn-download" onClick={downloadBackupCodes}>
                📥 Download Codes
              </button>
              <button className="btn-copy" onClick={copyBackupCodes}>
                📋 Copy to Clipboard
              </button>
            </div>

            <div className="warning-box">
              <h3>⚠️ Important:</h3>
              <ul>
                <li>Store these codes in a secure location</li>
                <li>Each code can only be used once</li>
                <li>You can regenerate codes from Security settings</li>
                <li>Never share these codes with anyone</li>
              </ul>
            </div>

            <button className="btn-primary" onClick={handleComplete}>
              I've Saved My Codes - Complete Setup
            </button>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        {success && step !== 3 && (
          <div className="alert alert-success">{success}</div>
        )}

        {step > 1 && step < 3 && (
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthenticatorSetup;
