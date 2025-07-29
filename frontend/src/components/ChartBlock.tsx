import React from "react";
import { useEffect, useState } from "react";
import { useWebSocketContext } from "../context/WebSocketContext";
import { ChartUpdateMessage } from "../types"; // Adjust path if needed

import { Bar, Line, Pie, Doughnut, Radar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  registerables,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  ...registerables,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

interface ChartBlockProps {
  config: {
    chartId: string;
    chartType:
      | "bar"
      | "line"
      | "pie"
      | "doughnut"
      | "scatter"
      | "area"
      | "radar"
      | "histogram";
    xField: string;
    yField?: string | null;
    title: string;
    data: Record<string, any>[];
    dataInfo?: {
      used: number;
      total: number;
    };
  };
}

export default function ChartBlock({ config }: ChartBlockProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const { registerChartHandler, unregisterChartHandler } =
    useWebSocketContext();

  const { chartId, chartType, xField, yField, title, data, dataInfo } = localConfig;

  useEffect(() => {
    const handler = (msg: ChartUpdateMessage) => {
      if (msg.chartId === chartId) {
        setLocalConfig((prev) => ({
          ...prev,
          xField: msg.config.xField ?? prev.xField,
          yField: msg.config.yField ?? prev.yField,
          title: msg.config.title ?? prev.title,
        }));
      }
    };

    registerChartHandler(chartId, handler);
    return () => unregisterChartHandler(chartId);
  }, [chartId, registerChartHandler, unregisterChartHandler]);

  if (!chartId) {
  return <div className="text-red-600">❌ Missing chartId in config</div>;
  
}

  if (!data || !Array.isArray(data)) {
    return <div className="text-red-600">⚠️ Invalid or missing data</div>;
  }

  let labels: string[] = [];
  let values: number[] = [];
  let dataset: any = {}; // ← flexible for different chart types

  // 🧠 Special case: SCATTER
  if (chartType === "scatter" && xField && yField) {
    dataset = {
      label: `${yField} vs ${xField}`,
      data: data.map((row) => ({
        x: parseFloat(row[xField]) || 0,
        y: parseFloat(row[yField]) || 0,
      })),
      backgroundColor: "#3B82F6",
    };
  }

  // 📈 AREA chart (Line chart with fill)
  else if (chartType === "area" && xField && yField) {
    labels = data.map((row) => row[xField]);
    values = data.map((row) => parseFloat(row[yField]) || 0);

    dataset = {
      label: `${yField} vs ${xField}`,
      data: values,
      backgroundColor: "rgba(59, 130, 246, 0.4)",
      borderColor: "#1D4ED8",
      fill: true,
    };
  }

  // 📊 BAR/LINE chart
  else if ((chartType === "bar" || chartType === "line") && xField && yField) {
    labels = data.map((row) => row[xField]);
    values = data.map((row) => parseFloat(row[yField]) || 0);

    dataset = {
      label: `${yField} vs ${xField}`,
      data: values,
      backgroundColor: "#3B82F6",
      borderColor: "#1D4ED8",
      borderWidth: 1,
    };
  }

  // 📊 BAR/LINE with only xField (count mode)
  else if ((chartType === "bar" || chartType === "line") && xField && !yField) {
    const counts: Record<string, number> = {};
    data.forEach((row) => {
      const key = row[xField] || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    labels = sorted.map(([k]) => k);
    values = sorted.map(([, v]) => v);

    dataset = {
      label: `Count of ${xField}`,
      data: values,
      backgroundColor: "#3B82F6",
      borderColor: "#1D4ED8",
      borderWidth: 1,
    };
  }

  // 🥧 PIE/DOUGHNUT chart
  else if ((chartType === "pie" || chartType === "doughnut") && xField) {
    const counts: Record<string, number> = {};
    data.forEach((row) => {
      const key = row[xField] || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    labels = sorted.map(([k]) => k);
    values = sorted.map(([, v]) => v);

    dataset = {
      label: `Count of ${xField}`,
      data: values,
      backgroundColor: [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#6366F1",
        "#8B5CF6",
        "#EC4899",
        "#F97316",
        "#14B8A6",
        "#0EA5E9",
      ],
    };
  }

  // 📡 RADAR chart
  else if (chartType === "radar" && xField && yField) {
    labels = data.map((row) => row[xField]).slice(0, 10);
    values = data.map((row) => parseFloat(row[yField]) || 0).slice(0, 10);

    dataset = {
      label: `${yField} vs ${xField}`,
      data: values,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "#1D4ED8",
      pointBackgroundColor: "#3B82F6",
    };
  }

  // ❌ If unsupported, show warning
  else {
    return (
      <div className="text-yellow-600">
        ⚠️ Invalid or unsupported chart config
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [dataset],
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: title || `${yField || "Count"} vs ${xField}`,
      },
    },
  };

  // ✨ Scale config — only for supported types
  const chartOptions =
    chartType === "radar"
      ? baseOptions
      : {
          ...baseOptions,
          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 0,
                autoSkip: true,
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        };

  const chartMap: Record<string, any> = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
    scatter: Scatter,
    histogram: Bar,
    area: Line,
    heatmap: null, // Not supported yet
  };

  const ChartComponent = chartMap[chartType];
  if (!ChartComponent) return <div>❌ Unsupported chart type: {chartType}</div>;

  console.log(`Rendering chart: ${chartType}`, {
    xField,
    yField,
    labels,
    values,
    data: chartData.datasets[0].data,
  });

  return (
    <div className="h-[400px]">
      <ChartComponent data={chartData} options={chartOptions} />
      {dataInfo && (
        <div className="text-xs text-gray-500 text-right mt-1">
          Showing {dataInfo.used} of {dataInfo.total} rows
        </div>
      )}
    </div>
  );
}
