import React from "react";
import Title from "../Template/Title.jsx";
import LineChart from "../Template/LineChart";
import Axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@material-ui/lab/Skeleton";
import { Box } from "@material-ui/core";

const Chart = () => {
  const { data: chartData, isLoading } = useQuery(
    ["randomStockChart"],
    async () => {
      const url = `/api/data/random`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        return response.data;
      }
      return null;
    },
    {
      staleTime: 1000 * 60 * 10,
    }
  );

  if (isLoading) {
    return (
      <Box p={2}>
        <Skeleton variant="text" width="60%" height={32} style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", marginBottom: "16px" }} />
        <Skeleton variant="rect" height={240} style={{ borderRadius: "12px", backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
      </Box>
    );
  }

  return (
    <React.Fragment>
      {chartData && (
        <div style={{ minHeight: "240px" }}>
          <Title>Explore {chartData.name}'s Stock Chart</Title>
          <LineChart
            pastDataPeriod={chartData.data}
            stockInfo={{ ticker: chartData.ticker }}
            duration={"3 years"}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default Chart;
