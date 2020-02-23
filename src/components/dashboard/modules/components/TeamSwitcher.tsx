import React, { useState, useEffect, SyntheticEvent } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CardContent from '@material-ui/core/CardContent';
import { ISurvivorPrediction } from '../../../../api/LeagueAPI';
import theme from '../../../../theme';
import { ConfidenceSlider } from './ConfidenceSlider';
import { TextField, Paper } from '@material-ui/core';
import { ISurvivorStatusProps } from './SurvivorStatusBar';
import { min, map, filter, find } from 'lodash-es';

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
        backgroundColor: theme.palette.primary.light,
        color: 'white'
    },
    slider: {

    },
    rootPaper: {
        padding: theme.spacing(2)
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
    confScoreMap: ISurvivorStatusProps["confScoreMap"];
    updatePredictionHandler: (index: number, prediction: ISurvivorPrediction) => Promise<void>;
}

export default function TeamSwitcher(props: ITeamSwitcherProps) {
    const classes = useStyles();
    const { leftTeam, rightTeam, index, updatePredictionHandler, confScoreMap, prediction } = props;
    const [team, setTeam] = useState(props.prediction.team);
    const [mom, setMom] = useState(props.prediction.mom);
    const [confidence, setConfidence] = useState(props.prediction.confidence);
    const [confidenceCache, setConfidenceCache] = useState(props.prediction.confidence);

    useEffect(() => {
        setTeam(prediction.team);
        setMom(prediction.mom);
        setConfidence(prediction.confidence);
        setConfidenceCache(prediction.confidence);
    }, [prediction]);

    useEffect(() => {
        updatePredictionHandler(index, { team, mom, confidence });
        // only update prediction if team, mom, or confidence is to be updated
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team, mom, confidence]);

    const isTeamSelected = (currentTeam: string) => {
        return currentTeam === team;
    }

    const minimumScoreAssignable = min(
        map(
            filter(confScoreMap, ({ score, remaining }) => remaining !== 0),
            "score")
    ) || 20;
    const switchTeam = (newTeam: string) => {
        if (team && isTeamSelected(newTeam)) {
            setTeam("");
            setMom("");
            setConfidence(0);
            setConfidenceCache(0);
        } else {
            setTeam(newTeam);
            if (confidenceCache === 0) {
                setConfidence(minimumScoreAssignable);
                setConfidenceCache(minimumScoreAssignable);
            }
        }
    }
    const _switchTeamHandler = (name: string) => (e: SyntheticEvent) => switchTeam(name);
    const _momHandler = (e: object, value: string | null) => setMom(value || "");
    const _confidenceCacheHandler = (e: object, newValue: number | number[]) => {
        const currUtilization = find(confScoreMap, { score: newValue as number })?.remaining || 0;
        if (currUtilization > 0) {
            setConfidenceCache(newValue as number);
        }
    };
    const _confidenceHandler = (e: object, newValue: number | number[]) => {
        setConfidence(confidenceCache);
    };

    return (
        <Paper className={classes.rootPaper} variant="outlined">
            <Grid container spacing={2}>
                <Grid item container spacing={2} justify="center" alignItems="center">
                    <Grid item xs={6} md>
                        <Card
                            className={clsx(classes.card, isTeamSelected(leftTeam.name) && classes.cardSelected)}
                            onClick={_switchTeamHandler(leftTeam.name)}
                            raised={isTeamSelected(leftTeam.name)}
                        >
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
                    </Grid>
                    <Grid item xs={6} md>
                        <Card
                            className={clsx(classes.card, isTeamSelected(rightTeam.name) && classes.cardSelected)}
                            onClick={_switchTeamHandler(rightTeam.name)}
                            raised={isTeamSelected(rightTeam.name)}
                        >
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
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            // TODO remove hardcode
                            options={[
                                "Virat Kohli",
                                "AB de Villiers",
                                "Devdutt Padikkal",
                                "Gurkeerat Singh",
                                "Aaron Finch",
                                "Shahbaz Ahamad",
                                "Joshua Philippe",
                                "Pathiv Patel",
                                "Pawan Negi",
                                "Shivam Dube",
                                "Moeen Ali",
                                "Isuru Udana",
                                "Pavan Deshpande",
                                "Christopher Morris",
                                "Kane Richardson",
                                "Dale Steyn",
                                "Mohammaed Siraj",
                                "Navdeep Saini",
                                "Umesh Yadav",
                                "Washington Sundar",
                                "Yuzvendra Chahal"
                            ]}
                            value={mom}
                            disabled={!team}
                            onChange={_momHandler}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Man of the Match"
                                    variant="outlined"
                                    placeholder="Man of the Match"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="flex-start">
                    <Grid item xs={12} md={8}>
                        <ConfidenceSlider
                            value={confidenceCache}
                            disabled={!team}
                            onChange={_confidenceCacheHandler}
                            onChangeCommitted={_confidenceHandler}
                            className={classes.slider}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={20}
                            marks={true}
                            min={0}
                            max={100}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box
                            fontWeight="fontWeightBold"
                            fontSize="h6.fontSize"
                        >
                            {`Confidence ${confidenceCache}`} %
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}