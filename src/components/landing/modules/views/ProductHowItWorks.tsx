import React from "react";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "../components/Button";
import Typography from "../components/Typography";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      backgroundColor: theme.palette.secondary.light,
      overflow: "hidden",
    },
    container: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(10),
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: theme.spacing(0, 5),
    },
    title: {
      marginBottom: theme.spacing(10),
    },
    number: {
      fontSize: 24,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.secondary.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    image: {
      height: 55,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    curvyLines: {
      pointerEvents: "none",
      position: "absolute",
      top: -180,
      opacity: 0.7,
    },
    button: {
      marginTop: theme.spacing(8),
    },
  });

function ProductHowItWorks(props: { classes: any }) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Typography
          variant="h4"
          marked="center"
          className={classes.title}
          component="h2"
        >
          How to Play
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>1.</div>
                <Typography variant="h5" align="center">
                  Create a League.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>2.</div>
                <Typography variant="h5" align="center">
                  Invite your friends
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>3.</div>
                <Typography variant="h5" align="center">
                  Compete for the top spot by predicting which team wins!
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          className={classes.button}
          //   component="a"
          href="/premium-themes/onepirate/sign-up/"
        >
          FAQ
        </Button>
      </Container>
    </section>
  );
}

export default withStyles(styles)(ProductHowItWorks);
