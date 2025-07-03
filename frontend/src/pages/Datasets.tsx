import React, { useState } from "react";
import api from "../api/axios";
import { CsvUploadResponse } from "../types";

export default function Datasets() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<CsvUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<CsvUploadResponse>("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const previewLimited = {
        ...response.data,
        preview: response.data.preview.slice(0, 50), // Limit to 50 rows
      };

      setData(previewLimited);
    } catch (err) {
      setError("Upload failed. Make sure it's a valid CSV file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload CSV Dataset</h2>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="overflow-x-auto border rounded mt-6">
  <div className="max-h-[400px] overflow-y-auto">
    <table className="table-auto w-full text-sm">
      <thead className="sticky top-0 bg-gray-200 z-10">
        <tr>
          {data.headers.map((header) => (
            <th key={header} className="px-2 py-1 border">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.preview.map((row, idx) => (
          <tr key={idx} className="even:bg-gray-50">
            {data.headers.map((header) => (
              <td key={header} className="px-2 py-1 border">
                {row.row[header] ?? ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100">
    Showing first {data.preview.length} rows
  </div>
</div>

      )}
    </div>
  );
}
