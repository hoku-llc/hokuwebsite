import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./scenes/dashboard";
import Signup from "./scenes/signup";
import Login from "./scenes/login";
import TickerStats from "./scenes/tickerstats/TickerStats";
import LiveTrader from "./scenes/livetrader";
import Profile from "./scenes/profile";
import About from "./scenes/about";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  const [theme, colorMode] = useMode();
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
          <div className="app">
            <main className="content">
            <Navbar />
            <Router>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/livetrader" element={<LiveTrader />} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/about" element={<About/>} />
                <Route path="tickerstats/:buttonId" element={<TickerStats />} />
              </Routes>
            </Router>
            </main>
          </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
