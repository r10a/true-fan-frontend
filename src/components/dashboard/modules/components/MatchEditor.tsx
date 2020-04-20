import {
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { DateTimePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React, { useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown-now";
import { IMatch } from "../../../../api/LeagueAPI";
import theme from "../../../../theme";
import PlayerAutocomplete from "./PlayerAutocomplete";
import { IPlayerOption } from "./TeamSwitcher";
import { isEmpty } from "lodash-es";

const useStyles = makeStyles({
  card: {
    display: "flex",
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
  winnerSelection: {
    justifyContent: "space-evenly",
  },
});

interface IMatchEditorProps {
  match: IMatch;
  tournament: string;
  index: number;
  updateMatchHandler: (index: number, match: IMatch) => void;
}

export default function MatchEditor(props: IMatchEditorProps) {
  const classes = useStyles();
  const {
    updateMatchHandler,
    tournament,
    match: {
      left,
      right,
      start,
      completed: matchCompleted,
      mom: matchMom,
      winner,
      end,
    },
    index,
  } = props;
  const [matchStart, setMatchStart] = useState(start);
  const [matchEnd, setMatchEnd] = useState(end);
  const [completed, setCompleted] = useState(matchCompleted);
  const [mom, setMom] = useState(matchMom);
  const [matchWinner, setMatchWinner] = useState(winner || "");

  useEffect(() => {
    updateMatchHandler(index, {
      left,
      right,
      start: matchStart,
      end: matchEnd,
      completed,
      mom,
      winner: matchWinner,
    });
    // only update prediction if team, mom, or confidence is to be updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchStart, matchEnd, mom, completed, matchWinner]);

  const _momHandler = (e: object, value: IPlayerOption | null) =>
    setMom(value?.player || "");

  const _timeRemainingRenderer = ({
    days,
    hours,
    minutes,
    completed,
  }: CountdownRenderProps) => {
    if (matchCompleted || completed)
      return `Winner: ${winner} Man of the match: ${matchMom}`;
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  const startDate = new Date(matchStart);
  const endDate = matchEnd ? new Date(matchEnd) : null;
  const _startHandler = (newStart: MaterialUiPickersDate) =>
    newStart && setMatchStart(newStart.toISOString());
  const _endHandler = (newEnd: MaterialUiPickersDate) =>
    setMatchEnd(!!newEnd ? newEnd.toISOString() : "");
  const _completedHandler = (e: object, checked: boolean) => {
    setCompleted(
      mom !== "none" && !isEmpty(matchEnd) && !isEmpty(matchWinner) && checked
    );
  };
  const _winnerHandler = (e: object, value: string) => {
    setMatchWinner(value);
    setCompleted(true);
  };
  const _clearWinnerHandler = (e: object) => {
    setMatchWinner("");
    setMom("none");
    setCompleted(false);
  };
  return (
    <Card className={classes.rootPaper} variant="outlined">
      <CardHeader
        title={
          <Box fontWeight="fontWeightBold" fontSize="h4.fontSize">
            {`Match #${index + 1}`}
          </Box>
        }
        subheader={
          <>
            <div>{`${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}`}</div>
            <Countdown date={startDate} renderer={_timeRemainingRenderer} />
          </>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item container spacing={2} justify="center" alignItems="center">
            <Grid item xs={12} md>
              <DateTimePicker
                fullWidth
                value={startDate}
                onChange={_startHandler}
                label="Start"
                format="yyyy/MM/dd hh:mm a"
              />
            </Grid>
            <Grid item xs={12} md>
              <DateTimePicker
                clearable
                fullWidth
                minDate={startDate}
                value={endDate}
                onChange={_endHandler}
                label="End"
                format="yyyy/MM/dd hh:mm a"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <PlayerAutocomplete
                value={{ team: left, player: mom }}
                tournament={tournament}
                leftTeam={left}
                rightTeam={right}
                disabled={false}
                changeHandler={_momHandler}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs={12} md>
              <FormControl fullWidth>
                <FormLabel component="legend">Winner</FormLabel>
                <RadioGroup
                  aria-label="winner"
                  name="winner"
                  value={matchWinner === "" ? null : matchWinner}
                  onChange={_winnerHandler}
                  row
                  className={classes.winnerSelection}
                >
                  <FormControlLabel
                    value={left}
                    control={<Radio />}
                    label={left}
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value={right}
                    control={<Radio />}
                    label={right}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value={""}
                    control={
                      <IconButton onClick={_clearWinnerHandler}>
                        <HighlightOffIcon />
                      </IconButton>
                    }
                    label=""
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md>
              <Typography component="h2" variant="h5">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={completed}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                      onChange={_completedHandler}
                    />
                  }
                  label="Finished"
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
