import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
    alignSelf: "flex-start",
  },
  titleColor: {
    color: theme.palette.primary.dark,
  },
}));

function Title(props: { title: string }) {
  const classes = useStyles();
  return (
    <Typography
      component="h2"
      variant="h5"
      color="primary"
      gutterBottom
      className={classes.title}
      classes={{
        colorPrimary: classes.titleColor,
      }}
    >
      {props.title}
    </Typography>
  );
}

export default React.memo(Title);
