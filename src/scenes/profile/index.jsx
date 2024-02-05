import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PersonIcon from "@mui/icons-material/Person";
import Swal from "sweetalert2";
import { tokens } from "../../theme";
import { useTheme, Box, Typography, Button, Snackbar } from "@mui/material";
import Header from "../../components/Header";
import { DotLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const textRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const [authUser, setAuthUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleCopy = () => {
    // Copy the text
    const range = document.createRange();
    range.selectNodeContents(textRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        getDoc(doc(db, "users", user.uid))
          .then((docSnap) => {
            console.log(docSnap.data());
            setUserInfo(docSnap.data());
          })
          .catch((error) => {
            console.error("Error getting documents:", error);
          });
      } else {
        setAuthUser(null);
        setUserInfo({});
      }
    });
    return () => {
      listen();
    };
  }, []);
  const userSignOut = () => {
    Swal.fire({
      title:
        "<h5 style='color: " +
        colors.grey[100] +
        "'>" +
        "Confirm Sign Out" +
        "</h5>",
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
            navigate(`/`);
          })
          .catch((error) => console.log(error));
      }
    });
  };

  if (!authUser) {
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
    <Box m="10px">
      <Header title="Profile" subtitle="User Settings" />
      <Box m="10px 5%">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <PersonIcon
              sx={{ color: colors.greenAccent[600], fontSize: "100px" }}
            />
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ color: colors.grey[100] }}
            >
              User Info
            </Typography>
            <Box display="flex" alignItems="baseline">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                Name:
              </Typography>
              <Typography
                variant="h5"
                fontWeight=""
                sx={{ color: colors.greenAccent[400], marginLeft: "6px" }}
              >
                {userInfo.firstName} {userInfo.lastName}
              </Typography>
            </Box>
            <Box display="flex" alignItems="baseline">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                Email:
              </Typography>
              <Typography
                variant="h5"
                fontWeight=""
                sx={{ color: colors.greenAccent[400], marginLeft: "6px" }}
              >
                {userInfo.email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="baseline">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                Phone Number:
              </Typography>
              <Typography
                variant="h5"
                fontWeight=""
                sx={{ color: colors.greenAccent[400], marginLeft: "6px" }}
              >
                {userInfo.contact}
              </Typography>
            </Box>
            <Box display="flex" alignItems="baseline">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                API Key:
              </Typography>
              {showPassword ? (
                <Box display="flex">
                  <Typography
                    variant="h5"
                    fontWeight=""
                    sx={{
                      color: colors.greenAccent[400],
                      marginLeft: "6px",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleCopy()}
                    ref={textRef}
                  >
                    {userInfo.apiKey}
                  </Typography>
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ fontSize: "9px" }}
                  >
                    <VisibilityOffIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                  <Snackbar
                    open={isCopied}
                    autoHideDuration={1500}
                    onClose={() => setIsCopied(false)}
                    message="Copied to clipboard!"
                  />
                </Box>
              ) : (
                <Box display="flex" alignItems="baseline">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ fontSize: "9px" }}
                  >
                    {<VisibilityIcon sx={{ fontSize: "18px" }} />}
                  </IconButton>
                </Box>
              )}
            </Box>
            <Box sx={{ marginTop: "10px" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.redAccent[500],
                  color: colors.grey[100],
                  "&:hover": {
                    backgroundColor: colors.redAccent[600], // Change color on hover
                  },
                }}
                onClick={userSignOut}
              >
                Sign Out
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
