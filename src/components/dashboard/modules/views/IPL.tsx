import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Intro from '../components/Intro';
import JumboButton from '../components/JumboButton';
import { URL } from '../../../../Routes';
import CreateLeagueDialog from '../components/CreateLeagueDialog';
import { cloneDeep, isEmpty, reduce, map, sortBy, reverse, get, } from 'lodash-es';
import { check } from '../../../landing/modules/form/validation';
import LeagueAPI, { ICreateLeaguePayload } from '../../../../api/LeagueAPI';
import { LEAGUE_ACTIONS } from '../../../../reducers/LeagueReducer';
import { useDispatch, useSelector } from 'react-redux';
import { GAME_TYPE } from '../../Dashboard';
import CardListItem from '../components/CardListItem';
import { reducers } from '../../../../reducers';
import { Paper } from '@material-ui/core';
import Title from '../components/Title';
import ManageLeagueDialog from '../components/ManageLeagueDialog';


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

interface IDashboardProps {
    isAuthenticated: boolean;
    userHasAuthenticated: (isAuthenticated: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    history: any;
}

export default function IPL(props: IDashboardProps) {
    if (!props.isAuthenticated) props.history.push(URL.HOME);
    const classes = useStyles();
    const dispatch = useDispatch();
    const store: any = useSelector((state: reducers) => state.LeagueReducer);
    const [adminLeagues, setAdminLeagues] = useState([] as ICreateLeaguePayload[]);
    const [userLeagues, setUserLeagues] = useState([] as ICreateLeaguePayload[]);
    const [selectedLeague, setSelectedLeague] = useState({} as ICreateLeaguePayload);
    const [isCreateOpen, openCreate] = useState(false);
    const [isManageOpen, openManage] = useState(false);

    const [formFields, setFormField] = useState({
        leagueName: "", description: "", leagueType: GAME_TYPE.SURVIVOR
    });

    const [helperTexts, setHelperText] = useState({
        leagueName: "", description: "", leagueType: ""
    });



    // constructor and destructor
    useEffect(() => {
        const getUserLeagues = async () => {
            dispatch({ type: LEAGUE_ACTIONS.GET_USER_LEAGUES });
        }
        getUserLeagues();
        return function cleanup() {
            dispatch({ type: LEAGUE_ACTIONS.RESET });
        }
    }, [dispatch]);

    // store watcher
    useEffect(() => {
        const updateUserLeagues = async () => {
            const leagues = await store.user_leagues;
            const sortedAdminLeagues = reverse(sortBy(get(leagues, "result.Items[0].adminLeagues"), l => l.created || ""))
            const sortedUserLeagues = reverse(sortBy(get(leagues, "result.Items[0].userLeagues"), l => l.created || ""))
            setAdminLeagues(sortedAdminLeagues);
            setUserLeagues(sortedUserLeagues);
        }
        updateUserLeagues();
    }, [store]);

    const links = {
        header: {
            title: 'IPL',
            description:
                "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
            image: 'https://source.unsplash.com/random',
            imgText: 'main image description',
            linkText: '',
        },
        create: {
            title: 'Create a Private League',
            description:
                "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
            image: 'https://source.unsplash.com/random',
            imgText: 'main image description',
            linkText: 'Continue reading…',
        },
        join: {
            title: 'Public Leagues coming soon',
            description:
                "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
            image: 'https://source.unsplash.com/random',
            imgText: 'main image description',
            linkText: 'Start',
        }
    };

    const fields = [
        { id: "leagueName", label: "League Name" },
        { id: "description", label: "Description" },
        // { id: "leagueType", label: "Type" },
    ];

    const validate = () => {
        const errors = cloneDeep(helperTexts);
        check(isEmpty(formFields.leagueName), "leagueName", "Required", errors);
        check(!(/^[A-Za-z0-9-]*$/.test(formFields.leagueName.trim())) || formFields.leagueName.trim().length > 20
        , "leagueName", "Only less than 20 characters, numbers, and dashes allowed", errors);

        setHelperText(errors);
        return reduce(errors, (acc, value) => {
            return acc && isEmpty(value);
        }, true);
    }

    const createLeague = async () => {
        if (validate()) {
            const payload: ICreateLeaguePayload = {
                ...formFields,
                tournament: "IPL",
                userId: "" // will be set later in LeagueAPI
            };
            LeagueAPI.create(payload)
                .then(() => {
                    openCreate(false);
                    dispatch({ type: LEAGUE_ACTIONS.GET_USER_LEAGUES });
                })
                .catch((err) => {
                    const errors = cloneDeep(helperTexts);
                    if (err.response.data.error.message === "Already Exists") {
                        check(true, "leagueName", "League already exists! Please choose a different name.", errors);
                    } else {
                        check(true, "leagueName", "Something went wrong! Please try again.", errors);
                    }
                    setHelperText(errors);
                    console.log(err.response.data.error.message);
                });
        }
    }

    const navigateToLeague = (leagueName: string) => {
        const url = URL.DASHBOARD.SURVIVOR
            .replace(":game", "IPL-2020")
            .replace(":league", leagueName);
        props.history.push(url)
    };

    return (
        <React.Fragment>
            <Container maxWidth="lg" className={classes.mainGrid} >
                <main>
                    <Intro post={links.header} />
                    <Grid container spacing={4}>
                        <JumboButton post={links.create} onClick={() => openCreate(true)} />
                        <JumboButton post={links.join} onClick={() => console.log("Join public")} />
                    </Grid>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Paper elevation={3} className={classes.leaguesSection}>
                                <Title title="Leagues you own" />
                                <Grid container spacing={2}>
                                    {
                                        !isEmpty(adminLeagues) ?
                                            map(adminLeagues, (league) => (
                                                <Grid item xs={12} key={league.leagueName}>
                                                    <CardListItem
                                                        post={{
                                                            title: league.leagueName,
                                                            description: league.description,
                                                            owner: league.userId
                                                        }}
                                                        onClick={() => navigateToLeague(league.leagueName)}
                                                        onOptionsClick={() => {
                                                            setSelectedLeague(league);
                                                            dispatch({ type: LEAGUE_ACTIONS.GET_LEAGUE_MEMBERS, leagueName: league.leagueName });
                                                            openManage(true);
                                                        }}
                                                    />
                                                </Grid>
                                            )) : <Grid item xs={12}>You don't own any Leagues</Grid>
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={3} className={classes.leaguesSection}>
                                <Title title="Leagues you are member of" />
                                <Grid container spacing={2}>
                                    {
                                        !isEmpty(userLeagues) ?
                                            map(userLeagues, (league) => (
                                                <Grid item xs={12} key={league.leagueName}>
                                                    <CardListItem
                                                        post={{
                                                            title: league.leagueName,
                                                            description: league.description,
                                                            owner: league.userId
                                                        }}
                                                        onClick={() => navigateToLeague(league.leagueName)}
                                                    />
                                                </Grid>
                                            )) : <Grid item xs={12}>You are not a part of any Leagues</Grid>
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <CreateLeagueDialog<{ "leagueName": string; "description": string; "leagueType": GAME_TYPE; }>
                        open={isCreateOpen}
                        fields={fields}
                        formFields={formFields}
                        setFormField={setFormField}
                        helperTexts={helperTexts}
                        handleClose={() => openCreate(false)}
                        handleSubmit={createLeague}
                        type="IPL"
                    />
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
