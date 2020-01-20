import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { URL } from '../../Routes';

interface IDashboardProps {
    isAuthenticated: boolean;
    userHasAuthenticated: (isAuthenticated: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    history: any;
}

export enum GAME_TYPE {
    SURVIVOR = "SURVIVOR",
    CONFIDENCE = "CONFIDENCE"
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));


export default function Dashboard(props: IDashboardProps) {
    if (!props.isAuthenticated) props.history.push(URL.HOME);
    const classes = useStyles();

    return (
        <div className={classes.root}>
        </div>
    );

}
