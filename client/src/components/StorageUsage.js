import React, { useEffect, useState } from "react";
import axios from "axios";

const StorageUsage = () => {
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const fetchStorageStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/files/stats/storage");
      setStorage(response.data.storage);
    } catch (error) {
      console.error("Failed to fetch storage stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
      </div>
    );
  }

  if (!storage) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Storage Usage
      </h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          {storage.used} MB of {storage.total} MB used
        </span>
        <span className="text-sm font-medium text-gray-500">
          {storage.fileCount} files
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            storage.percentage < 50
              ? "bg-green-500"
              : storage.percentage < 80
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${storage.percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {storage.percentage}% full
        {storage.percentage > 80 && (
          <span className="text-red-600 ml-2 font-medium">
            ⚠️ Storage nearly full
          </span>
        )}
      </p>
    </div>
  );
};

export default StorageUsage;
