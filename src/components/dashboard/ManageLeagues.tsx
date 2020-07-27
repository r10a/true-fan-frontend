import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { URL } from "../../Routes";
import { isEmpty, map, sortBy, reverse, get } from "lodash-es";
import { LEAGUE_ACTIONS } from "../../reducers/LeagueReducer";
import { useDispatch, useSelector } from "react-redux";
import CardListItem from "./modules/components/CardListItem";
import { reducers } from "../../reducers";
import { Paper } from "@material-ui/core";
import Title from "./modules/components/Title";
import ManageLeagueDialog from "./modules/components/ManageLeagueDialog";
import { ILeague } from "../../api/LeagueAPI";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  leaguesSection: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

interface IDashboardProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  history: any;
}

export default function ManageLeagues(props: IDashboardProps) {
  if (!props.isAuthenticated) props.history.push(URL.HOME);
  const classes = useStyles();
  const dispatch = useDispatch();
  const store: any = useSelector((state: reducers) => state.LeagueReducer);
  const [adminLeagues, setAdminLeagues] = useState([] as ILeague[]);
  const [userLeagues, setUserLeagues] = useState([] as ILeague[]);
  const [selectedLeague, setSelectedLeague] = useState({} as ILeague);
  const [isManageOpen, openManage] = useState(false);

  const tournament = "IPL-2020"; // TODO: Refactor later

  // constructor and destructor
  useEffect(() => {
    const getUserLeagues = async () => {
      dispatch({ type: LEAGUE_ACTIONS.GET_USER_LEAGUES });
    };
    getUserLeagues();
    return function cleanup() {
      dispatch({ type: LEAGUE_ACTIONS.RESET });
    };
  }, [dispatch]);

  // store watcher
  useEffect(() => {
    const updateUserLeagues = async () => {
      const leagues = await store.user_leagues;
      const sortedAdminLeagues = reverse(
        sortBy(
          get(leagues, "result.Items[0].adminLeagues"),
          (l) => l.created || ""
        )
      );
      const sortedUserLeagues = reverse(
        sortBy(
          get(leagues, "result.Items[0].userLeagues"),
          (l) => l.created || ""
        )
      );
      setAdminLeagues(sortedAdminLeagues);
      setUserLeagues(sortedUserLeagues);
    };
    updateUserLeagues();
  }, [store.user_leagues]);

  const navigateToLeague = (leagueName: string) => {
    const url = URL.LEAGUES.SURVIVOR.replace(":game", tournament).replace(
      ":league",
      leagueName
    );
    props.history.push(url);
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.mainGrid}>
        <main>
          <Grid container spacing={4}>
            {!isEmpty(adminLeagues) && (
              <Grid item xs={12}>
                <Paper elevation={3} className={classes.leaguesSection}>
                  <Title title="Leagues you own" />
                  <Grid container spacing={2}>
                    {map(adminLeagues, (league) => (
                      <Grid item xs={12} key={league.leagueName}>
                        <CardListItem
                          title={league.leagueName}
                          description={league.description}
                          owner={league.userId}
                          onClick={() => navigateToLeague(league.leagueName)}
                          onOptionsClick={() => {
                            setSelectedLeague(league);
                            dispatch({
                              type: LEAGUE_ACTIONS.GET_LEAGUE_MEMBERS,
                              tournament,
                              leagueName: league.leagueName,
                            });
                            openManage(true);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.leaguesSection}>
                <Title title="League invites" />
                <Grid container spacing={2}>
                  {!isEmpty(userLeagues) ? (
                    map(userLeagues, (league) => (
                      <Grid item xs={12} key={league.leagueName}>
                        <CardListItem
                          title={league.leagueName}
                          description={league.description}
                          owner={league.userId}
                          onClick={() => navigateToLeague(league.leagueName)}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      You are not invited to any Leagues yet
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <ManageLeagueDialog
            open={isManageOpen}
            league={selectedLeague}
            handleClose={() => openManage(false)}
          />
        </main>
      </Container>
    </React.Fragment>
  );
}
