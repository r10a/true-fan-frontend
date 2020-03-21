import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Intro from '../components/Intro';
import { URL } from '../../../../Routes';
import { isEmpty, map, zipWith, set, ceil, groupBy, omit, get, min, filter, cloneDeep, times } from 'lodash-es';
import LeagueAPI, { IPrediction, IMatch } from '../../../../api/LeagueAPI';
import { LEAGUE_ACTIONS } from '../../../../reducers/LeagueReducer';
import { useDispatch, useSelector } from 'react-redux';
import TeamSwitcher from '../components/TeamSwitcher';
import { reducers } from '../../../../reducers';
import { Paper, Fab } from '@material-ui/core';
import Title from '../components/Title';
import SaveIcon from '@material-ui/icons/Save';
import SurvivorStatusBar from '../components/SurvivorStatusBar';
import { differenceInMilliseconds, subHours } from 'date-fns';

const useStyles = makeStyles(theme => ({
    mainGrid: {
        marginTop: theme.spacing(3),
        paddingBottom: theme.spacing(10),
        [theme.breakpoints.down('sm')]: {
            paddingBottom: theme.spacing(13),
        },
        [theme.breakpoints.up('md')]: {
            paddingBottom: 0,
        },
    },
    leaguesSection: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    statusBar: {
        [theme.breakpoints.down('sm')]: {
            top: theme.spacing(8),
        },
        [theme.breakpoints.up('md')]: {
            top: theme.spacing(8.7),
        },
        backgroundColor: theme.palette.secondary.main,
    },
    statusBarBadge: {
        // padding: theme.spacing(1),
    },
    saveFab: {
        margin: 0,
        top: 'auto',
        right: theme.spacing(35),
        bottom: theme.spacing(5),
        [theme.breakpoints.down('xl')]: {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            right: theme.spacing(2),
            bottom: theme.spacing(2),
        },
        left: 'auto',
        position: 'fixed',
    },
    saveButton: {
        paddingLeft: theme.spacing(5) + 'px !important',
        [theme.breakpoints.up('lg')]: {
            display: 'block'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
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
    match: IMatch
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

    const tournament = props.match.params.game;
    const leagueName = props.match.params.league;


    // constructor and destructor
    useEffect(() => {
        const init = () => {
            dispatch({ type: LEAGUE_ACTIONS.GET_SCHEDULE, tournament });
            dispatch({ type: LEAGUE_ACTIONS.GET_SURVIVOR_PREDICTION, tournament, leagueName });
        }
        init();
        return function cleanup() {
            dispatch({ type: LEAGUE_ACTIONS.RESET });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leagueName, tournament]);

    // schedule store watcher
    useEffect(() => {
        const updateSchedule = async () => {
            const response = await store.schedule;
            response.result && setSchedule(response.result.Item.schedule);
        }
        updateSchedule();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.schedule]);

    // prediction watcher
    useEffect(() => {
        const updatePredictions = async () => {
            const response = await store.survivorPrediction;
            const predictions = get(response, "result.Item.predictions", times(schedule.length, () => ({ team: "", mom: "", confidence: 0 })));

            const maxUses = ceil(schedule.length / 5);
            const currentUses = omit(groupBy(predictions, (p) => p.confidence), [0]);
            const currConfidenceScores = map(confidenceScores, (currScore) => {
                return { score: currScore.score, remaining: maxUses - get(currentUses, currScore.score, []).length };
            });

            const currUserMatches = zipWith(schedule, predictions, (match: IMatch, prediction: IPrediction) => {
                // auto assign for skipped matches
                if (isEmpty(prediction.team) && (match.completed || differenceInMilliseconds(subHours(new Date(match.start), 1), new Date()) < 0)) {
                    const minimumScoreAssignable = min(
                        map(
                            filter(currConfidenceScores, ({ score, remaining }) => remaining !== 0),
                            "score")
                    ) || 0;
                    currConfidenceScores[(minimumScoreAssignable / 20) - 1].remaining -= 1;
                    set(prediction, "confidence", minimumScoreAssignable);
                }
                return { match, prediction }
            });
            updateUserMatches(currUserMatches);
        }

        if (!isEmpty(schedule)) {
            updatePredictions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedule, store.survivorPrediction]);

    const updateUserMatches = (userSchedule: IUserMatch[]) => {
        const maxUses = ceil(userSchedule.length / 5);
        const currentUses = omit(groupBy(userSchedule, (s) => s.prediction.confidence), [0]);
        const currConfidenceScores = map(confidenceScores, (currScore) => {
            return { score: currScore.score, remaining: maxUses - get(currentUses, currScore.score, []).length };
        });
        setUserMatches(userSchedule);
        setConfidenceScores(currConfidenceScores);
    };

    const updatePredictionHandler = (index: number, prediction: IPrediction) => {
        const currUserSchedule = cloneDeep(userMatches);
        set(currUserSchedule, [index, "prediction"], prediction);
        updateUserMatches(currUserSchedule);
    }

    const _savePredictions = () => {
        const payload = { tournament, leagueName, predictions: map(userMatches, "prediction") };
        LeagueAPI.setSurvivorPrediction(payload).then(() => {
            enqueueSnackbar("Changed Saved", {
                variant: 'success'
            })
        }).catch(() => {
            enqueueSnackbar("Oops! Something went wrong", {
                variant: 'error'
            })
        });
    }

    const minimumScoreAssignable = min(
        map(
            filter(confidenceScores, ({ score, remaining }) => remaining !== 0),
            "score")
    ) || 0;

    const getTeamSwitchers = () => {
        return (
            !isEmpty(userMatches) ?
                map(userMatches, (userMatch, index) => (
                    <Grid item xs={12} key={`${userMatch.match.left}vs${userMatch.match.right}@${userMatch.match.start}`}>
                        <TeamSwitcher
                            userMatch={userMatch}
                            tournament={tournament}
                            index={index}
                            confidenceScores={confidenceScores}
                            minimumScoreAssignable={minimumScoreAssignable}
                            updatePredictionHandler={updatePredictionHandler}
                            save={_savePredictions}
                        />
                    </Grid>
                )) : <Grid item xs={12}>Loading</Grid>
        );
    }

    return (
        <React.Fragment>
            <Container maxWidth="lg" className={classes.mainGrid} >
                <main>
                    <Intro
                        title={props.match.params.game}
                        description={props.match.params.league}
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
            </Container>
        </React.Fragment>
    );
}
