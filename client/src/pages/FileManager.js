import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FilePreview from "../components/FilePreview";
import StorageUsage from "../components/StorageUsage";
import ActivityLog from "../components/ActivityLog";

const FileManager = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [previewFile, setPreviewFile] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [showActivityLog, setShowActivityLog] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/files");
      setFiles(response.data.files);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("/files/upload", formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchFiles();
      e.target.value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`/files/download/${fileId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.message || "Download failed");
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const handleRename = async (fileId) => {
    if (!newFileName.trim()) {
      setError("File name cannot be empty");
      return;
    }

    try {
      setError(null);
      await axios.put(`/files/rename/${fileId}`, { newName: newFileName });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setRenameFile(null);
      setNewFileName("");
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Rename failed");
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        setError(null);
        await axios.delete(`/files/${fileId}`);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchFiles();
      } catch (err) {
        setError(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getFileIcon = (fileType) => {
    const iconMap = {
      ".pdf": "📄",
      ".doc": "📝",
      ".docx": "📝",
      ".txt": "📋",
      ".jpg": "🖼️",
      ".jpeg": "🖼️",
      ".png": "🖼️",
      ".gif": "🖼️",
    };
    return iconMap[fileType] || "📁";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Filter and sort files
  let filteredFiles = files.filter((file) => {
    const matchesSearch = file.originalName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || file.fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  // Sort files
  if (sortBy === "date") {
    filteredFiles.sort(
      (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt),
    );
  } else if (sortBy === "size") {
    filteredFiles.sort((a, b) => b.fileSize - a.fileSize);
  } else if (sortBy === "name") {
    filteredFiles.sort((a, b) => a.originalName.localeCompare(b.originalName));
  }

  // Get unique file types
  const fileTypes = ["all", ...new Set(files.map((f) => f.fileType))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">📁 File Manager</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowActivityLog(!showActivityLog)}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              📊 Activity
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              👤 Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StorageUsage />
            {showActivityLog && <ActivityLog />}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Upload File
              </h2>
              <label className="block">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                  <div className="text-4xl mb-2">📤</div>
                  <p className="text-gray-600 font-medium">
                    {uploading ? "Uploading..." : "Click or drag files here"}
                  </p>
                  <p className="text-sm text-gray-500">Max file size: 10 MB</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✓ Operation completed successfully!
              </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Search & Filter
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Filter by Type */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fileTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "all" ? "All Types" : `${type} files`}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date (Newest)</option>
                  <option value="size">Sort by Size</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            {/* Files List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <h2 className="text-lg font-semibold text-gray-800 p-6 border-b">
                My Files ({filteredFiles.length})
              </h2>

              {loading ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Loading files...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    {files.length === 0
                      ? "No files yet. Upload one!"
                      : "No matching files"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          File
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr
                          key={file._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {getFileIcon(file.fileType)}
                              </span>
                              {renameFile === file._id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newFileName}
                                    onChange={(e) =>
                                      setNewFileName(e.target.value)
                                    }
                                    placeholder={file.originalName}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleRename(file._id)}
                                    className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => setRenameFile(null)}
                                    className="px-2 py-1 bg-gray-300 text-gray-700 text-sm rounded"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm font-medium text-gray-800 truncate">
                                  {file.originalName}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatFileSize(file.fileSize)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(file.uploadedAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handlePreview(file)}
                                className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600"
                                title="Preview"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => {
                                  setRenameFile(file._id);
                                  setNewFileName(file.originalName);
                                }}
                                className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                                title="Rename"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(file._id, file.originalName)
                                }
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                title="Download"
                              >
                                ⬇️
                              </button>
                              <button
                                onClick={() => handleDelete(file._id)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

export default FileManager;
