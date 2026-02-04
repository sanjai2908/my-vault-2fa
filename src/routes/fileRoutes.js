const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getUserFiles,
  downloadFile,
  viewFile,
  deleteFile,
  renameFile,
} = require("../controllers/fileController");
const {
  getActivityLog,
  getStorageStats,
} = require("../controllers/statsController");
const { protect } = require("../middleware/auth");
const { uploadFile: multerUpload } = require("../config/multer");

router.post("/upload", protect, multerUpload.single("file"), uploadFile);
router.get("/", protect, getUserFiles);
router.get("/download/:id", protect, downloadFile);
router.get("/view/:id", protect, viewFile);
router.put("/rename/:id", protect, renameFile);
router.delete("/:id", protect, deleteFile);

// Activity and stats routes
router.get("/activity/log", protect, getActivityLog);
router.get("/stats/storage", protect, getStorageStats);

module.exports = router;
