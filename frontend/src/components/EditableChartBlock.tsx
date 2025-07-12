import React, { useState } from "react";
import ChartBlock from "./ChartBlock";

interface EditableChartBlockProps {
  config: any;
  onUpdate: (newConfig: any) => void;
  onDelete: () => void;
}

export default function EditableChartBlock({ config, onUpdate, onDelete }: EditableChartBlockProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(config.title);
  const [xField, setXField] = useState(config.xField);
  const [yField, setYField] = useState(config.yField || "");
  const [error, setError] = useState("");

  const fields = config.data && config.data.length > 0 ? Object.keys(config.data[0]) : [];

  const handleSave = () => {
    if (!xField) {
      setError("xField is required.");
      return;
    }
    setError("");
    onUpdate({ ...config, title, xField, yField });
    setEditing(false);
  };

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this chart?")) {
      onDelete();
    }
  };

  return (
    <div className="border rounded shadow-sm bg-white p-2 space-y-2">
      <ChartBlock config={config} />

      <div className="flex justify-between mt-2">
        <button
          className="text-sm text-blue-600 underline"
          onClick={() => setEditing((prev) => !prev)}
        >
          {editing ? "Close Edit" : "✏️ Edit Chart"}
        </button>

        <button
          className="text-sm text-red-600 underline"
          onClick={confirmDelete}
        >
          🗑️ Delete
        </button>
      </div>

      {editing && (
        <div className="space-y-2 mt-2">
          <div>
            <label className="text-sm font-medium block">Chart Type</label>
            <div className="text-gray-500 text-sm italic">{config.chartType}</div>
          </div>

          <div>
            <label className="text-sm font-medium block">Title</label>
            <input
              className="border rounded w-full p-1"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block">X Axis Field</label>
            <select
              className="border rounded w-full p-1"
              value={xField}
              onChange={(e) => setXField(e.target.value)}
            >
              {fields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>

          {config.chartType !== "pie" && (
            <div>
              <label className="text-sm font-medium block">Y Axis Field</label>
              <select
                className="border rounded w-full p-1"
                value={yField}
                onChange={(e) => setYField(e.target.value)}
              >
                <option value="">-- Choose Field --</option>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={handleSave}
          >
            ✅ Apply Changes
          </button>
        </div>
      )}
    </div>
  );
}
