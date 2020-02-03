import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

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
});

interface ICardListItemProps {
    post: {
        title: string;
        description: string;
        owner: string;
    };
    onClick?: () => void;
}

export default function CardListItem(props: ICardListItemProps) {
    const classes = useStyles();
    const { post } = props;

    return (
        <Grid item xs={12}>
            <CardActionArea component="a">
                <Card className={classes.card}>
                    <div className={classes.cardDetails}>
                        <CardContent>
                            <Grid container spacing={4} justify="center" alignItems="center">
                                <Grid item xs={8} md={10}>
                                    <Typography component="h2" variant="h5">
                                        {post.title}
                                    </Typography>
                                    <Typography variant="subtitle1" paragraph>
                                        {post.description}
                                    </Typography>
                                    <Typography variant="subtitle2" paragraph>
                                        {post.owner}
                                    </Typography>
                                </Grid>
                                {
                                    !!props.onClick ?
                                        <Grid item xs={4} md={2}>
                                            <IconButton aria-label="settings" onClick={props.onClick}>
                                                <SettingsIcon />
                                            </IconButton>
                                        </Grid> : ""
                                }
                            </Grid>
                        </CardContent>
                    </div>
                </Card>
            </CardActionArea>
        </Grid>
    );
}