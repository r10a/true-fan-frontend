import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,.3)",
  },
  mainFeaturedPostContent: {
    position: "relative",
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
}));

interface IIntroProps {
  image: string;
  imgText: string;
  title: string | JSX.Element;
  description: string;
  linkText: string;
}

function Intro(props: IIntroProps) {
  const classes = useStyles();
  const { image, imgText, title, description, linkText } = props;

  return (
    <Paper
      className={classes.mainFeaturedPost}
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: "none" }} src={image} alt={imgText} />}
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={6}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography
              component="h6"
              variant="h6"
              color="inherit"
              gutterBottom
            >
              {title}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              {description}
            </Typography>
            <Link variant="subtitle1" href="#">
              {linkText}
            </Link>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default React.memo(Intro);
