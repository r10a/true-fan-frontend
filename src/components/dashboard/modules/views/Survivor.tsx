import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Intro from '../components/Intro';
import { URL } from '../../../../Routes';
import { isEmpty, map, zipWith, set, ceil, groupBy, omit, get } from 'lodash-es';
import { ISurvivorPrediction, IGameSchedule } from '../../../../api/LeagueAPI';
import { LEAGUE_ACTIONS } from '../../../../reducers/LeagueReducer';
import { useDispatch, useSelector } from 'react-redux';
import TeamSwitcher from '../components/TeamSwitcher';
import { reducers } from '../../../../reducers';
import { Paper, Fab } from '@material-ui/core';
import Title from '../components/Title';
import SaveIcon from '@material-ui/icons/Save';
import SurvivorStatusBar from '../components/SurvivorStatusBar';


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

export default function IPL(props: ISurvivorProps) {
    if (!props.isAuthenticated) props.history.push(URL.HOME);
    const classes = useStyles();
    const dispatch = useDispatch();
    const store: any = useSelector((state: reducers) => state.LeagueReducer);
    const [predictions, setPredictions] = useState([] as ISurvivorPrediction[]);
    const [schedule, setSchedule] = useState([] as IGameSchedule[]);
    const [userSchedule, setUserSchdeule] = useState([] as any[]);
    const [confScoreMap, setConfScoreMap] = useState([
        { score: 20, remaining: 0 },
        { score: 40, remaining: 0 },
        { score: 60, remaining: 0 },
        { score: 80, remaining: 0 },
        { score: 100, remaining: 0 },
    ]);

    const tournament = props.match.params.game;
    const leagueName = props.match.params.league;


    // constructor and destructor
    useEffect(() => {
        const init = async () => {
            dispatch({ type: LEAGUE_ACTIONS.GET_IPL_SCHEDULE, tournament });
            dispatch({ type: LEAGUE_ACTIONS.GET_SURVIVOR_PREDICTION, tournament, leagueName });
        }
        init();
        return function cleanup() {
            dispatch({ type: LEAGUE_ACTIONS.RESET });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leagueName, tournament]);

    // schedule watcher
    useEffect(() => {
        const updateSchedule = async () => {
            const response = await store.schedule;
            response.result && setSchedule(response.result.Item);
        }
        updateSchedule();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.schedule]);

    // prediction watcher
    useEffect(() => {
        const updatePredictions = async () => {
            const response = await store.survivorPrediction;
            if (!isEmpty(response)) {
                setPredictions(response.result.Item.predictions);
            } else {
                setPredictions([]);
            }
        }
        updatePredictions();
    }, [store.survivorPrediction]);

    useEffect(() => {
        const updateUserSchedule = () => {
            const currUserSchedule = zipWith(schedule, predictions, (match: IGameSchedule, prediction: ISurvivorPrediction) => {
                return {
                    startTime: match[0],
                    left: match[1],
                    right: match[2],
                    prediction: prediction || { team: "", mom: "", confidence: 0 },
                };
            });

            setUserSchdeule(currUserSchedule);
        }

        if(!isEmpty(schedule)) {
            updateUserSchedule();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [predictions, schedule]);

    useEffect(() => {
        const maxUses = ceil(userSchedule.length / 5);
        const currentUses = omit(groupBy(userSchedule, (schedule) => schedule.prediction.confidence), [0]);
        const currentConfScores = map(confScoreMap, (currScore) => {
            return { score: currScore.score, remaining: maxUses - get(currentUses, currScore.score, []).length };
        });
        setConfScoreMap(currentConfScores);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSchedule]);

    const links = {
        header: {
            title: props.match.params.game,
            description: props.match.params.league,
            image: 'https://source.unsplash.com/random',
            imgText: 'main image description',
            linkText: '',
        }
    };

    const updatePredictionHandler = async (index: number, prediction: ISurvivorPrediction) => {
        const predictions = map(userSchedule, "prediction");
        set(predictions, index, prediction);
        setPredictions(predictions);
    }

    const savePredictions = () => {
        const payload = { tournament, leagueName, predictions };
        dispatch({ type: LEAGUE_ACTIONS.SET_SURVIVOR_PREDICTION, payload });
    }

    return (
        <React.Fragment>
            <Container maxWidth="lg" className={classes.mainGrid} >
                <main>
                    <Intro post={links.header} />
                    <SurvivorStatusBar
                        classes={classes}
                        confScoreMap={confScoreMap}
                        save={savePredictions}
                    />
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Paper elevation={3} className={classes.leaguesSection}>
                                <Title title="Predictions" />
                                <Grid container spacing={4}>
                                    {
                                        !isEmpty(userSchedule) ?
                                            map(userSchedule, (match, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <TeamSwitcher
                                                        leftTeam={{
                                                            name: match.left,
                                                            description: "",
                                                            owner: ""
                                                        }}
                                                        rightTeam={{
                                                            name: match.right,
                                                            description: "",
                                                            owner: ""
                                                        }}
                                                        prediction={match.prediction}
                                                        index={index}
                                                        updatePredictionHandler={updatePredictionHandler}
                                                        confScoreMap={confScoreMap}
                                                    />
                                                </Grid>
                                            )) : <Grid item xs={12}>You don't own any Leagues</Grid>
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} className={classes.saveFab}>
                            <Fab
                                color="primary"
                                aria-label="save"
                                variant="extended"
                                onClick={savePredictions}
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
