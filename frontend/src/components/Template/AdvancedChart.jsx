import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@material-ui/core";

const AdvancedChart = ({ pastDataPeriod, stockInfo }) => {
  const [timeframe, setTimeframe] = useState("1D");

  // Filter raw data based on selected timeframe
  const filteredData = useMemo(() => {
    if (!pastDataPeriod || pastDataPeriod.length === 0) return [];

    switch (timeframe) {
      case "1D":
        return pastDataPeriod.slice(-6);
      case "5D":
        return pastDataPeriod.slice(-12);
      case "1M":
        return pastDataPeriod.slice(-25);
      case "6M":
        return pastDataPeriod.slice(-125);
      case "YTD":
        return pastDataPeriod.slice(-180);
      case "1Y":
        return pastDataPeriod.slice(-250);
      case "5Y":
      case "Max":
      default:
        return pastDataPeriod;
    }
  }, [pastDataPeriod, timeframe]);

  const prevClosePrice = filteredData.length > 0 ? filteredData[0].adjClose : 0;
  const isUp = filteredData.length > 1
    ? filteredData[filteredData.length - 1].adjClose >= filteredData[0].adjClose
    : true;

  const lineColor = isUp ? "#34d399" : "#f87171";
  const fillColor = isUp ? "rgba(52, 211, 153, 0.12)" : "rgba(248, 113, 113, 0.12)";

  const formatDate = (dateStr, index, total) => {
    const d = new Date(dateStr);
    if (timeframe === "1D") {
      const startHour = 9.5; // 9:30 AM
      const step = 6.5 / Math.max(1, total - 1); // 9:30 AM to 4:00 PM
      const currentHourVal = startHour + (index * step);
      const h = Math.floor(currentHourVal);
      const m = Math.round((currentHourVal - h) * 60);
      const ampm = h >= 12 ? "pm" : "am";
      const displayH = h > 12 ? h - 12 : h;
      const displayM = m === 0 ? "00" : m < 10 ? `0${m}` : m;
      return `${displayH}:${displayM} ${ampm}`;
    }
    if (timeframe === "5D") {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const referenceLabel = timeframe === "1D" ? "Prev close" : "Period start";

  const chartDatasets = [
    {
      label: `${stockInfo ? stockInfo.ticker : "Stock"} Price`,
      data: filteredData.map(item => item.adjClose),
      borderColor: lineColor,
      borderWidth: 2,
      fill: true,
      backgroundColor: fillColor,
      tension: 0.3,
    },
    {
      label: referenceLabel,
      data: filteredData.map(() => prevClosePrice),
      borderColor: "rgba(255, 255, 255, 0.25)",
      borderWidth: 1,
      borderDash: [3, 3],
      fill: false,
      pointRadius: 0,
    }
  ];


  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Timeframe Selectors - Google Finance Tabs with Generous Spacing */}
      <div style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "16px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        paddingBottom: "8px"
      }}>
        {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "Max"].map(tf => {
          const active = timeframe === tf;
          return (
            <div
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                cursor: "pointer",
                padding: "6px 10px",
                marginRight: "12px",
                fontSize: "14px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: active ? 700 : 500,
                color: active ? "#818cf8" : "#94a3b8",
                borderBottom: active ? "3px solid #818cf8" : "3px solid transparent",
                transition: "all 0.2s ease"
              }}
            >
              {tf}
            </div>
          );
        })}
      </div>


      {/* Clean Chart Canvas with Fixed Height */}
      <div style={{ height: "350px", width: "100%", position: "relative" }}>
        {filteredData && filteredData.length > 0 ? (

          <Line
            data={{
              labels: filteredData.map((item, idx) => formatDate(item.date, idx, filteredData.length)),
              datasets: chartDatasets,
            }}

            options={{
              maintainAspectRatio: false,
              elements: {
                point: {
                  radius: filteredData.length > 50 ? 0 : 2,
                  hoverRadius: 6,
                  backgroundColor: lineColor,
                },
              },
              legend: {
                display: false
              },
              tooltips: {
                mode: 'index',
                intersect: false,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleFontColor: "#94a3b8",
                bodyFontColor: "#f8fafc",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                callbacks: {
                  label: (tooltipItem) => {
                    if (tooltipItem.datasetIndex === 0) {
                      return ` Price: $${Number(tooltipItem.value).toFixed(2)} USD`;
                    }
                    return ` ${referenceLabel}: $${Number(tooltipItem.value).toFixed(2)}`;
                  }
                }

              },
              scales: {
                xAxes: [{
                  gridLines: {
                    color: "rgba(255, 255, 255, 0.04)",
                    zeroLineColor: "rgba(255, 255, 255, 0.08)"
                  },
                  ticks: {
                    fontColor: "#94a3b8",
                    maxTicksLimit: 6,
                  }
                }],
                yAxes: [{
                  gridLines: {
                    color: "rgba(255, 255, 255, 0.04)",
                    zeroLineColor: "rgba(255, 255, 255, 0.08)"
                  },
                  ticks: {
                    fontColor: "#94a3b8",
                    callback: (value) => "$" + value,
                  }
                }]
              },
              animation: { duration: 600 }
            }}
          />
        ) : (
          <Typography variant="body2" align="center" style={{ color: "#64748b", marginTop: "40px" }}>
            Chart data unavailable for selected timeframe.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default AdvancedChart;

