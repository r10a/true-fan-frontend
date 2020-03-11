import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { URL } from '../../Routes';
import ScoreBoard from './modules/components/ScoreBoard';
import { map } from 'lodash-es';
import { Container, Grid, Paper } from '@material-ui/core';
import Title from './modules/components/Title';
import DashboardAPI, { ITournament } from '../../api/DashboardAPI';

interface IDashboardProps {
    isAuthenticated: boolean;
    userHasAuthenticated: (isAuthenticated: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    admin: boolean;
    history: any;
}

const useStyles = makeStyles(theme => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    tournamentScores: {
        padding: theme.spacing(2),
    }
}));

const CURRENT_TOURNAMENTS = ['IPL-2020'];

export default function Dashboard(props: IDashboardProps) {
    if (!props.isAuthenticated) props.history.push(URL.HOME);
    if (props.admin) props.history.push(URL.DASHBOARD.SCHEDULE_EDITOR.replace(":game", "IPL-2020"));
    const classes = useStyles();

    const [scores, setTournamentScores] = useState({} as ITournament[]);

    // constructor and destructor
    useEffect(() => {
        function getScores() {
            const scorePromises = map(CURRENT_TOURNAMENTS, (tournament) => DashboardAPI.getScores(tournament));

            Promise.all(scorePromises).then((results) => {
                const tournamentScores = map(results, "result.Item");
                setTournamentScores(tournamentScores);
            });
        }
        getScores();
        return function cleanup() {
            // dispatch({ type: LEAGUE_ACTIONS.RESET });
        }
    }, []);

    return (
        <Container maxWidth="lg" className={classes.mainGrid} >
            {
                map(scores, (tScore) => (
                    <Paper key={tScore.tournament} elevation={3} className={classes.tournamentScores}>
                        <Title title={tScore.tournament} />
                        <Grid container spacing={3} justify="center">
                            {
                                map(tScore.leagues, (leagueScore) => (
                                    <ScoreBoard
                                        key={leagueScore.leagueName}
                                        score={leagueScore}
                                    />
                                ))
                            }
                        </Grid>
                    </Paper>
                ))
            }
        </Container>
    );

}
