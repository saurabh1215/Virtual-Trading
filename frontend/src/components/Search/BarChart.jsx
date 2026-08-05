import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ sixMonthAverages, stockInfo }) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const barChart = sixMonthAverages ? (
    <Bar
      data={{
        labels: sixMonthAverages.map(({ month }) => monthNames[month]),
        datasets: [
          {
            label: "Avg Price",
            backgroundColor: "rgba(99, 102, 241, 0.6)",
            hoverBackgroundColor: "rgba(129, 140, 248, 0.9)",
            borderRadius: 8,
            data: sixMonthAverages.map(({ value }) => value),
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        title: {
          display: true,
          text: `6-Month Average Monthly Close for ${stockInfo ? stockInfo.ticker : ""}`,
          position: "bottom",
          fontColor: "#94a3b8",
          fontSize: 12,
          fontFamily: "Inter"
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 15,
            bottom: 10,
          },
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: "rgba(255, 255, 255, 0.05)",
              zeroLineColor: "rgba(255, 255, 255, 0.1)"
            },
            ticks: {
              fontColor: "#94a3b8"
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(255, 255, 255, 0.05)",
              zeroLineColor: "rgba(255, 255, 255, 0.1)"
            },
            ticks: {
              fontColor: "#94a3b8",
              callback: (value) => "$" + value,
            }
          }],
        },
        legend: { display: false },
        animation: {
          duration: 1200,
        },
      }}
    />
  ) : null;

  return barChart;
};

export default BarChart;

