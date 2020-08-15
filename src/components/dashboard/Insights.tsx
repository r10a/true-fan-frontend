import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { URL } from "../../Routes";
import { Link as RouterLink } from "react-router-dom";
import { Container, Grid, Paper, Link } from "@material-ui/core";
import DashboardAPI, { ITournamentScore } from "../../api/DashboardAPI";
import Intro from "./modules/components/Intro";
import TotalScoreBoard from "./modules/components/TotalScoreBoard";

interface IInsightProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  admin: boolean;
  history: any;
}

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  tournamentScores: {
    padding: theme.spacing(2),
  },
}));

const CURRENT_TOURNAMENT = "IPL-2020";

export default function Insights(props: IInsightProps) {
  if (!props.isAuthenticated) props.history.push(URL.HOME);
  if (props.admin)
    props.history.push(
      URL.LEAGUES.SCHEDULE_EDITOR.replace(":game", "IPL-2020")
    );
  const classes = useStyles();

  const [scores, setTournamentScores] = useState({} as ITournamentScore);

  // constructor and destructor
  useEffect(() => {
    function getScores() {
      DashboardAPI.getTotalScores(CURRENT_TOURNAMENT).then((response) => {
        setTournamentScores(response.result.Item);
      });
    }
    getScores();
    return function cleanup() {
      // dispatch({ type: LEAGUE_ACTIONS.RESET });
    };
  }, []);

  return (
    <Container maxWidth="lg" className={classes.mainGrid}>
      <Intro
        title={
          <Link
            color="inherit"
            variant="h6"
            underline="none"
            component={RouterLink}
            to={URL.LEAGUES.IPL}
          >
            Indian Premier League
          </Link>
        }
        description=""
        image="https://source.unsplash.com/hY3sn--SgwM"
        imgText="my leagues"
        linkText=""
      />
      <Paper elevation={3} className={classes.tournamentScores}>
        <Grid container spacing={3} justify="center">
          <TotalScoreBoard score={scores} />
        </Grid>
      </Paper>
    </Container>
  );
}
