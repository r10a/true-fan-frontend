import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";
import { Auth } from "aws-amplify";
import { URL } from "../../Routes";
import { isAdmin } from "../../App";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { isEmpty } from "lodash-es";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Tru Fan
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface ISignInProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  history: any;
}

export default function SignIn(props: ISignInProps) {
  if (props.isAuthenticated) props.history.push(URL.DASHBOARD.HOME);
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, showConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [helperTexts, setHelperText] = useState({
    confirmation: "",
    other: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await Auth.signIn(email, password);
        props.userHasAuthenticated(true);
        props.setIsAdmin(await isAdmin());
        props.history.push(URL.DASHBOARD.HOME);
      } catch (e) {
        if (e.code === "UserNotConfirmedException") {
          showConfirmation(true);
        }
        setHelperText({
          ...helperTexts,
          other: e.message,
        });
        console.log(e);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleConfirmationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!isEmpty(confirmationCode)) {
      try {
        await Auth.confirmSignUp(email, confirmationCode);
        await Auth.signIn(email, password);

        props.userHasAuthenticated(true);
        console.log("created user successfully");
        props.history.push(URL.DASHBOARD.HOME);
      } catch (e) {
        setHelperText({
          ...helperTexts,
          confirmation: e.message,
        });
        setConfirmationCode("");
        showConfirmation(true);
        console.log(e);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  const confirmationForm = () => {
    return (
      <div>
        <Dialog open={confirmation} aria-labelledby="form-dialog-title">
          <form
            name="confirmation"
            className={classes.form}
            noValidate
            onSubmit={handleConfirmationSubmit}
          >
            <DialogTitle id="form-dialog-title">Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create your account successfully, enter the confirmation code
                sent to your email address here. Please check your Spam folders
                too!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label="Confirmation Code"
                type="code"
                onChange={(e) => setConfirmationCode(e.target.value)}
                fullWidth
              />
              <div className="MuiFormLabel-root Mui-error">
                {helperTexts.confirmation}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Grid item>
          <Link component={RouterLink} to={URL.SIGNUP} variant="body2">
            {"Not a member yet?"}
          </Link>
        </Grid>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to={URL.FORGOT_PASSWORD}
                variant="body2"
              >
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
        <div className="MuiFormLabel-root Mui-error">{helperTexts.other}</div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      {confirmationForm()}
    </Container>
  );
}
