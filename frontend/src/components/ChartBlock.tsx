import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

interface ChartBlockProps {
  config: {
    chartType: string;
    xField: string;
    yField: string | null;
    title: string;
    data: Record<string, any>[];
  };
}

export default function ChartBlock({ config }: ChartBlockProps) {
  const { chartType, xField, yField, data, title } = config;

  if (!data || !Array.isArray(data)) {
    return <div className="text-red-600">⚠️ Invalid or missing data</div>;
  }

  let labels: string[] = [];
  let values: number[] = [];

  // 📊 Bar/Line with missing yField → count occurrences of xField
  if ((chartType === "bar" || chartType === "line") && xField && !yField) {
    const counts: Record<string, number> = {};
    data.forEach((row) => {
      const key = row[xField] || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // 🔥 Top 10 for readability

    labels = sorted.map(([k]) => k);
    values = sorted.map(([, v]) => v);
  }

  // 📈 Standard bar/line with x/y
  else if ((chartType === "bar" || chartType === "line") && xField && yField) {
    labels = data.map((row) => row[xField]);
    values = data.map((row) => {
      const parsed = parseFloat(row[yField] ?? "0");
      return isNaN(parsed) ? 0 : parsed;
    });
  }

  // 🥧 Pie → group and count by xField
  else if (chartType === "pie" && xField) {
    const counts: Record<string, number> = {};
    data.forEach((row) => {
      const key = row[xField] || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // 🔥 Top 10 only

    labels = sorted.map(([k]) => k);
    values = sorted.map(([, v]) => v);
  }

  // ❌ Unsupported
  else {
    return <div className="text-yellow-600">⚠️ Invalid or unsupported chart config</div>;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: yField || "Count",
        data: values,
        backgroundColor: "#3B82F6",
        borderColor: "#1D4ED8",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: title || `${yField || "Count"} vs ${xField}`,
      },
    },
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
    histogram: Bar, // use Bar until histogram supported
    scatter: Line,   // use Line until scatter supported
  };

  const ChartComponent = chartMap[chartType];
  if (!ChartComponent) return <div>❌ Unsupported chart type: {chartType}</div>;

  return (
    <div className="h-[400px]">
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
}
