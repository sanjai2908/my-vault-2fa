import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLog();
  }, []);

  const fetchActivityLog = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/files/activity/log?limit=20");
      setActivities(response.data.activities);
    } catch (error) {
      console.error("Failed to fetch activity log:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      LOGIN: "🔓",
      LOGOUT: "🔒",
      REGISTER: "✍️",
      FILE_UPLOAD: "⬆️",
      FILE_DELETE: "🗑️",
      FILE_DOWNLOAD: "⬇️",
      FILE_RENAME: "✏️",
      PASSWORD_CHANGE: "🔑",
      PROFILE_UPDATE: "👤",
      FOLDER_CREATE: "📁",
      FOLDER_DELETE: "📁❌",
    };
    return icons[action] || "📝";
  };

  const getActionColor = (action) => {
    const colors = {
      LOGIN: "text-green-600",
      LOGOUT: "text-gray-600",
      REGISTER: "text-blue-600",
      FILE_UPLOAD: "text-blue-600",
      FILE_DELETE: "text-red-600",
      FILE_DOWNLOAD: "text-indigo-600",
      FILE_RENAME: "text-orange-600",
      PASSWORD_CHANGE: "text-red-600",
      PROFILE_UPDATE: "text-purple-600",
      FOLDER_CREATE: "text-green-600",
      FOLDER_DELETE: "text-red-600",
    };
    return colors[action] || "text-gray-600";
  };

  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Log</h3>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No activities yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mt-1">
                {getActionIcon(activity.action)}
              </span>
              <div className="flex-1">
                <p className={`font-medium ${getActionColor(activity.action)}`}>
                  {activity.action.replace(/_/g, " ")}
                </p>
                {activity.description && (
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
