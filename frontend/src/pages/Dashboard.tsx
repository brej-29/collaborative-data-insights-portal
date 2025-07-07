import React, { useState } from "react";
import {
  Bar, Line, Pie
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function Dashboard() {
  const [chartType, setChartType] = useState("bar");

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 2100, 1800, 2300],
        backgroundColor: ["#2563EB"],
        borderColor: "#1E40AF",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Revenue Trend",
      },
    },
  };

  const chartComponents: Record<string, React.ReactElement> = {
    bar: <Bar data={chartData} options={chartOptions} />,
    line: <Line data={chartData} options={chartOptions} />,
    pie: <Pie data={chartData} options={chartOptions} />,
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Interactive Dashboard</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Chart Type:</label>
        <select
          className="border px-2 py-1 rounded"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>

      <div className="bg-white p-4 border rounded shadow">
        {chartComponents[chartType]}
      </div>
    </div>
  );
}