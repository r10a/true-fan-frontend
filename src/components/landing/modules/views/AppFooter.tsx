import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Typography from "../components/Typography";
import FacebookIcon from "@material-ui/icons/Facebook";
import { Button } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationCityIcon from "@material-ui/icons/LocationCity";

function Copyright() {
  return (
    <React.Fragment>
      {"© "}
      <Link color="inherit" href="https://material-ui.com/">
        TruFan
      </Link>{" "}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: "flex",
  },
  icons: {
    display: "flex",
  },
  icon: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: "none",
    paddingLeft: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
  footerButton: {
    margin: theme.spacing(1),
  },
  footerText: {
    paddingTop: theme.spacing(2),
  },
  footerIcons: {
    fontSize: "1rem",
  },
}));

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5} direction="row" justify="center">
          <Grid item>
            <Link
              component={Button}
              href="https://www.facebook.com/TruFan-510781282786488/"
              rel="noopener"
              target="_blank"
              size="large"
              className={classes.footerButton}
              startIcon={<FacebookIcon fontSize="large" htmlColor="#3b5998" />}
            >
              Facebook
            </Link>
          </Grid>
          <Grid item>
            <div className={classes.footerText}>
              Made with{" "}
              <FavoriteIcon
                className={classes.footerIcons}
                htmlColor="#FF0000"
              />{" "}
              in Seattle <LocationCityIcon className={classes.footerIcons} />{" "}
              and New York <LocationCityIcon className={classes.footerIcons} />
            </div>
          </Grid>
          <Grid item>
            <div className={classes.footerText}>
              <Copyright />
            </div>
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}
