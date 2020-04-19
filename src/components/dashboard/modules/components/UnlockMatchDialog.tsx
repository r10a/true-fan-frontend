import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { useMediaQuery, useTheme, Grid, makeStyles } from '@material-ui/core';
import { IUserMatch, IConfidenceScore, IEditPredictionPayload, IPowerPlayPoints, getValidFreeHits } from '../views/Survivor';
import TeamSwitcher, { MatchStatus } from './TeamSwitcher';
import { IPrediction } from '../../../../api/LeagueAPI';
import { isEmpty, includes } from 'lodash-es';
import Countdown, { CountdownRenderProps } from 'react-countdown-now';

const useStyles = makeStyles(theme => ({
    teamSwitcher: {
        textAlign: "center"
    },
    boldText: {
        "fontWeight": "bold"
    }
}));

interface IUnlockMatchDialog {
    editPrediction: IEditPredictionPayload;
    userMatches: IUserMatch[];
    tournament: string;
    powerPlayPoints: IPowerPlayPoints;
    minimumScoreAssignable: number;
    confidenceScores: IConfidenceScore[];
    updatePredictionHandler: (index: number, prediction: IPrediction) => void;
    handleCancel: () => void;
    handleSubmit: (index: number, prediction: IPrediction, powerPlayPointsUsed: number, useFreeHit: boolean) => void;
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const statusCostMap = {
    [MatchStatus.NOT_STARTED]: 100,
    [MatchStatus.QUARTER]: 100,
    [MatchStatus.HALF]: 500,
    [MatchStatus.THREE_QUARTER]: 1000,
    [MatchStatus.END_PHASE]: Number.POSITIVE_INFINITY,
    [MatchStatus.COMPLETED]: Number.POSITIVE_INFINITY,
}

const statusProgressMap = {
    [MatchStatus.NOT_STARTED]: "Since the match is about to start in less than an hour,",
    [MatchStatus.QUARTER]: "Since the match has already started,",
    [MatchStatus.HALF]: "Since the match is more than 25% done,",
    [MatchStatus.THREE_QUARTER]: "Since the match is more than 50% done,",
    [MatchStatus.END_PHASE]: "Since the match is more than 75% done,",
    [MatchStatus.COMPLETED]: "100",
}

export default function UnlockMatchDialog(props: IUnlockMatchDialog) {
    const {
        userMatches,
        editPrediction: { open, index, matchStatus },
        handleCancel,
        handleSubmit,
        tournament,
        powerPlayPoints: { remaining, freeHits, usedFreeHits },
        confidenceScores,
        minimumScoreAssignable,
    } = props;

    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const userMatch = userMatches[index];
    const useFreeHit = !isEmpty(getValidFreeHits(freeHits, usedFreeHits)) && !includes([MatchStatus.END_PHASE, MatchStatus.COMPLETED], matchStatus);
    const canEdit = (remaining - statusCostMap[matchStatus]) >= 0 || useFreeHit;
    const [prediction, setPrediction] = useState(userMatch.prediction);

    const updateUnlockedPredictionHandler = (index: number, prediction: IPrediction) => {
        setPrediction(prediction);
    }

    const _timeRemainingRenderer = ({ days, hours, minutes, completed }: CountdownRenderProps) => {
        return `${hours} hour(s), ${minutes} minute(s)`;
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleCancel}
                aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}
                fullScreen={fullScreen}
                maxWidth="md"
                fullWidth={true}
            >
                <DialogTitle id="form-dialog-title">Edit Prediction</DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        {
                            useFreeHit ?
                                <>
                                    <div>
                                        You have {getValidFreeHits(freeHits, usedFreeHits).length} Free Hit(s) remaining which expires in
                                        {" "} <Countdown date={new Date(getValidFreeHits(freeHits, usedFreeHits)[0].expiry)} renderer={_timeRemainingRenderer} />
                                    </div>
                                </>
                                :
                                <>
                                    <div>
                                        {statusProgressMap[matchStatus]} this will cost you <span className={classes.boldText}> {statusCostMap[matchStatus]}</span> points.
                                    </div>
                                    <div>
                                        Current remaining points: <span className={classes.boldText}>{remaining}</span>
                                    </div>
                                </>
                        }
                    </DialogContentText>
                    <Grid item xs={12} className={classes.teamSwitcher}>
                        <TeamSwitcher
                            userMatch={userMatch}
                            tournament={tournament}
                            index={index}
                            isEditMode={canEdit}
                            confidenceScores={confidenceScores}
                            minimumScoreAssignable={minimumScoreAssignable}
                            updatePredictionHandler={updateUnlockedPredictionHandler}
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleSubmit(index, prediction, statusCostMap[matchStatus], useFreeHit)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}