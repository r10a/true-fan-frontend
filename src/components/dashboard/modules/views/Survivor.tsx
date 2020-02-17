import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Intro from '../components/Intro';
import { URL } from '../../../../Routes';
import { isEmpty, map, zipWith, set } from 'lodash-es';
import { ISurvivorPrediction } from '../../../../api/LeagueAPI';
import { LEAGUE_ACTIONS } from '../../../../reducers/LeagueReducer';
import { useDispatch, useSelector } from 'react-redux';
import TeamSwitcher from '../components/TeamSwitcher';
import { reducers } from '../../../../reducers';
import { Paper } from '@material-ui/core';
import Title from '../components/Title';


const useStyles = makeStyles(theme => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    leaguesSection: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    }
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
    const [userSchedule, setUserSchdeule] = useState([] as any[]);

    const tournament = props.match.params.game;
    const leagueName = props.match.params.league;


    // constructor and destructor
    useEffect(() => {
        const init = async () => {
            dispatch({ type: LEAGUE_ACTIONS.GET_IPL_SCHEDULE });
            dispatch({ type: LEAGUE_ACTIONS.GET_SURVIVOR_PREDICTION, tournament, leagueName });
        }
        init();
        return function cleanup() {
            dispatch({ type: LEAGUE_ACTIONS.RESET });
        }
    }, [dispatch, leagueName, tournament]);

    // schedule watcher
    useEffect(() => {
        const updateSchedule = async () => {
            const response = await store.iplSchedule;

            const userSchedule = zipWith(response.result, predictions, (match: string[], prediction: ISurvivorPrediction) => {
                return {
                    startTime: match[0],
                    left: match[1],
                    right: match[2],
                    prediction: prediction || { team: "", mom: "" },
                };
            });
            setUserSchdeule(userSchedule);
        }
        updateSchedule();
    }, [store.iplSchedule, predictions]);

    // prediction watcher
    useEffect(() => {
        const updatePredictions = async () => {
            const response = await store.survivorPrediction;
            if (response) setPredictions(response.result.Item.predictions);
        }
        updatePredictions();
    }, [store.survivorPrediction]);

    const links = {
        header: {
            title: props.match.params.game,
            description: props.match.params.league,
            image: 'https://source.unsplash.com/random',
            imgText: 'main image description',
            linkText: '',
        }
    };

    const teamSwitchHandler = (index: number, prediction: ISurvivorPrediction) => {
        const predictions = map(userSchedule, "prediction");
        set(predictions, index, prediction);
        const payload = {
            tournament,
            leagueName,
            predictions
        };
        dispatch({ type: LEAGUE_ACTIONS.SET_SURVIVOR_PREDICTION, payload });
    }

    return (
        <React.Fragment>
            <Container maxWidth="lg" className={classes.mainGrid} >
                <main>
                    <Intro post={links.header} />
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
                                                        teamSwitchHandler={teamSwitchHandler}
                                                    />
                                                </Grid>
                                            )) : <Grid item xs={12}>You don't own any Leagues</Grid>
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </main>
            </Container>
        </React.Fragment>
    );
}
