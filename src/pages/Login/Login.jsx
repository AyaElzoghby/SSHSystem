import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "../../components/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "../../components/ForgotPassword";
import ThemeToggle from "../../components/theme-toggle";

import { GoogleIcon, FacebookIcon } from "../../components/CustomIcons";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import useSystemTheme from "@/hooks/SystemTheme";
import InputComponent from "@/components/InputComponent";
import { useLanguage } from "@/context/LanguageContext";
import layoutLang from "@/constants/Lang/layout";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  fontFamily: "'Tajawal', sans-serif",

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

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  backgroundColor: "var(--bg-color)",
  color: "var(--text-primary)",
  fontFamily: "'Tajawal', sans-serif",
  padding: theme.spacing(2),
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

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { token, setToken } = useUser();
  const { languageId, toggleLanguage } = useLanguage();
  console.log(token, "fdufuehfuefu");
  const navigate = useNavigate();
  const mode = useSystemTheme(); // returns "light" or "dark"

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateInputs();
    if (!isValid) return;

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    setToken(true);
    navigate("/AccountsChart");
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

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

    return isValid;
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
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
      <Card>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {layoutLang.Signin[languageId]}{" "}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
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
            label={layoutLang.Rememberme[languageId]}
          />

          <ForgotPassword open={open} handleClose={handleClose} />
          <Button type="submit" fullWidth variant="contained">
            {layoutLang.Signin[languageId]}{" "}
          </Button>
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            {layoutLang.Forgot[languageId]}{" "}
          </Link>
        </Box>
        <Divider sx={{ color: "text.secondary" }}>
          {layoutLang.or[languageId]}
        </Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            className="flex gap-4"
            variant="outlined"
            onClick={() => alert("Sign in with Google")}
            startIcon={<GoogleIcon />}
          >
            {layoutLang.Signinface[languageId]}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            className="flex gap-4"
            onClick={() => alert("Sign in with Facebook")}
            startIcon={<FacebookIcon />}
          >
            {layoutLang.Signingoogle[languageId]}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            {layoutLang.Donothave[languageId]}{" "}
            <Link
              component={RouterLink}
              to="/signup"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              {layoutLang.SignUp[languageId]}{" "}
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
