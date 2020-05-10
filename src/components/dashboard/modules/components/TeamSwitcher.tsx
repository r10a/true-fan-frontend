import React, { useState, useEffect, SyntheticEvent } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Countdown, { CountdownRenderProps } from "react-countdown-now";
import { IPrediction } from "../../../../api/LeagueAPI";
import theme from "../../../../theme";
import ConfidenceSlider from "./ConfidenceSlider";
import PlayerAutocomplete from "./PlayerAutocomplete";
import { CardHeader, IconButton } from "@material-ui/core";
import {
  IUserMatch,
  IConfidenceScore,
  getValidFreeHits,
  IPowerPlayPoints,
} from "../views/Survivor";
import { find, isEmpty, includes } from "lodash-es";
import {
  subHours,
  differenceInMilliseconds,
  isBefore,
  differenceInMinutes,
  isAfter,
  isWithinInterval,
} from "date-fns";

const MAX_32_BIT_INTEGER = 0x7fffffff;

const useStyles = makeStyles({
  card: {
    display: "flex",
    cursor: "pointer",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  cardSelected: {
    backgroundColor: theme.palette.primary.light,
    color: "white",
  },
  rootPaper: {
    padding: theme.spacing(2),
  },
  correctPrediction: {
    background: "#91ff91a6",
  },
  wrongPrediction: {
    background: "#ff9d9d63",
  },
});

interface ITeamSwitcherProps {
  userMatch: IUserMatch;
  tournament: string;
  index: number;
  minimumScoreAssignable: number;
  confidenceScores: IConfidenceScore[];
  powerPlayPoints: IPowerPlayPoints;
  updatePredictionHandler: (index: number, prediction: IPrediction) => void;
  isEditMode: boolean;
  save?: () => void;
  edit?: (index: number, matchStatus: MatchStatus) => void;
}

export interface IPlayerOption {
  team: string;
  player: string;
}

export enum MatchStatus {
  NOT_STARTED,
  QUARTER,
  HALF,
  THREE_QUARTER,
  END_PHASE,
  COMPLETED,
}

export const statusCostMap = {
  [MatchStatus.NOT_STARTED]: 100,
  [MatchStatus.QUARTER]: 100,
  [MatchStatus.HALF]: 500,
  [MatchStatus.THREE_QUARTER]: 1000,
  [MatchStatus.END_PHASE]: Number.POSITIVE_INFINITY,
  [MatchStatus.COMPLETED]: Number.POSITIVE_INFINITY,
};

const getMatchStatus = (
  start: string,
  end: string,
  completed: boolean
): [number, MatchStatus] => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();
  if (completed || isAfter(now, endDate)) return [100, MatchStatus.COMPLETED];
  if (isBefore(now, startDate)) return [0, MatchStatus.NOT_STARTED];
  const matchDuration = differenceInMinutes(endDate, startDate);
  const elapsedTime = differenceInMinutes(now, startDate);
  const percentCompleted = Math.round((elapsedTime / matchDuration) * 100);
  if (percentCompleted < 25) return [percentCompleted, MatchStatus.QUARTER];
  if (percentCompleted < 50) return [percentCompleted, MatchStatus.HALF];
  if (percentCompleted < 75)
    return [percentCompleted, MatchStatus.THREE_QUARTER];
  if (percentCompleted < 100) return [percentCompleted, MatchStatus.END_PHASE];
  return [percentCompleted, MatchStatus.COMPLETED];
};

