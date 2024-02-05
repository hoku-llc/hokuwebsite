import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import InfoIcon from '@mui/icons-material/Info';
import TickerPieChart from "../../components/dashboardComponent/TickerPieChart";
import WinratePieChart from "../../components/sharedDataComponents/WinratePieChart";
import WeeklyBarChart from "../../components/sharedDataComponents/WeeklyBarChart";
import Statbox from "../../components/dashboardComponent/Statbox";
import PastTransactionsTable from "../../components/sharedDataComponents/PastTransactionsTable";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { DotLoader } from "react-spinners";
import {liveTickers} from "../../data/hokuData";
const liveTickerArray = [...liveTickers];
const requiredLength = Math.ceil(liveTickerArray.length / 3) * 3;

while (liveTickerArray.length < requiredLength) {
    liveTickerArray.push({
        title: "",
        label: "",
    });
}
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [allTransactionJson, setAllTransactionJson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickerPieData, setTickerPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allTransactionsSnapshot = await getDocs(
          collection(db, "transactions")
        );
        const transactionsData = allTransactionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formattedTransactions = transactionsData.map((transaction) => ({
          ...transaction,
          timestamp: new Date(transaction.timestamp),
        }));

        setAllTransactionJson(formattedTransactions);

        const tickerCount = {};
        formattedTransactions.forEach((transaction) => {
          const { ticker } = transaction;
          tickerCount[ticker] = (tickerCount[ticker] || 0) + 1;
        });

        const newTickerPieData = Object.keys(tickerCount).map((ticker) => ({
          id: ticker,
          value: tickerCount[ticker],
        }));

        setTickerPieData(newTickerPieData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBoxClick = (event, ticker) => {
    navigate(`/tickerstats/${ticker}`);
  };

  if (loading) {
    return (
      <Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <DotLoader color={colors.greenAccent[400]} />
        </Box>
      </Box>
    );
  }
  return (
    <Box m="20px" padding="0 5%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1> DASHBOARD</h1>
      </Box>

      {/* GRID VIEW*/}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* TICKER ROW */}
        {Object.entries(liveTickerArray).map(([value, ticker]) => (
          
          <Box
          key={value}
            gridColumn="span 4"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={(event) => handleBoxClick(event, ticker.title)}
            sx={{
              transition: "background-color 0.3s ease-in-out", // Add a transition for smooth effect
              "&:hover": {
                backgroundColor: colors.primary[600], // Change background color on hover
              },
            }}
          >
            <Statbox
              title={ticker.title}
              subtitle={ticker.label}
              allTrans={allTransactionJson}
              icon={
                <InfoIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        ))}    
        {/**ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <TickerPieChart tickerData={tickerPieData} />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <WinratePieChart transactionData={allTransactionJson} />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <WeeklyBarChart allTransactions={allTransactionJson} />
        </Box>
      </Box>
      <PastTransactionsTable data={allTransactionJson} />
    </Box>
  );
};

export default Dashboard;
