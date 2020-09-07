import React from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  Badge,
  Avatar,
  Button,
  makeStyles,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { map } from "lodash-es";
import { IConfidenceScore } from "../views/SurvivorConfidence";

export interface ISurvivorStatusProps {
  confidenceScores: IConfidenceScore[];
  save: () => void;
}

const useStyles = makeStyles((theme) => ({
  statusBar: {
    [theme.breakpoints.down("sm")]: {
      top: theme.spacing(8),
    },
    [theme.breakpoints.up("md")]: {
      top: theme.spacing(8.7),
    },
    backgroundColor: theme.palette.primary.light,
  },
  statusBarBadge: {
    backgroundColor: theme.palette.secondary.light,
  },
  saveButton: {
    paddingLeft: theme.spacing(5) + "px !important",
    [theme.breakpoints.up("lg")]: {
      display: "block",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  avatar: {
    color: theme.palette.getContrastText(theme.palette.primary.contrastText),
    backgroundColor: theme.palette.primary.dark,
  },
}));

function SurvivorStatusBar(props: ISurvivorStatusProps) {
  const classes = useStyles();
  const { confidenceScores } = props;

  return (
    <AppBar position="sticky" className={classes.statusBar}>
      <Toolbar>
        <Grid container spacing={1} justify="center">
          {map(confidenceScores, ({ score, remaining }) => {
            return (
              <Grid item xs md={1} key={score.toString()}>
                <Badge
                  overlap="circle"
                  color="primary"
                  badgeContent={remaining.toString()}
                  classes={{
                    colorPrimary: classes.statusBarBadge,
                  }}
                >
                  <Avatar className={classes.avatar}>{score}</Avatar>
                </Badge>
              </Grid>
            );
          })}
          <Grid item md={1} className={classes.saveButton}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={props.save}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(SurvivorStatusBar);
