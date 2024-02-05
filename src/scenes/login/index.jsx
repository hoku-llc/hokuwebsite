import React, { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../firebase"
import { useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
};

const userSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one capital letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

const Login = () => {
    const navigate = useNavigate();

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
    signInWithEmailAndPassword(auth, values.email, values.password).then((userCredential) => {
        console.log(userCredential);
        navigate("/");

    })
    .catch((error) => {
        console.log(error)
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box m="20px" padding="0 5%">
      <h1>LOG IN</h1>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4,minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              
              <TextField
                fullWidth
                variant="filled"
                type={showPassword ? "text" : "password"}
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

            </Box>
            <Box
              display="flex"
              alignItems="baseline"
              justifyContent="flex-end"
              mt="20px"
            >
              <div style={{ marginRight: "5px" }}>Don't have an account?</div>
              <a
                href="/signup"
                style={{
                  marginRight: "40px",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "white",
                  transition: "0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.color = "orange")} // Change color on hover
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                SIGN UP
              </a>
              <Button type="submit" color="secondary" variant="contained">
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
