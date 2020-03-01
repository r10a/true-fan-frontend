import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    title: {
        paddingBottom: theme.spacing(2),
        alignSelf: 'flex-start'
    }
}));

function Title(props: { title: string }) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom className={classes.title}>
                {props.title}
            </Typography>
        </React.Fragment>
    )
}

export default React.memo(Title);