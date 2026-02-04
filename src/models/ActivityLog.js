const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "LOGIN",
        "LOGOUT",
        "REGISTER",
        "FILE_UPLOAD",
        "FILE_DELETE",
        "FILE_DOWNLOAD",
        "FILE_RENAME",
        "PASSWORD_CHANGE",
        "PROFILE_UPDATE",
        "FOLDER_CREATE",
        "FOLDER_DELETE",
      ],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
activityLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
