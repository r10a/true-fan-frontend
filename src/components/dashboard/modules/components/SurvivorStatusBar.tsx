import React from 'react';
import { AppBar, Toolbar, Grid, Badge, Avatar, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { map } from 'lodash-es';
import { IConfidenceScore } from '../views/Survivor';

export interface ISurvivorStatusProps {
    classes: Record<any, string>;
    confidenceScores: IConfidenceScore[];
    save: () => void;
}

function SurvivorStatusBar(props: ISurvivorStatusProps) {
    const { classes, confidenceScores } = props;

    return (
        <AppBar position="sticky" className={classes.statusBar}>
            <Toolbar>
                <Grid container spacing={1} justify="center">
                    {
                        map(confidenceScores, ({ score, remaining }) => {
                            return (
                                <Grid item xs md={1} key={score.toString()}>
                                    <Badge
                                        overlap="circle"
                                        color="primary"
                                        badgeContent={remaining.toString()}
                                        className={classes.statusBarBadge}
                                    >
                                        <Avatar>{score}</Avatar>
                                    </Badge>
                                </Grid>
                            )
                        })
                    }
                    <Grid item md={1} className={classes.saveButton}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<SaveIcon />}
                            onClick={props.save}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default React.memo(SurvivorStatusBar);