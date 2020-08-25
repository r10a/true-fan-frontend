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
import { map } from "lodash-es";
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
    // padding: theme.spacing(2),
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

  // constructor and destructor
  useEffect(() => {
    function getScores() {
      DashboardAPI.getTotalScores(CURRENT_TOURNAMENT).then((response) => {
        setTournamentScores(response.result.Item);
      });
    }
    function getStats() {
      DashboardAPI.getStats(CURRENT_TOURNAMENT).then((response) => {
        setTournamentStats(response.result.Item);
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
      <Card elevation={3} className={classes.scoreInsights}>
        <CardHeader title="Match Statistics" />
        <Divider />
        <CardContent>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={1}>
              <ChevronLeftIcon />
            </Grid>
            <Grid item xs={10}>
              <SwipeableViews enableMouseEvents>
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
              <ChevronRightIcon />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card elevation={3} className={classes.tournamentScores}>
        <CardHeader title="Tournament Standings" />
        <Divider />
        <CardContent>
          <Grid container spacing={3} justify="center">
            <TotalScoreBoard score={scores} />
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