function TeamSwitcher(props: ITeamSwitcherProps) {
  const classes = useStyles();
  const {
    updatePredictionHandler,
    minimumScoreAssignable,
    tournament,
    confidenceScores,
    userMatch: {
      match: {
        left,
        right,
        start,
        completed: matchCompleted,
        mom: matchMom,
        winner,
        end,
      },
      prediction,
    },
    index,
    save,
    edit,
    isEditMode,
    powerPlayPoints: { freeHits, usedFreeHits, remaining },
  } = props;
  const [team, setTeam] = useState(prediction.team);
  const [mom, setMom] = useState(prediction.mom);
  const [confidence, setConfidence] = useState(prediction.confidence);
  const [cache, setCache] = useState(prediction.confidence);
  const [currTime, setCurrTime] = useState(new Date());

  const [percentCompleted, matchStatus] = getMatchStatus(
    start,
    end,
    matchCompleted
  );

  const matchInterval = {
    start: subHours(new Date(start), 1),
    end: new Date(end),
  };
  const timeout = differenceInMilliseconds(
    subHours(new Date(start), 1),
    new Date()
  );
  const [locked, setLocked] = useState(timeout < 0 && !isEditMode);
  const isUnlockable =
    locked &&
    matchStatus !== MatchStatus.END_PHASE &&
    matchStatus !== MatchStatus.COMPLETED;
  const disabled = matchCompleted || !team || locked || right === "TBD";

  const useFreeHit =
    !isEmpty(getValidFreeHits(freeHits, usedFreeHits)) &&
    !includes(
      [MatchStatus.THREE_QUARTER, MatchStatus.END_PHASE, MatchStatus.COMPLETED],
      matchStatus
    );
  const canEdit = remaining - statusCostMap[matchStatus] >= 0 || useFreeHit;

  useEffect(() => {
    // save prediction when time is up
    const startTimer = () => {
      if (!!save && timeout < MAX_32_BIT_INTEGER && timeout > 0) {
        return setTimeout(() => {
          if (!team) {
            setConfidence(minimumScoreAssignable);
            setCache(minimumScoreAssignable);
          }
          updatePredictionHandler(index, {
            team,
            mom,
            confidence: confidence || minimumScoreAssignable,
          });
          setLocked(true);
          setTimeout(save);
        }, timeout);
      }
    };
    // start updating matching progress every minute after match start.
    const startTicker = () => {
      if (isWithinInterval(currTime, matchInterval)) {
        return setInterval(() => setCurrTime(new Date()), 60000);
      }
    };
    const timerId = startTimer();
    const intervalId = startTicker();
    return function cleanUp() {
      if (timerId) clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save]);

  useEffect(() => {
    updatePredictionHandler(index, { team, mom, confidence });
    // only update prediction if team, mom, or confidence is to be updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team, mom, confidence]);

  useEffect(() => {
    setTeam(prediction.team);
    setMom(prediction.mom);
    setConfidence(prediction.confidence);
    setCache(prediction.confidence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction]);

  const isTeamSelected = (currentTeam: string) => {
    return currentTeam === team;
  };

  const switchTeam = (newTeam: string) => {
    if (team && isTeamSelected(newTeam)) {
      setTeam("");
      setMom("");
      setConfidence(0);
      setCache(0);
    } else {
      setTeam(newTeam);
      if (confidence === 0) {
        setConfidence(minimumScoreAssignable);
        setCache(minimumScoreAssignable);
      }
    }
  };
  const _onCacheChange = (e: object, newValue: number | number[]) => {
    const currUtilization =
      find(confidenceScores, { score: newValue as number })?.remaining || 0;
    if (currUtilization > 0) {
      setCache(newValue as number);
    }
  };
  const _switchTeamHandler = (name: string) => (e: SyntheticEvent) =>
    right !== "TBD" && !matchCompleted && !locked && switchTeam(name);
  const _momHandler = (e: object, value: IPlayerOption | null) =>
    !matchCompleted && setMom(value?.player || "");
  const _confidenceHandler = (e: object, newValue: number | number[]) =>
    !matchCompleted && setConfidence(cache);

  const startDate = new Date(start);
  const endDate = new Date(end);
  const _timeRemainingRenderer = ({
    days,
    hours,
    minutes,
    completed,
  }: CountdownRenderProps) => {
    if (matchCompleted && completed) {
      return (
        <div>
          <div>{`Winner: ${winner}`}</div>
          <div>{`Man of the match: ${matchMom}`}</div>
        </div>
      );
    } else if (timeout < 0) {
      switch (matchStatus) {
        case MatchStatus.NOT_STARTED:
          return (
            <div onClick={() => !!edit && canEdit && edit(index, matchStatus)}>
              <div>{`Match start in ${minutes} minute(s)`}</div>
              <div>{`Prediction locked`}</div>
              <div>
                {canEdit
                  ? useFreeHit
                    ? "FreeHit Available"
                    : "P1 Available"
                  : ""}
              </div>
            </div>
          );
        case MatchStatus.QUARTER:
          return (
            <div onClick={() => !!edit && canEdit && edit(index, matchStatus)}>
              <div>{`Match started @ ${startDate.toLocaleTimeString()} | Progress ${percentCompleted}%`}</div>
              <div>{`Prediction locked`}</div>
              <div>
                {canEdit
                  ? useFreeHit
                    ? "FreeHit Available"
                    : "P1 Available"
                  : ""}
              </div>
            </div>
          );
        case MatchStatus.HALF:
          return (
            <div onClick={() => !!edit && canEdit && edit(index, matchStatus)}>
              <div>{`Match started @ ${startDate.toLocaleTimeString()} | Progress ${percentCompleted}%`}</div>
              <div>{`Prediction locked`}</div>
              <div>
                {canEdit
                  ? useFreeHit
                    ? "FreeHit Available"
                    : "P2 Available"
                  : ""}
              </div>
            </div>
          );
        case MatchStatus.THREE_QUARTER:
          return (
            <div onClick={() => !!edit && canEdit && edit(index, matchStatus)}>
              <div>{`Match started @ ${startDate.toLocaleTimeString()} | Progress ${percentCompleted}%`}</div>
              <div>{`Prediction locked`}</div>
              <div>
                {canEdit
                  ? useFreeHit
                    ? "FreeHit Available"
                    : "P3 Available"
                  : ""}
              </div>
            </div>
          );
        case MatchStatus.END_PHASE:
          return (
            <div>
              <div>{`Match started @ ${startDate.toLocaleTimeString()} | Progress ${percentCompleted}%`}</div>
              <div>{`Prediction locked`}</div>
            </div>
          );
        case MatchStatus.COMPLETED:
          return (
            <div>
              <div>{`Match completed @ ${endDate.toLocaleTimeString()} | Results Pending`}</div>
              <div>{`Prediction locked`}</div>
            </div>
          );
      }
    }
    return `${days} day(s), ${hours} hour(s), ${minutes} minute(s)`;
  };

  return (
    <Card
      className={clsx(
        classes.rootPaper,
        matchCompleted &&
          (team === winner
            ? classes.correctPrediction
            : classes.wrongPrediction)
      )}
      variant="outlined"
    >
      <CardHeader
        title={
          <Box fontWeight="fontWeightBold" fontSize="h4.fontSize">
            {`Match #${index + 1}`}
          </Box>
        }
        subheader={
          <>
            <div>{`${startDate.toDateString()}`}</div>
            <Countdown date={startDate} renderer={_timeRemainingRenderer} />
            <Typography component="h2" variant="h5">
              {!!confidence ? `Confidence ${confidence}%` : ""}
            </Typography>
          </>
        }
        action={
          !!edit &&
          isUnlockable && (
            <IconButton
              aria-label="unlock"
              onClick={() => edit(index, matchStatus)}
            >
              <LockOpenIcon />
            </IconButton>
          )
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item container spacing={2} justify="center" alignItems="center">
            <Grid item xs={6} md>
              <Card
                className={clsx(
                  classes.card,
                  isTeamSelected(left) && classes.cardSelected
                )}
                onClick={_switchTeamHandler(left)}
                raised={isTeamSelected(left)}
              >
                <div className={classes.cardDetails}>
                  <CardContent>
                    <Typography component="h2" variant="h5">
                      {left}
                    </Typography>
                  </CardContent>
                </div>
                {/* <Hidden xsDown> add team logos here
                                <CardMedia className={classes.cardMedia} image={post.image} title={post.imgText} />
                            </Hidden> */}
              </Card>
            </Grid>
            <Grid item xs={6} md>
              <Card
                className={clsx(
                  classes.card,
                  isTeamSelected(right) && classes.cardSelected
                )}
                onClick={_switchTeamHandler(right)}
                raised={isTeamSelected(right)}
              >
                <div className={classes.cardDetails}>
                  <CardContent>
                    <Typography component="h2" variant="h5">
                      {right}
                    </Typography>
                  </CardContent>
                </div>
                {/* <Hidden xsDown> add team logos here
                                <CardMedia className={classes.cardMedia} image={post.image} title={post.imgText} />
                            </Hidden> */}
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <PlayerAutocomplete
                value={{ team, player: mom }}
                tournament={tournament}
                leftTeam={left}
                rightTeam={right}
                wrong={matchCompleted && mom !== matchMom}
                correct={matchCompleted && mom === matchMom}
                disabled={disabled}
                changeHandler={_momHandler}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="flex-start">
            <ConfidenceSlider
              value={cache}
              disabled={disabled}
              onChange={_onCacheChange}
              onChangeCommitted={_confidenceHandler}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={20}
              marks={true}
              min={0}
              max={100}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default React.memo(TeamSwitcher);
