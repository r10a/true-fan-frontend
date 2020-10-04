import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { URL } from "../../Routes";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Grid,
  Link,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@material-ui/core";
import DashboardAPI, {
  ITournamentScore,
  ITournamentStats,
} from "../../api/DashboardAPI";
import Intro from "./modules/components/Intro";
import TotalScoreBoard from "./modules/components/TotalScoreBoard";
import SwipeableViews from "react-swipeable-views";
import { findIndex, map } from "lodash-es";
import MatchStats from "./modules/components/MatchStats";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

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
  scoreInsights: {
    marginBottom: theme.spacing(2),
  },
  tournamentScores: {
    padding: 0,
  },
  slide: {
    padding: 15,
    minHeight: 100,
    color: "#000",
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
  const [tournamentStats, setTournamentStats] = useState(
    {} as ITournamentStats
  );
  const [matchIndex, setMatchIndex] = useState(0);

  // constructor and destructor
  useEffect(() => {
    function getScores() {
      DashboardAPI.getTotalScores(CURRENT_TOURNAMENT).then((response) => {
        setTournamentScores(response.result.Item);
      });
    }
    function getStats() {
      DashboardAPI.getStats(CURRENT_TOURNAMENT).then((response) => {
        const tournamentStats = response.result.Item;
        const matchIdx = findIndex(
          tournamentStats.stats,
          (stat) => stat.completed === false
        );
        setMatchIndex(matchIdx);
        setTournamentStats(tournamentStats);
      });
    }

    getScores();
    getStats();
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
            to={URL.LEAGUES.MANAGE}
          >
            Indian Premier League
          </Link>
        }
        description="Click here to Manage your Leagues"
        image="https://source.unsplash.com/hY3sn--SgwM"
        imgText="my leagues"
        linkText=""
      />
      <Card elevation={3} className={classes.scoreInsights}>
        <CardHeader title="Match Statistics" />
        <Divider />
        <CardContent>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={1}>
              <ChevronLeftIcon
                onClick={() => matchIndex > 0 && setMatchIndex(matchIndex - 1)}
              />
            </Grid>
            <Grid item xs={10}>
              <SwipeableViews enableMouseEvents index={matchIndex}>
                {map(tournamentStats.stats, (stats, idx) => (
                  <MatchStats
                    stats={stats}
                    idx={idx}
                    key={`${stats.left}vs${stats.right}${idx}`}
                  />
                ))}
              </SwipeableViews>
            </Grid>
            <Grid item xs={1}>
              <ChevronRightIcon
                onClick={() =>
                  matchIndex < tournamentStats.stats.length - 1 &&
                  setMatchIndex(matchIndex + 1)
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card elevation={3}>
        <CardHeader title="Tournament Standings" />
        <CardContent className={classes.tournamentScores}>
          <Grid container spacing={3} justify="center">
            <TotalScoreBoard
              score={scores}
              survivorSelector="tournamentSurvivorRank"
              confidenceSelector="tournamentConfidenceRank"
            />
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
