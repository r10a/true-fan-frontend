import React from 'react';
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
        if (team === props.prediction.team) {
            props.teamSwitchHandler(props.index, { team: "", mom: props.prediction.mom});
        } else if (team !== props.prediction.team) {
            props.teamSwitchHandler(props.index, { team, mom: props.prediction.mom});
        }
    }

    return (
        <Grid container spacing={4} justify="center" alignItems="center">
            <Grid item xs={6}>
                <CardActionArea component="a">
                    <Card className={classes.card} onClick={() => switchTeam(leftTeam.name)} raised={leftTeam.name === props.prediction.team}>
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
                    <Card className={classes.card} onClick={() => switchTeam(rightTeam.name)} raised={rightTeam.name === props.prediction.team}>
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