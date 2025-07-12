import React, { useState } from "react";

export default function DataSummary({ summary }: { summary: Record<string, any> }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
      >
        {isExpanded ? "🔽 Hide" : "▶️ Show"} Data Summary & Stats
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          {Object.entries(summary).map(([field, stats]: any) => {
            const nullRatio =
              stats?.missing && stats?.count
                ? stats.missing / (stats.missing + stats.count)
                : 0;

            return (
              <div key={field} className="border p-3 rounded bg-gray-50">
                <strong>{field}</strong>{" "}
                {nullRatio > 0.3 && (
                  <span className="text-red-500 ml-1 text-xs">⚠️ High missing rate</span>
                )}
                <pre className="mt-1 text-xs text-gray-700">
                  {JSON.stringify(stats, null, 2)}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
