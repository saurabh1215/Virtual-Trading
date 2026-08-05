import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { TextField, Container, Grid, Card, Typography, Box } from "@material-ui/core/";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LineChart from "../Template/LineChart";
import BarChart from "./BarChart";
import styles from "./Search.module.css";
import Axios from "axios";
import InfoCard from "./InfoCard";
import PriceCard from "./PriceCard";
import PurchaseCard from "./PurchaseCard";
import PurchaseModal from "./PurchaseModal";

const LineChartCard = ({ pastDataPeriod, stockInfo, duration }) => {

  return (
    <Grid
      item
      xs={12}
      sm={7}
      component={Card}
      className={styles.card}
      style={{ minHeight: "350px" }}
    >
      <LineChart
        pastDataPeriod={pastDataPeriod}
        stockInfo={stockInfo}
        duration={duration}
      />
    </Grid>
  );
};

const BarChartCard = ({ sixMonthAverages, stockInfo }) => {
  return (
    <Grid item xs={12} sm component={Card} className={styles.card}>
      <BarChart sixMonthAverages={sixMonthAverages} stockInfo={stockInfo} />
    </Grid>
  );
};

const StockCard = ({ setPurchasedStocks, purchasedStocks, currentStock }) => {
  const { userData } = useContext(UserContext);
  const [selected, setSelected] = useState(false);
  const [stockInfo, setStockInfo] = useState(undefined);
  const [sixMonthAverages, setSixMonthAverages] = useState(undefined);
  const [pastDay, setPastDay] = useState(undefined);
  const [pastMonth, setPastMonth] = useState(undefined);
  const [pastTwoYears, setPastTwoYears] = useState(undefined);

  useEffect(() => {
    const getInfo = async () => {
      const url = `/api/data/prices/${currentStock.ticker}`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        setStockInfo(response.data.data);
      }
    };

    getInfo();

    const getData = async () => {
      const url = `/api/data/prices/${currentStock.ticker}/full`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        setSixMonthAverages(response.data.sixMonthAverages);
        setPastDay(response.data.pastDay);
        setPastMonth(response.data.pastMonth);
        setPastTwoYears(response.data.pastTwoYears);
      }
    };

    getData();
     // eslint-disable-next-line
  }, [currentStock]);


  return (
    <div>
      {stockInfo && pastDay && (
        <InfoCard stockInfo={stockInfo} pastDay={pastDay} pastDataPeriod={pastTwoYears} />
      )}
      {pastDay && pastTwoYears && (
        <div>
          <Grid container spacing={3} style={{ marginBottom: "24px" }}>
            <Grid item xs={12} md={8}>
              <div style={{
                background: "rgba(30, 41, 59, 0.75)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                height: "440px"
              }}>
                <LineChart
                  pastDataPeriod={pastTwoYears}
                  stockInfo={stockInfo}
                  duration={"ALL"}
                />
              </div>
            </Grid>

            <PurchaseCard
              setSelected={setSelected}
              balance={userData.user.balance}
            />
          </Grid>

          <PriceCard pastDay={pastDay} stockInfo={stockInfo} />

          {selected && (
            <PurchaseModal
              stockInfo={stockInfo}
              pastDay={pastDay}
              setSelected={setSelected}
              setPurchasedStocks={setPurchasedStocks}
              purchasedStocks={purchasedStocks}
            />
          )}
        </div>
      )}
    </div>
  );
};



const Search = ({ setPurchasedStocks, purchasedStocks }) => {
  const [value, setValue] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);

  const onSearchChange = (event, newValue) => {
    setValue(newValue);
    if (newValue) {
      setCurrentStock(newValue);
    } else {
      setCurrentStock(null);
    }
  };

  const handleChipClick = (stockItem) => {
    setValue(stockItem);
    setCurrentStock(stockItem);
  };

  return (
    <Container style={{ paddingTop: "20px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto 40px" }}>
        <Typography variant="h5" align="center" style={{ fontFamily: "Outfit", fontWeight: 700, color: "#f8fafc", marginBottom: "8px" }}>
          Find & Trade Assets
        </Typography>
        <Typography variant="body2" align="center" style={{ color: "#94a3b8", marginBottom: "24px" }}>
          Select a stock to view live price movements, 2-year chart analytics, and place buy orders.
        </Typography>

        <Autocomplete
          value={value}
          onChange={onSearchChange}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="stock-search-bar"
          options={stocks}
          getOptionLabel={(option) => `${option.name} (${option.ticker})`}
          renderOption={(option) => (
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "4px 0" }}>
              <span style={{ fontWeight: 600, color: "#f8fafc" }}>{option.name}</span>
              <span style={{ color: "#818cf8", fontWeight: 700, fontFamily: "Outfit" }}>{option.ticker}</span>
            </div>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search stocks (e.g. Apple, Amazon, Tesla)"
              variant="outlined"
            />
          )}
        />

        <Box display="flex" flexWrap="wrap" justifyContent="center" gap="10px" mt={2}>
          <Typography variant="caption" style={{ color: "#64748b", alignSelf: "center", marginRight: "6px" }}>Popular:</Typography>
          {stocks.slice(0, 6).map((item) => (
            <div key={item.ticker} className={styles.chip} onClick={() => handleChipClick(item)}>
              {item.ticker} • {item.name}
            </div>
          ))}
        </Box>
      </div>

      {currentStock && (
        <StockCard
          key={currentStock.ticker}
          setPurchasedStocks={setPurchasedStocks}
          purchasedStocks={purchasedStocks}
          currentStock={currentStock}
        />
      )}
    </Container>
  );
};

const stocks = [
  { name: "Apple", ticker: "AAPL" },
  { name: "Amazon", ticker: "AMZN" },
  { name: "Google", ticker: "GOOG" },
  { name: "Microsoft", ticker: "MSFT" },
  { name: "Walmart", ticker: "WMT" },
  { name: "Intel", ticker: "INTC" },
  { name: "American Express", ticker: "AXP" },
  { name: "Boeing", ticker: "BA" },
  { name: "Cisco", ticker: "CSCO" },
  { name: "Goldman Sachs", ticker: "GS" },
  { name: "Johnson & Johnson", ticker: "JNJ" },
  { name: "Coca-Cola", ticker: "KO" },
  { name: "McDonald's", ticker: "MCD" },
  { name: "Nike", ticker: "NKE" },
  { name: "Procter & Gamble", ticker: "PG" },
  { name: "Verizon", ticker: "VZ" },
  { name: "Salesforce", ticker: "CRM" },
  { name: "Visa", ticker: "V" },
  { name: "UnitedHealth", ticker: "UNH" },
  { name: "IBM", ticker: "IBM" },
  { name: "Chevron", ticker: "CVX" },
];

export default Search;

