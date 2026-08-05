import React from "react";
import AdvancedChart from "./AdvancedChart";

const LineChart = ({ pastDataPeriod, stockInfo, duration }) => {
  return (
    <AdvancedChart
      pastDataPeriod={pastDataPeriod}
      stockInfo={stockInfo}
      initialDuration={duration}
    />
  );
};

export default LineChart;


