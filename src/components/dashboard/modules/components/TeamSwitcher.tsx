import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { ISurvivorPrediction } from '../../../../api/LeagueAPI';

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
        background: '#2196f3',
        color: 'white'
    }
});

interface ITeamSwitcherProps {
    leftTeam: {
        name: string;
        description: string;
        owner: string;
    };
    rightTeam: {
        name: string;
        description: string;
        owner: string;
    };
    prediction: ISurvivorPrediction;
    index: number;
    teamSwitchHandler: (index: number, prediction: ISurvivorPrediction) => void;
}

export default function TeamSwitcher(props: ITeamSwitcherProps) {
    const classes = useStyles();
    const { leftTeam, rightTeam } = props;

    const switchTeam = (team: string) => {
        if (isTeamSelected(team)) {
            props.teamSwitchHandler(props.index, { team: "", mom: props.prediction.mom});
        } else {
            props.teamSwitchHandler(props.index, { team, mom: props.prediction.mom});
        }
    }

    const isTeamSelected = (team: string) => {
        return team === props.prediction.team;
    }

    return (
        <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item xs={6}>
                <CardActionArea component="a">
                    <Card className={clsx(classes.card, isTeamSelected(leftTeam.name) && classes.cardSelected)} onClick={() => switchTeam(leftTeam.name)} raised={isTeamSelected(leftTeam.name)}>
                        <div className={classes.cardDetails}>
                            <CardContent>
                                <Typography component="h2" variant="h5">
                                    {leftTeam.name}
                                </Typography>
                                <Typography variant="subtitle1" paragraph>
                                    {leftTeam.description}
                                </Typography>
                            </CardContent>
                        </div>
                        {/* <Hidden xsDown> add team logos here
                                <CardMedia className={classes.cardMedia} image={post.image} title={post.imgText} />
                            </Hidden> */}
                    </Card>
                </CardActionArea>
            </Grid>
            <Grid item xs={6}>
                <CardActionArea component="a">
                    <Card className={clsx(classes.card, isTeamSelected(rightTeam.name) && classes.cardSelected)} onClick={() => switchTeam(rightTeam.name)} raised={isTeamSelected(rightTeam.name)}>
                        <div className={classes.cardDetails}>
                            <CardContent>
                                <Typography component="h2" variant="h5">
                                    {rightTeam.name}
                                </Typography>
                                <Typography variant="subtitle1" paragraph>
                                    {rightTeam.description}
                                </Typography>
                            </CardContent>
                        </div>
                        {/* <Hidden xsDown> add team logos here
                                <CardMedia className={classes.cardMedia} image={post.image} title={post.imgText} />
                            </Hidden> */}
                    </Card>
                </CardActionArea>
            </Grid>
        </Grid>
    );
}