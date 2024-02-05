import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import WinratePieChart from "../../components/sharedDataComponents/WinratePieChart";
import WeeklyBarChart from "../../components/sharedDataComponents/WeeklyBarChart";
import ProfitStatBox from "../../components/tickerStatComponent/ProfitStatBox";
import PositionBarChart from "../../components/sharedDataComponents/PositionBarChart";
import TickerInfo from "../../components/tickerStatComponent/TickerInfo";
import PastTransactionsTable from "../../components/sharedDataComponents/PastTransactionsTable";
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const allTransactions = await getDocs(collection(db, "transactions"));
let allTransactionJson = [];
allTransactions.forEach(doc => {
  const data = doc.data();
  const jsonData = {
    id: doc.id,
    ...data,
  };
  allTransactionJson.push(jsonData);
});
allTransactionJson = allTransactionJson.map(transaction => {
  const dateObject = new Date(transaction.timestamp);
  transaction.timestamp = dateObject;
  return transaction;
});
// const allTransactionJson = mockTransactions;


const allContractInfo = await getDocs(collection(db, "contractInfo"));
const allContractJson = [];
allContractInfo.forEach(doc => {
  const data = doc.data();
  const jsonData = {
    id: doc.id,
    ...data,
  };
  allContractJson.push(jsonData);
});


const TickerStats = () => {
  const location = useLocation().pathname.split('/');
  const currTicker = location[location.length - 1]

  const tickerTrans = allTransactionJson.filter(
    (transaction) => transaction.ticker === currTicker
  );
  console.log(tickerTrans);

  const tickerContract = allContractJson.find(contract => contract.id === currTicker);
  console.log(tickerContract)

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px" padding=" 0 5%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1> Ticker Statistics </h1>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
            <TickerInfo 
            ticker={currTicker}
            label={tickerContract.label}
            shortLabel={tickerContract.shortLabel}
            contract={{price: tickerContract.price, unit: tickerContract.units}}
            />
        </Box>
        <Box
          gridColumn="span 8"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
            <ProfitStatBox tickerTrans={tickerTrans} contractPrice={tickerContract.price}/>

        </Box>

         <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <WinratePieChart transactionData={tickerTrans}/>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <WeeklyBarChart allTransactions={tickerTrans}/>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PositionBarChart transactionData={tickerTrans}/>
        </Box>
      </Box>
      <PastTransactionsTable data={tickerTrans}/>
    </Box>
  );
};

export default TickerStats;
