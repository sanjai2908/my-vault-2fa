const ActivityLog = require("../models/ActivityLog");

exports.logActivity = async (
  userId,
  action,
  description = "",
  fileId = null,
  fileName = null,
  req = null,
) => {
  try {
    const ipAddress = req ? req.ip || req.connection.remoteAddress : null;
    const userAgent = req ? req.get("user-agent") : null;

    await ActivityLog.create({
      userId,
      action,
      description,
      fileId,
      fileName,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

exports.getActivityLog = async (userId, limit = 50) => {
  try {
    return await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error("Error retrieving activity log:", error);
    return [];
  }
};
