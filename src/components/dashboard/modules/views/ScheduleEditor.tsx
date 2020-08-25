import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Fab, Paper } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import { cloneDeep, isEmpty, map, set } from "lodash-es";
import { useDispatch, useSelector } from "react-redux";
import { reducers } from "../../../../reducers";
import { LEAGUE_ACTIONS } from "../../../../reducers/LeagueReducer";
import { URL } from "../../../../Routes";
import Intro from "../components/Intro";
import MatchEditor from "../components/MatchEditor";
import Title from "../components/Title";
import SurvivorStatusBar from "../components/SurvivorStatusBar";
import DashboardAPI, { IMatch } from "../../../../api/DashboardAPI";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.down("sm")]: {
      paddingBottom: theme.spacing(13),
    },
    [theme.breakpoints.up("md")]: {
      paddingBottom: 0,
    },
  },
  leaguesSection: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  saveFab: {
    margin: 0,
    top: "auto",
    right: theme.spacing(35),
    bottom: theme.spacing(5),
    [theme.breakpoints.down("xl")]: {
      display: "none",
    },
    [theme.breakpoints.down("sm")]: {
      display: "block",
      right: theme.spacing(2),
      bottom: theme.spacing(2),
    },
    left: "auto",
    position: "fixed",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

interface IScheduleEditorProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  isSidebarOpen: boolean;
  admin: boolean;
  toggleSidebar: () => void;
  history: any;
  match: {
    params: { [key: string]: string };
  };
}

export default function ScheduleEditor(props: IScheduleEditorProps) {
  if (!props.isAuthenticated || !props.admin) props.history.push(URL.HOME);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const store: any = useSelector((state: reducers) => state.LeagueReducer);
  const [schedule, setSchedule] = useState([] as IMatch[]);

  const tournament = props.match.params.game;

  // constructor and destructor
  useEffect(() => {
    const init = () => {
      dispatch({ type: LEAGUE_ACTIONS.GET_SCHEDULE, tournament });
    };
    init();
    return function cleanup() {
      dispatch({ type: LEAGUE_ACTIONS.RESET });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournament]);

  // schedule store watcher
  useEffect(() => {
    const updateSchedule = async () => {
      const response = await store.schedule;
      response.result && setSchedule(response.result.Item.schedule);
    };
    updateSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.schedule]);

  const updateSchedule = (schedule: IMatch[]) => {
    setSchedule(schedule);
  };

  const updateMatchHandler = (index: number, match: IMatch) => {
    const currSchedule = cloneDeep(schedule);
    set(currSchedule, [index], match);
    updateSchedule(currSchedule);
  };

  const _saveSchedule = () => {
    DashboardAPI.updateSchedule(tournament, schedule)
      .then(() => {
        enqueueSnackbar("Changed Saved", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Oops! Something went wrong", {
          variant: "error",
        });
      });
  };

  const getMatchEditors = () => {
    return !isEmpty(schedule) ? (
      map(schedule, (match, index) => (
        <Grid item xs={12} key={`match#${index}`}>
          <MatchEditor
            match={match}
            tournament={tournament}
            index={index}
            updateMatchHandler={updateMatchHandler}
          />
        </Grid>
      ))
    ) : (
      <Grid item xs={12}>
        Loading
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" className={classes.mainGrid}>
      <main>
        <Intro
          title={tournament}
          description=""
          image="https://source.unsplash.com/bY4cqxp7vos"
          imgText="main image description"
          linkText=""
        />
        <SurvivorStatusBar confidenceScores={[]} save={_saveSchedule} />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} className={classes.leaguesSection}>
              <Title title={"Schedule"} />
              <Grid container spacing={4}>
                {getMatchEditors()}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} className={classes.saveFab}>
            <Fab
              color="primary"
              aria-label="save"
              variant="extended"
              onClick={_saveSchedule}
            >
              <SaveIcon className={classes.extendedIcon} />
              Save
            </Fab>
          </Grid>
        </Grid>
      </main>
    </Container>
  );
}
