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
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

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
    color: theme.palette.common.white,
  },
}));

interface ISignInProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  history: any;
}

export default function ResetPassword(props: ISignInProps) {
  if (props.isAuthenticated) props.history.push(URL.DASHBOARD.HOME);
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const [confirmation, showConfirmation] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (validateEmail()) {
      try {
        await Auth.forgotPassword(email);
        showConfirmation(true);
      } catch (e) {
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
    if (validateConfirmation()) {
      try {
        await Auth.forgotPasswordSubmit(email, confirmationCode, password);
        props.userHasAuthenticated(true);
        console.log("password reset");
        props.history.push(URL.DASHBOARD.HOME);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const validateEmail = () => {
    return email.length > 0;
  };

  const validateConfirmation = () => {
    return password.length > 0 && confirmationCode.length > 0;
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
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To reset your password, please enter the confirmation code sent
                to your email address here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label="Confirmation code"
                type="code"
                onChange={(e) => setConfirmationCode(e.target.value)}
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="New Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Reset Password
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
          Reset Password
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
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Verification code
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      {confirmationForm()}
    </Container>
  );
}
