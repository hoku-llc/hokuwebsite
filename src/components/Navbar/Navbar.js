import { useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  Box,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { auth } from "../../firebase";
import "./Navbar.css";
import hokubluelogoside from "../../images/hokubluelogoside.png";
import Swal from "sweetalert2";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [clicked] = useState(false);

  const [authUser, setAuthUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    // Handle the profile action
    handleMenuClose();
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    Swal.fire({
      title: `<h5 style="color: ${colors.grey[100]}">Confirm Sign Out</h5>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.greenAccent[400],
      cancelButtonColor: colors.redAccent[400],
      confirmButtonText: "Sign Out",
      background: colors.blueAccent[900],
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth)
          .then(() => {
            console.log("signout successful");
          })
          .catch((error) => console.log(error));
      }
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      sx={{ backgroundColor: colors.primary[600] }}
    >
      {/* Search bar */}
      <a id="logo" href="/">
        <img
          src={hokubluelogoside} // Update the path accordingly
          alt="HOKU Logo"
          width="80"
          height="40"
        />
      </a>
      <Box display="flex" className="linkers">
        <ul id="navbar" className={clicked ? "#navbar active" : "#navbar"}>
          <li>
            <a href="/">
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: colors.grey[100] }}
              >
                Dashboard
              </Typography>
            </a>
          </li>
          <li>
            <a href="/livetrader">
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: colors.grey[100] }}
              >
                Live Trader
              </Typography>
            </a>
          </li>
          <li>
            <a href="/about">
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: colors.grey[100] }}
              >
                About
              </Typography>
            </a>
          </li>
        </ul>
      </Box>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {authUser ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <PersonOutlinedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  backgroundColor: colors.blueAccent[900],
                },
              }}
            >
              <a href="/profile" style={{ textDecoration: "none" }}>
                <MenuItem onClick={handleProfile}>
                  <Typography
                    variant="h6"
                    fontWeight=""
                    sx={{ color: colors.grey[100] }}
                  >
                    Profile
                  </Typography>
                </MenuItem>
              </a>
              <MenuItem onClick={userSignOut}>
                <Typography
                  variant="h6"
                  fontWeight=""
                  sx={{ color: colors.grey[100] }}
                >
                  Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <a href="/login">
            <IconButton>
              <LoginIcon />
            </IconButton>
          </a>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
