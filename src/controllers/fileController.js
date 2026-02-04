const File = require("../models/File");
const path = require("path");
const fs = require("fs");
const { logActivity } = require("../utils/activityLogger");

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const file = await File.create({
      userId: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      filePath: "uploads/files/" + req.file.filename,
      fileSize: req.file.size,
    });

    // Log activity
    await logActivity(
      req.user._id,
      "FILE_UPLOAD",
      `Uploaded ${req.file.originalname}`,
      file._id,
      req.file.originalname,
      req,
    );

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all files uploaded by logged-in user
// @route   GET /api/files
// @access  Private
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id }).sort({
      uploadedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Download a file
// @route   GET /api/files/download/:id
// @access  Private
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check if file belongs to logged-in user
    if (file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this file",
      });
    }

    const filePath = path.join(__dirname, "../../", file.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Set headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`,
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    View a file (for preview)
// @route   GET /api/files/view/:id
// @access  Private
exports.viewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check if file belongs to logged-in user
    if (file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this file",
      });
    }

    const filePath = path.join(__dirname, "../../", file.filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Set appropriate content type for viewing
    const contentTypes = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".txt": "text/plain",
    };

    const contentType =
      contentTypes[file.fileType] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    // Stream the file for viewing
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check if file belongs to logged-in user
    if (file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this file",
      });
    }

    const filePath = path.join(__dirname, "../../", file.filePath);

    // Delete file from filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete file record from database
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Rename a file
// @route   PUT /api/files/rename/:id
// @access  Private
exports.renameFile = async (req, res) => {
  try {
    const { newName } = req.body;

    if (!newName || newName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "New file name is required",
      });
    }

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check if file belongs to logged-in user
    if (file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to rename this file",
      });
    }

    const oldName = file.originalName;
    file.originalName = newName;
    await file.save();

    // Log activity
    await logActivity(
      req.user._id,
      "FILE_RENAME",
      `Renamed ${oldName} to ${newName}`,
      file._id,
      newName,
      req,
    );

    res.status(200).json({
      success: true,
      message: "File renamed successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
