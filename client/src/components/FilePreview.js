import React from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/apiConfig";

const FilePreview = ({ file, onClose }) => {
  const { token } = useAuth();
  const effectiveToken = token || localStorage.getItem("token");
  if (!file) return null;

  const isImage = [".jpg", ".jpeg", ".png", ".gif"].includes(
    file.fileType?.toLowerCase(),
  );
  const isPdf = file.fileType?.toLowerCase() === ".pdf";
  const isText = [".txt", ".md", ".log"].includes(file.fileType?.toLowerCase());

  const tokenQuery = effectiveToken
    ? `?token=${encodeURIComponent(effectiveToken)}`
    : "";
  const viewUrl = `${API_BASE_URL}/files/view/${file._id}${tokenQuery}`;
  const downloadUrl = `${API_BASE_URL}/files/download/${file._id}${tokenQuery}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {file.originalName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50">
          {isImage ? (
            <img
              src={viewUrl}
              alt={file.originalName}
              className="max-w-full max-h-full object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={viewUrl}
              className="w-full h-full border-none"
              title={file.originalName}
            />
          ) : isText ? (
            <div className="w-full h-full p-6 bg-white">
              <TextPreview fileId={file._id} token={effectiveToken} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600 mb-4">
                Preview not available for this file type
              </p>
              <a
                href={downloadUrl}
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Download instead
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between text-sm text-gray-600">
          <span>Size: {(file.fileSize / 1024).toFixed(2)} KB</span>
          <span>
            Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Text file preview component
const TextPreview = ({ fileId, token }) => {
  const [content, setContent] = React.useState("Loading...");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/files/view/${fileId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => {
        console.error("Error loading text:", err);
        setError("Failed to load file content");
      });
  }, [fileId, token]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-800">
      {content}
    </pre>
  );
};

export default FilePreview;
