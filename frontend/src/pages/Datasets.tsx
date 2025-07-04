import React, { useState } from "react";
import api from "../api/axios";
import { CsvUploadResponse } from "../types";
import { useQuery } from "@apollo/client";
import { ALL_USERS } from "../graphql/queries";

export default function Datasets() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<CsvUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [datasetName, setDatasetName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const { data: usersData, loading: usersLoading } = useQuery(ALL_USERS);

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
        preview: response.data.preview.slice(0, 50),
      };

      setData(previewLimited);
    } catch (err) {
      setError("Upload failed. Make sure it's a valid CSV file.");
    } finally {
      setUploading(false);
    }
  };

  const handlePersist = async () => {
    if (!file || !data || !datasetName || !selectedUser) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", datasetName);
    formData.append("description", description);
    formData.append("schemaJson", JSON.stringify({ columns: data.headers }));
    formData.append("userId", selectedUser);

    try {
      const res = await api.post("/upload/persist", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadMessage(res.data);
    } catch (err) {
      setUploadMessage("❌ Failed to upload dataset.");
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
        <>
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

          {/* Metadata Form for Persisting Dataset */}
          <div className="mt-6 border p-4 rounded shadow-sm bg-gray-50">
            <h3 className="text-xl font-semibold mb-2">Save Dataset</h3>

            {usersLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Dataset Name</label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Select User</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={selectedUser ?? ""}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="" disabled>Select a user</option>
                    {usersData?.allUsers.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  disabled={!datasetName || !selectedUser}
                  onClick={handlePersist}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Dataset
                </button>

                {uploadMessage && (
                  <div className="mt-2 text-sm text-blue-700 bg-blue-100 p-2 rounded">
                    {uploadMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
