import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "../../components/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link"; // MUI Link
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import useSystemTheme from "@/hooks/SystemTheme";
import InputComponent from "@/components/InputComponent";
import ThemeToggle from "../../components/theme-toggle";

import { useLanguage } from "@/context/LanguageContext";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "../../components/CustomIcons";
import layoutLang from "@/constants/Lang/layout";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  backgroundColor: "var(--surface-color)",
  color: "var(--text-primary)",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  backgroundColor: "var(--bg-color)",
  color: "var(--text-primary)",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const navigate = useNavigate();
  const { languageId, toggleLanguage } = useLanguage();

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <div className="flex gap-4 items-center">
        <ThemeToggle />
        {/* Language selector */}

        <button
          className="w-8 h-8 rounded-md shadow-md flex justify-center items-center"
          onClick={toggleLanguage}
        >
          {languageId === 1 ? (
            <p className="text-sm font-tbold font-bold text-slate-700">AR</p>
          ) : (
            <p className="text-sm font-tbold font-bold text-slate-700">EN</p>
          )}
        </button>
      </div>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {layoutLang.SignUp[languageId]}{" "}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl>
            <InputComponent
              title={layoutLang.FullName[languageId]}
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder={layoutLang.FullName[languageId]}
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <InputComponent
              title={layoutLang.Email[languageId]}
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              className=""
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              color={emailError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <InputComponent
              title={layoutLang.Password[languageId]}
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>

          <Checkbox
            className="my-6"
            label={layoutLang.ReceiveUpdates[languageId]}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            {layoutLang.SignUp[languageId]}{" "}
          </Button>
        </Box>
        <Divider>
          <Typography sx={{ color: "text.secondary" }}>
            {layoutLang.or[languageId]}
          </Typography>
        </Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            className="flex gap-4"
            onClick={() => alert("Sign up with Google")}
            startIcon={<GoogleIcon />}
          >
            {layoutLang.SignUpgoogle[languageId]}{" "}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            className="flex gap-4"
            onClick={() => alert("Sign up with Facebook")}
            startIcon={<FacebookIcon />}
          >
            {layoutLang.SignUpface[languageId]}{" "}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            {layoutLang.Alreadyhave[languageId]}{" "}
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              {layoutLang.Signin[languageId]}{" "}
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
