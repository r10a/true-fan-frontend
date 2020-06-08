import React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import Typography from "../components/Typography";
import ProductHeroLayout from "./ProductHeroLayout";
import { URL } from "../../../../Routes";
import Link from "@material-ui/core/Link";
import Button from "../components/Button";

const backgroundImage = "truFAN-logo.png";

const styles = (theme: Theme) => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: "#7fc7d9", // Average color of the background image.
    backgroundPosition: "top",
    backgroundSize: "65vh",
    [theme.breakpoints.up("sm")]: {
      backgroundSize: "95vh",
    },
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
  linkPrimary: {
    color: theme.palette.common.white,
  },
  banner: {
    marginTop: "auto",
    paddingBottom: theme.spacing(5),
  },
});

function ProductHero(props: { classes: any }) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography
        className={classes.banner}
        color="inherit"
        align="center"
        variant="h6"
        marked="center"
      >
        A Fantasy League for True Sports Fans
      </Typography>
      <Link
        variant="button"
        underline="none"
        component={RouterLink}
        to={URL.SIGNUP}
      >
        <Button
          variant="contained"
          color="primary"
          className={classes.linkPrimary}
        >
          Sign Up
        </Button>
      </Link>
    </ProductHeroLayout>
  );
}
export default withStyles(styles)(ProductHero);
