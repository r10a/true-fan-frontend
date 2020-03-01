import React, { useState, useEffect, SyntheticEvent } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Countdown, { CountdownRenderProps } from 'react-countdown-now';
import { IPrediction } from '../../../../api/LeagueAPI';
import theme from '../../../../theme';
import ConfidenceSlider from './ConfidenceSlider';
import PlayerAutocomplete from './PlayerAutocomplete';
import { CardHeader } from '@material-ui/core';
import { IUserMatch, IConfidenceScore } from '../views/Survivor';
import { find } from 'lodash-es';

const useStyles = makeStyles({
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 160,
    },
    cardSelected: {
        backgroundColor: theme.palette.primary.light,
        color: 'white'
    },
    rootPaper: {
        padding: theme.spacing(2)
    }
});

interface ITeamSwitcherProps {
    userMatch: IUserMatch;
    tournament: string;
    index: number;
    minimumScoreAssignable: number;
    confidenceScores: IConfidenceScore[];
    updatePredictionHandler: (index: number, prediction: IPrediction) => void;
    [key: string]: any;
}

export interface IPlayerOption {
    team: string;
    player: string
};

function TeamSwitcher(props: ITeamSwitcherProps) {
    const classes = useStyles();
    const {
        updatePredictionHandler,
        minimumScoreAssignable,
        tournament,
        confidenceScores,
        userMatch: { match: { left, right, start, completed: matchCompleted, mom: matchMom, winner, end }, prediction },
        index
    } = props;
    const [team, setTeam] = useState(prediction.team);
    const [mom, setMom] = useState(prediction.mom);
    const [confidence, setConfidence] = useState(prediction.confidence);
    const [cache, setCache] = useState(prediction.confidence);

    useEffect(() => {
        updatePredictionHandler(index, { team, mom, confidence });
        // only update prediction if team, mom, or confidence is to be updated
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team, mom, confidence]);

    const isTeamSelected = (currentTeam: string) => {
        return currentTeam === team;
    }

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
    }
    const _onCacheChange = (e: object, newValue: number | number[]) => {
        const currUtilization = find(confidenceScores, { score: newValue as number })?.remaining || 0;
        if (currUtilization > 0) {
            setCache(newValue as number);
        }
    };
    const _switchTeamHandler = (name: string) => (e: SyntheticEvent) => switchTeam(name);
    const _momHandler = (e: object, value: IPlayerOption | null) => setMom(value?.player || "");
    const _confidenceHandler = (e: object, newValue: number | number[]) => setConfidence(cache);

    const _timeRemainingRenderer = ({ days, hours, minutes, completed }: CountdownRenderProps) => {
        if (matchCompleted || completed) return `Winner: ${winner} Man of the match: ${matchMom}`;
        return `${days} days, ${hours} hours, ${minutes} minutes`;
    }

    const startDate = new Date(start);
    const formattedMom = { team, player: mom };

    return (
        <Card className={classes.rootPaper} variant="outlined">
            <CardHeader
                title={
                    <Box
                        fontWeight="fontWeightBold"
                        fontSize="h4.fontSize"
                    >
                        {`Match #${index + 1}`}
                    </Box>
                }
                subheader={
                    <>
                        <div>{`${startDate.toDateString()}`}</div>
                        <Countdown date={startDate} renderer={_timeRemainingRenderer} />
                    </>
                }
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item container spacing={2} justify="center" alignItems="center">
                        <Grid item xs={6} md>
                            <Card
                                className={clsx(classes.card, isTeamSelected(left) && classes.cardSelected)}
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
                                className={clsx(classes.card, isTeamSelected(right) && classes.cardSelected)}
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
                                value={formattedMom}
                                tournament={tournament}
                                leftTeam={left}
                                rightTeam={right}
                                disabled={!team}
                                changeHandler={_momHandler}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="flex-start">
                        <ConfidenceSlider
                            value={cache}
                            disabled={!team}
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