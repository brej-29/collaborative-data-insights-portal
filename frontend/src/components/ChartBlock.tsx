import React from "react";
import {
  Bar, Line, Pie
} from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

interface ChartBlockProps {
  config: {
    chartType: string;
    xField: string;
    yField: string;
    title: string;
    data: Record<string, any>[];
  };
}

export default function ChartBlock({ config }: ChartBlockProps) {
  const { chartType, xField, yField, data, title } = config;

  const labels = data.map((row) => row[xField]);
  const values = data.map((row) => row[yField]);

  const chartData = {
    labels,
    datasets: [
      {
        label: yField,
        data: values,
        backgroundColor: "#3B82F6",
        borderColor: "#1D4ED8",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: title || `${yField} vs ${xField}` },
    },
  };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
  }[chartType];

  if (!ChartComponent) return <div>Unsupported chart type</div>;

  return <ChartComponent data={chartData} options={chartOptions} />;
}
