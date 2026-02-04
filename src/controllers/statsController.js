const File = require("../models/File");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get user's activity log
// @route   GET /api/user/activity-log
// @access  Private
exports.getActivityLog = async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const activities = await ActivityLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get storage usage statistics
// @route   GET /api/user/storage
// @access  Private
exports.getStorageStats = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id });

    // Calculate total size
    const totalSize = files.reduce(
      (sum, file) => sum + (file.fileSize || 0),
      0,
    );

    // Convert to MB
    const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
    const maxMB = 100; // 100 MB limit

    // Calculate percentage
    const percentage = Math.min((usedMB / maxMB) * 100, 100).toFixed(1);

    res.status(200).json({
      success: true,
      storage: {
        used: parseFloat(usedMB),
        total: maxMB,
        percentage: parseFloat(percentage),
        fileCount: files.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
