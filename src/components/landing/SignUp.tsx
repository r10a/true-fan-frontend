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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { URL } from "../../Routes";
import { isEmpty, reduce, cloneDeep, set } from "lodash-es";
import { check, isValidPhone, isValidEmail } from "./modules/form/validation";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface ISignUpProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  history: any;
}

export default function SignUp(props: ISignUpProps) {
  if (props.isAuthenticated) props.history.push(URL.DASHBOARD.HOME);
  const classes = useStyles();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [helperTexts, setHelperText] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    other: "",
  });

  const [confirmation, showConfirmation] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      Auth.signUp({
        username: email,
        password,
        attributes: {
          given_name: name,
          ...(phone.length <= 2 && { phone_number: phone }),
        },
      })
        .then((user) => {
          setHelperText({
            email: "",
            password: "",
            name: "",
            phone: "",
            other: "",
          });
          showConfirmation(true);
        })
        .catch((err) => {
          if (err.code === "UserNotConfirmedException") {
            setUserExists(true);
            showConfirmation(true);
          } else if (err.code === "InvalidPasswordException") {
            setHelperText({
              ...helperTexts,
              password:
                "Password must have minimum 8 characters with Uppercase, Lowercase, Numbers, and Special Characters",
            });
          } else if (err.code === "InvalidParameterException") {
            if (err.message.search("password")) {
              setHelperText({
                ...helperTexts,
                password:
                  "Password must have minimum 8 characters with Uppercase, Lowercase, Numbers, and Special Characters",
              });
            }
          }
          setHelperText({
            ...helperTexts,
            other: err.message,
          });
          console.log(err);
        });
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
        if (userExists) {
          await Auth.resendSignUp(email);
        }
        await Auth.confirmSignUp(email, confirmationCode);
        await Auth.signIn(email, password);
        props.userHasAuthenticated(true);
        console.log("created user successfully");
        props.history.push(URL.DASHBOARD.HOME);
      } catch (e) {
        setHelperText({
          ...helperTexts,
          other: e.message,
        });
        showConfirmation(false);
        console.log(e);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const validateForm = () => {
    const errors = cloneDeep(helperTexts);

    check(isEmpty(name), "name", "Required", errors);
    check(
      phone.length > 2 && isValidPhone(phone),
      "phone",
      "format: +1XXXXXXXXXX",
      errors
    );
    check(!isValidEmail(email), "email", "Required", errors);
    check(
      password.length < 8,
      "password",
      "Password must have minimum 8 characters with Uppercase, Lowercase, Numbers, and Special Characters",
      errors
    );
    set(errors, "other", "");
    console.log(errors, !isValidEmail(email));

    setHelperText(errors);
    return reduce(
      errors,
      (acc, value) => {
        return acc && isEmpty(value);
      },
      true
    );
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
                To create your account successfully, please enter the
                confirmation code sent to your email address here.
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
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
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
          Sign up
        </Typography>
        <Grid item>
          <Link component={RouterLink} to={URL.SIGNIN} variant="body2">
            Already have an account?
          </Link>
        </Grid>
        <form
          name="sign-up"
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                error={!isEmpty(helperTexts.name)}
                helperText={helperTexts.name}
                name="fname"
                variant="outlined"
                required
                fullWidth
                id="fname"
                label="Name"
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                error={!isEmpty(helperTexts.phone)}
                helperText={helperTexts.phone}
                // required
                fullWidth
                id="phone"
                label="Phone"
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                value={phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                error={!isEmpty(helperTexts.email)}
                helperText={helperTexts.email}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                error={!isEmpty(helperTexts.password)}
                helperText={helperTexts.password}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <div className="MuiFormLabel-root Mui-error">{helperTexts.other}</div>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      {confirmationForm()}
    </Container>
  );
}
