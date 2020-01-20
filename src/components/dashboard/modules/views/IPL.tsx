import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Intro from '../components/Intro';
import JumboButton from '../components/JumboButton';
import { URL } from '../../../../Routes';
import CreateLeagueDialog from '../components/CreateLeagueDialog';
import { cloneDeep, isEmpty, reduce } from 'lodash-es';
import { check } from '../../../landing/modules/form/validation';
import LeagueAPI, { ICreateLeaguePayload } from '../../../../api/LeagueAPI';
import { LEAGUE_ACTIONS } from '../../../../reducers/LeagueReducer';
import { useDispatch } from 'react-redux';
import { GAME_TYPE } from '../../Dashboard';


const useStyles = makeStyles(theme => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
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
    // const store: any = useSelector((state: reducers) => state.LeagueReducer);

    useEffect(() => {
        return function cleanup() {
            dispatch({ type: LEAGUE_ACTIONS.RESET });
        }
    }, [dispatch]);

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
            title: 'Join the Public League',
            description:
                "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
            image: 'https://source.unsplash.com/random',
            imgText: 'main image description',
            linkText: 'Start',
        }
    };

    const fields = [
        { id: "lname", label: "League Name" },
        { id: "description", label: "Description" },
        { id: "type", label: "Type" },
    ];

    const [isCreateOpen, openCreate] = useState(false);

    const [formFields, setFormField] = useState({
        lname: "", description: "", type: GAME_TYPE.SURVIVOR
    });

    const [helperTexts, setHelperText] = useState({
        lname: "", description: "", type: ""
    });

    const validate = () => {
        const errors = cloneDeep(helperTexts);
        check(isEmpty(formFields.lname), "lname", "Required", errors);

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
            };
            LeagueAPI.create(payload)
                .then(() => openCreate(false))
                .catch((err) => {
                    const errors = cloneDeep(helperTexts);
                    if (err.response.data.error.message === "Already Exists") {
                        check(true, "lname", "League already exists! Please choose a different name.", errors);
                    } else {
                        check(true, "lname", "Something went wrong! Please try again.", errors);
                    }
                    setHelperText(errors);
                    console.log(err.response.data.error.message);
                });
        }
    }

    return (
        <React.Fragment>
            <Container maxWidth="lg" className={classes.mainGrid} >
                <main>
                    <Intro post={links.header} />
                    <Grid container spacing={4}>
                        <JumboButton post={links.create} onClick={() => openCreate(true)} />
                        <JumboButton post={links.join} onClick={() => console.log("Join public")} />
                    </Grid>
                    <CreateLeagueDialog<{ "lname": string; "description": string; "type": GAME_TYPE; }>
                        open={isCreateOpen}
                        fields={fields}
                        formFields={formFields}
                        setFormField={setFormField}
                        helperTexts={helperTexts}
                        handleClose={() => openCreate(false)}
                        handleSubmit={createLeague}
                        type="IPL"
                    />
                </main>
            </Container>
        </React.Fragment>
    );
}
