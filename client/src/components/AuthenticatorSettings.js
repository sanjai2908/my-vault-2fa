import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AuthenticatorSettings.css";

const API_BASE_URL = "http://localhost:5000/api";

const AuthenticatorSettings = () => {
  const { user } = useAuth();
  const [isAuthenticatorEnabled, setIsAuthenticatorEnabled] = useState(
    user?.isAuthenticatorEnabled || false,
  );
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [disableOtp, setDisableOtp] = useState("");
  const [regenerateOtp, setRegenerateOtp] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  const handleEnableAuthenticator = () => {
    window.location.href = "/authenticator-setup";
  };

  const handleDisableAuthenticator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!disableOtp || disableOtp.length !== 6) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/auth/authenticator/disable`,
        { otp: disableOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setSuccess("Authenticator disabled successfully");
      setIsAuthenticatorEnabled(false);
      setShowDisableModal(false);
      setDisableOtp("");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error disabling authenticator");
    } finally {
      setLoading(false);
    }
  };

  const handleViewBackupCodes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/authenticator/backup-codes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBackupCodes(response.data.backupCodes);
      setShowBackupCodesModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching backup codes");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!regenerateOtp || regenerateOtp.length !== 6) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/authenticator/regenerate-backup-codes`,
        { otp: regenerateOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setBackupCodes(response.data.backupCodes);
      setSuccess("Backup codes regenerated successfully!");
      setShowRegenerateModal(false);
      setShowBackupCodesModal(true);
      setRegenerateOtp("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error regenerating backup codes",
      );
    } finally {
      setLoading(false);
    }
  };

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

  const copyBackupCodes = () => {
    const content = backupCodes.join("\n");
    navigator.clipboard.writeText(content);
    alert("Backup codes copied to clipboard!");
  };

  return (
    <div className="authenticator-settings">
      <div className="settings-card">
        <h3>🔐 Authenticator App Security</h3>
        <p className="description">
          Add an extra layer of security with TOTP-based authenticator apps.
        </p>

        <div className="status-section">
          <div className="status-indicator">
            <span
              className={`status-dot ${isAuthenticatorEnabled ? "enabled" : "disabled"}`}
            ></span>
            <span className="status-text">
              {isAuthenticatorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {isAuthenticatorEnabled && (
            <p className="security-level">🛡️ High Security: Enabled</p>
          )}
        </div>

        {!isAuthenticatorEnabled ? (
          <button
            className="btn-enable"
            onClick={handleEnableAuthenticator}
            disabled={loading}
          >
            Enable Authenticator
          </button>
        ) : (
          <div className="action-buttons">
            <button
              className="btn-backup-codes"
              onClick={handleViewBackupCodes}
              disabled={loading}
            >
              View Backup Codes
            </button>
            <button
              className="btn-regenerate"
              onClick={() => setShowRegenerateModal(true)}
              disabled={loading}
            >
              Regenerate Backup Codes
            </button>
            <button
              className="btn-disable"
              onClick={() => setShowDisableModal(true)}
              disabled={loading}
            >
              Disable Authenticator
            </button>
          </div>
        )}
      </div>

      {showDisableModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Disable Authenticator?</h3>
            <p>
              This will remove two-factor authentication. Your account will be
              less secure.
            </p>

            <form onSubmit={handleDisableAuthenticator}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={disableOtp}
                onChange={(e) =>
                  setDisableOtp(e.target.value.replace(/\D/g, ""))
                }
                maxLength="6"
                required
                disabled={loading}
                className="otp-input"
              />

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowDisableModal(false);
                    setDisableOtp("");
                    setError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-confirm"
                  disabled={loading || disableOtp.length !== 6}
                >
                  {loading ? "Disabling..." : "Disable"}
                </button>
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
            </form>
          </div>
        </div>
      )}

      {showRegenerateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🔄 Regenerate Backup Codes?</h3>
            <p>
              This will create new backup codes and invalidate all old codes.
              Make sure to save the new codes securely.
            </p>

            <form onSubmit={handleRegenerateBackupCodes}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={regenerateOtp}
                onChange={(e) =>
                  setRegenerateOtp(e.target.value.replace(/\D/g, ""))
                }
                maxLength="6"
                required
                disabled={loading}
                className="otp-input"
              />

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowRegenerateModal(false);
                    setRegenerateOtp("");
                    setError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-confirm"
                  disabled={loading || regenerateOtp.length !== 6}
                >
                  {loading ? "Generating..." : "Regenerate"}
                </button>
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
            </form>
          </div>
        </div>
      )}

      {showBackupCodesModal && backupCodes.length > 0 && (
        <div className="modal-overlay">
          <div className="modal backup-modal">
            <h3>💾 Your Backup Codes</h3>
            <p className="warning-text">
              Save these codes in a secure location. Each can only be used once.
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
                📥 Download
              </button>
              <button className="btn-copy" onClick={copyBackupCodes}>
                📋 Copy
              </button>
            </div>

            <button
              className="btn-close"
              onClick={() => {
                setShowBackupCodesModal(false);
                setBackupCodes([]);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </div>
  );
};

export default AuthenticatorSettings;
