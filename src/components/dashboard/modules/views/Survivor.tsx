import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Intro from "../components/Intro";
import { URL } from "../../../../Routes";
import {
  isEmpty,
  map,
  zipWith,
  set,
  ceil,
  groupBy,
  omit,
  get,
  min,
  filter,
  cloneDeep,
  times,
  includes,
} from "lodash-es";
import LeagueAPI, {
  IPrediction,
  IMatch,
  ISurvivorPredictionPayload,
} from "../../../../api/LeagueAPI";
import { LEAGUE_ACTIONS } from "../../../../reducers/LeagueReducer";
import { useDispatch, useSelector } from "react-redux";
import TeamSwitcher, { MatchStatus } from "../components/TeamSwitcher";
import { reducers } from "../../../../reducers";
import { Paper, Fab } from "@material-ui/core";
import Title from "../components/Title";
import SaveIcon from "@material-ui/icons/Save";
import SurvivorStatusBar from "../components/SurvivorStatusBar";
import {
  differenceInMilliseconds,
  subHours,
  addHours,
  isAfter,
} from "date-fns";
import { IUserScore } from "../../../../api/DashboardAPI";
import UnlockMatchDialog from "../components/UnlockMatchDialog";

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
  statusBar: {
    [theme.breakpoints.down("sm")]: {
      top: theme.spacing(8),
    },
    [theme.breakpoints.up("md")]: {
      top: theme.spacing(8.7),
    },
    backgroundColor: theme.palette.secondary.main,
  },
  statusBarBadge: {
    // padding: theme.spacing(1),
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
  saveButton: {
    paddingLeft: theme.spacing(5) + "px !important",
    [theme.breakpoints.up("lg")]: {
      display: "block",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export interface IConfidenceScore {
  score: number;
  remaining: number;
}

export interface IUserMatch {
  match: IMatch;
  prediction: IPrediction;
}

interface ISurvivorProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  history: any;
  match: {
    params: { [key: string]: string };
  };
}

export interface IPowerPlayPoints {
  remaining: number;
  total: number;
  freeHits: IUserScore["freeHits"];
  usedFreeHits: IUserScore["usedFreeHits"];
}

export interface IEditPredictionPayload {
  open: boolean;
  index: number;
  matchStatus: MatchStatus;
}

export const getValidFreeHits = (
  freeHits: IPowerPlayPoints["freeHits"],
  usedFreeHits: IPowerPlayPoints["usedFreeHits"]
): IPowerPlayPoints["freeHits"] => {
  if (isEmpty(freeHits)) {
    return [];
  }
  const validFreeHits = filter(freeHits, ({ expiry, match }) => {
    return (
      isAfter(new Date(expiry), new Date()) && !includes(usedFreeHits, match)
    );
  });
  return validFreeHits;
};

export default function Survivor(props: ISurvivorProps) {
  if (!props.isAuthenticated) props.history.push(URL.HOME);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const store: any = useSelector((state: reducers) => state.LeagueReducer);
  const [schedule, setSchedule] = useState([] as IMatch[]);
  const [userMatches, setUserMatches] = useState([] as IUserMatch[]);
  const [confidenceScores, setConfidenceScores] = useState([
    { score: 20, remaining: 0 },
    { score: 40, remaining: 0 },
    { score: 60, remaining: 0 },
    { score: 80, remaining: 0 },
    { score: 100, remaining: 0 },
  ] as IConfidenceScore[]);
  const [userScore, setUserScore] = useState({} as IUserScore);
  const [powerPlayPoints, setPowerPlayPoints] = useState({
    remaining: 0,
    total: 0,
    freeHits: [],
    usedFreeHits: [],
  } as IPowerPlayPoints);
  const [editPrediction, openEditPrediction] = useState({
    open: false,
    index: 0,
    matchStatus: MatchStatus.NOT_STARTED,
  } as IEditPredictionPayload);

  const tournament = props.match.params.game;
  const leagueName = props.match.params.league;

  // constructor and destructor
  useEffect(() => {
    const init = async () => {
      const getScore = async (): Promise<IUserScore> => {
        try {
          const scoreResponse = await LeagueAPI.getScore(
            tournament,
            leagueName
          );
          const {
            usedPowerPlayPoints,
            freeHits,
            usedFreeHits,
          } = scoreResponse.result.Item.leagues[0].scores[0];
          setUserScore(scoreResponse.result.Item.leagues[0].scores[0]);
          return {
            usedPowerPlayPoints,
            freeHits,
            usedFreeHits: usedFreeHits || [],
          } as IUserScore;
        } catch (e) {
          return {} as IUserScore;
        }
      };

      dispatch({ type: LEAGUE_ACTIONS.GET_SCHEDULE, tournament });
      dispatch({
        type: LEAGUE_ACTIONS.GET_SURVIVOR_PREDICTION,
        tournament,
        leagueName,
      });
      const leagueResponse = await LeagueAPI.getLeague(leagueName);
      const { totalPowerPlayPoints } = leagueResponse.result.Item;
      const { usedPowerPlayPoints, freeHits, usedFreeHits } = await getScore();
      setPowerPlayPoints({
        remaining: totalPowerPlayPoints - (usedPowerPlayPoints || 0),
        total: totalPowerPlayPoints,
        freeHits,
        usedFreeHits,
      });
    };
    init();
    return function cleanup() {
      dispatch({ type: LEAGUE_ACTIONS.RESET });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueName, tournament]);

  // schedule store watcher
  useEffect(() => {
    const updateSchedule = async () => {
      const response = await store.schedule;
      response.result && setSchedule(response.result.Item.schedule);
    };
    updateSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.schedule]);

  // prediction watcher
  useEffect(() => {
    const updatePredictions = async () => {
      const response = await store.survivorPrediction;
      const predictions = get(
        response,
        "result.Item.predictions",
        times(schedule.length, () => ({ team: "", mom: "", confidence: 0 }))
      );

      const maxUses = ceil(schedule.length / 5);
      const currentUses = omit(
        groupBy(predictions, (p) => p.confidence),
        [0]
      );
      const currConfidenceScores = map(confidenceScores, (currScore) => {
        return {
          score: currScore.score,
          remaining: maxUses - get(currentUses, currScore.score, []).length,
        };
      });

      const currUserMatches = zipWith(
        schedule,
        predictions,
        (match: IMatch, prediction: IPrediction) => {
          // auto assign for skipped matches
          if (
            isEmpty(prediction.team) &&
            (match.completed ||
              differenceInMilliseconds(
                subHours(new Date(match.start), 1),
                new Date()
              ) < 0)
          ) {
            const minimumScoreAssignable =
              min(
                map(
                  filter(
                    currConfidenceScores,
                    ({ score, remaining }) => remaining !== 0
                  ),
                  "score"
                )
              ) || 0;
            currConfidenceScores[
              minimumScoreAssignable / 20 - 1
            ].remaining -= 1;
            set(prediction, "confidence", minimumScoreAssignable);
          }
          if (isEmpty(match.end)) {
            match.end = addHours(new Date(match.start), 3).toISOString();
          }
          return { match, prediction };
        }
      );
      updateUserMatches(currUserMatches);
    };

    if (!isEmpty(schedule)) {
      updatePredictions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, store.survivorPrediction]);

  const updateUserMatches = (userSchedule: IUserMatch[]) => {
    const maxUses = ceil(userSchedule.length / 5);
    const currentUses = omit(
      groupBy(userSchedule, (s) => s.prediction.confidence),
      [0]
    );
    const currConfidenceScores = map(confidenceScores, (currScore) => {
      return {
        score: currScore.score,
        remaining: maxUses - get(currentUses, currScore.score, []).length,
      };
    });
    setUserMatches(userSchedule);
    setConfidenceScores(currConfidenceScores);
  };

  const updatePredictionHandler = (index: number, prediction: IPrediction) => {
    const currUserSchedule = cloneDeep(userMatches);
    set(currUserSchedule, [index, "prediction"], prediction);
    updateUserMatches(currUserSchedule);
    return currUserSchedule;
  };

  const _savePredictionToDb = useCallback(
    (payload: ISurvivorPredictionPayload) => {
      LeagueAPI.setSurvivorPrediction(payload)
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
    },
    [enqueueSnackbar]
  );

  const _savePredictions = () => {
    const payload = {
      tournament,
      leagueName,
      predictions: map(userMatches, "prediction"),
    };
    _savePredictionToDb(payload);
  };

  const _openUnlockPredictionHandler = (
    index: number,
    matchStatus: MatchStatus
  ) => {
    openEditPrediction({ open: true, index, matchStatus });
  };

  const _closeUnlockPredictionHandler = (
    index: number,
    prediction: IPrediction,
    usedPowerPlayPoints: number,
    useFreeHit: boolean
  ) => {
    openEditPrediction({
      open: false,
      index,
      matchStatus: MatchStatus.NOT_STARTED,
    });
    const getScoreUpdate = () => {
      if (useFreeHit) {
        console.log(powerPlayPoints);
        const validFreeHits = getValidFreeHits(
          powerPlayPoints.freeHits,
          powerPlayPoints.usedFreeHits
        );
        console.log(
          validFreeHits,
          powerPlayPoints.usedFreeHits,
          validFreeHits[0].match
        );
        return {
          usedPowerPlayPoints:
            powerPlayPoints.total - powerPlayPoints.remaining,
          usedFreeHits: [
            ...powerPlayPoints.usedFreeHits,
            validFreeHits[0].match,
          ],
        };
      } else {
        return {
          usedPowerPlayPoints:
            powerPlayPoints.total -
            powerPlayPoints.remaining +
            usedPowerPlayPoints,
          usedFreeHits: [...powerPlayPoints.usedFreeHits],
        };
      }
    };

    const score = getScoreUpdate();

    setPowerPlayPoints({
      ...powerPlayPoints,
      remaining: powerPlayPoints.remaining - score.usedPowerPlayPoints,
      usedFreeHits: score.usedFreeHits,
    });

    LeagueAPI.putScore(tournament, leagueName, {
      ...userScore,
      ...score,
    });
    _savePredictionToDb({
      tournament,
      leagueName,
      predictions: map(
        updatePredictionHandler(index, prediction),
        "prediction"
      ),
    });
  };

  const _cancelUnlockPredictionHandler = () => {
    console.log(userScore);
    openEditPrediction({
      open: false,
      index: 0,
      matchStatus: MatchStatus.NOT_STARTED,
    });
  };

  const minimumScoreAssignable =
    min(
      map(
        filter(confidenceScores, ({ score, remaining }) => remaining !== 0),
        "score"
      )
    ) || 0;

  const getTeamSwitchers = () => {
    return !isEmpty(userMatches) ? (
      map(userMatches, (userMatch, index) => (
        <Grid
          item
          xs={12}
          key={`${userMatch.match.left}vs${userMatch.match.right}@${userMatch.match.start}`}
        >
          <TeamSwitcher
            userMatch={userMatch}
            tournament={tournament}
            index={index}
            confidenceScores={confidenceScores}
            minimumScoreAssignable={minimumScoreAssignable}
            updatePredictionHandler={updatePredictionHandler}
            isEditMode={false}
            save={_savePredictions}
            edit={_openUnlockPredictionHandler}
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
    <React.Fragment>
      <Container maxWidth="lg" className={classes.mainGrid}>
        <main>
          <Intro
            title={props.match.params.game}
            description={`${props.match.params.league}
                            Remaining PPP: ${
                              powerPlayPoints.remaining
                            } | FreeHits: ${
              getValidFreeHits(
                powerPlayPoints.freeHits,
                powerPlayPoints.usedFreeHits
              ).length
            }`}
            image="https://source.unsplash.com/random"
            imgText="main image description"
            linkText=""
          />
          <SurvivorStatusBar
            classes={classes}
            confidenceScores={confidenceScores}
            save={_savePredictions}
          />
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={3} className={classes.leaguesSection}>
                <Title title="Predictions" />
                <Grid container spacing={4}>
                  {getTeamSwitchers()}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} className={classes.saveFab}>
              <Fab
                color="primary"
                aria-label="save"
                variant="extended"
                onClick={_savePredictions}
              >
                <SaveIcon className={classes.extendedIcon} />
                Save
              </Fab>
            </Grid>
          </Grid>
        </main>
        {!isEmpty(userMatches) && (
          <UnlockMatchDialog
            editPrediction={editPrediction}
            tournament={tournament}
            userMatches={userMatches}
            confidenceScores={confidenceScores}
            minimumScoreAssignable={minimumScoreAssignable}
            powerPlayPoints={powerPlayPoints}
            updatePredictionHandler={updatePredictionHandler}
            handleCancel={_cancelUnlockPredictionHandler} // temp
            handleSubmit={_closeUnlockPredictionHandler}
          />
        )}
      </Container>
    </React.Fragment>
  );
}
