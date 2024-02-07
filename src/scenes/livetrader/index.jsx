import React, { useState, useEffect } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Recommender from "../../components/liveTraderComponent/Recommender";
import PrevSignal from "../../components/liveTraderComponent/PrevSignal";
import { liveTickers } from "../../data/hokuData";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
const initialState = liveTickers.reduce((acc, ticker) => {
  acc[`${ticker.title}JsonData`] = {};
  return acc;
}, {});
const LiveTrader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const webApiKey = "hokuWebKey111";
  const [jsonData, setJsonData] = useState(initialState);
  const [authUser, setAuthUser] = useState(null);


  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });


    const apiUrl = "https://cattle-unified-inherently.ngrok-free.app/receive_json";
    const ws = new WebSocket("wss://9.tcp.ngrok.io:24047");

    ws.onmessage = (event) => {
      const receivedJson = JSON.parse(event.data);
      console.log("realtime", receivedJson);

      // Update state for each ticker dynamically
      liveTickers.forEach((ticker) => {
        setJsonData((prevData) => ({
          ...prevData,
          [`${ticker.title}JsonData`]: receivedJson?.[ticker.title] || {},
        }));
      });
    };

    const headers = {
      Authorization: webApiKey,
    };

    // Make an initial GET request to fetch the last received JSON data with authentication
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        console.log("RECEVING", response.data);

        // Update state for each ticker dynamically
        liveTickers.forEach((ticker) => {
          setJsonData((prevData) => ({
            ...prevData,
            [`${ticker.title}JsonData`]: response.data?.[ticker.title] || {},
          }));
        });
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
      authListener();

    };
  }, []);

  if (!authUser) {
    return (
      <Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          m="30px"
          p="20px"
          sx={{backgroundColor: colors.primary[400]}}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            marginLeft="60px"
            sx={{ color: colors.grey[100] }}
          >
            PLEASE <a href="/login" style={{
                  color: "white",
                  transition: "0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.color = "orange")} // Change color on hover
                onMouseLeave={(e) => (e.target.style.color = colors.grey[100])}>LOG IN</a> TO ACCESS LIVE TRADER
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="Live Trader" subtitle="Reccomendations"></Header>
      <Box display="flex" padding="0 330px" justifyContent="space-between">
        <Box display="flex" alignItems="center" marginBottom="10px">
          <Typography
            variant="h3"
            fontWeight="bold"
            marginLeft="60px"
            sx={{ color: colors.grey[100] }}
          >
            {"Tickers"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {"Most Recent Signal"}
          </Typography>
        </Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 2fr)"
        gridAutoRows="140px"
        gap="20px"
        padding="0px 200px"
      >
        {Object.entries(liveTickers).map(([value, ticker]) => (
          <>
            <Box
              gridColumn="span 6"
              gridRow="span 1"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="20px"
            >
              <Recommender
                ticker={ticker.title}
                label={ticker.label}
                stocktype=""
                recJson={jsonData[`${ticker.title}JsonData`]}
              />
            </Box>
            <Box
              gridColumn="span 6"
              gridRow="span 1"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="20px"
            >
              <PrevSignal recJson={jsonData[`${ticker.title}JsonData`]} />
            </Box>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default LiveTrader;
