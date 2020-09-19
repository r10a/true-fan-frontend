import React, { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  Box,
  AppBar,
  Tabs,
  Tab,
  Link,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TablePagination,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { map, sortBy, take, get, split, slice } from "lodash-es";
import { ILeagueScore, IUserScore } from "../../../../api/DashboardAPI";
import { URL } from "../../../../Routes";
import { SurvivorScoreRow, ConfidenceScoreRow } from "./TotalScoreBoard";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    flexBasis: "90.00%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expansionStyle: {
    padding: "1px 0px",
  },
  leagueTitle: {
    paddingTop: theme.spacing(2),
  },
  tabTitle: {
    backgroundColor: theme.palette.primary.light,
  },
  tabSelected: {
    color: theme.palette.primary.dark + " !important",
  },
}));

interface ITabPanelProps {
  children: JSX.Element | string;
  value: number;
  index: number;
  classes: string;
  [key: string]: string | number | JSX.Element;
}

function TabPanel(props: ITabPanelProps) {
  const { children, value, index, classes, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box className={classes}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

interface IScoreBoardProps {
  score: ILeagueScore;
}

const ROWS_PER_PAGE = 5;

function ScoreBoard(props: IScoreBoardProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const tabCustomStyles = {
    selected: classes.tabSelected,
  };
  const {
    score: { leagueName, scores },
  } = props;
  const tournament = get(
    split(get(scores, [0, "tournamentLeague"]), "/"),
    0,
    ""
  );

  const [survivoreScores, setSurvivorScores] = useState([] as IUserScore[]);
  const [confidenceScores, setConfidenceScores] = useState([] as IUserScore[]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setSurvivorScores(take(sortBy(scores, ["survivorRank"]), 20));
    setConfidenceScores(take(sortBy(scores, ["confidenceRank"]), 20));
  }, [scores]);

  const handleChange = (event: object, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <Grid item className={classes.root} xs={12} md={6}>
      <AppBar
        position="static"
        color="primary"
        classes={{
          colorPrimary: classes.tabTitle,
        }}
      >
        <Link
          color="inherit"
          variant="h5"
          underline="always"
          component={RouterLink}
          to={URL.LEAGUES.SURVIVOR.replace(":game", tournament).replace(
            ":league",
            leagueName
          )}
        >
          <Typography className={classes.leagueTitle} variant="h5" noWrap>
            {leagueName}
          </Typography>
        </Link>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Survivor" {...a11yProps(0)} classes={tabCustomStyles} />
          <Tab label="Confidence" {...a11yProps(1)} classes={tabCustomStyles} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel
          value={value}
          index={0}
          dir={theme.direction}
          classes={classes.expansionStyle}
        >
          <>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableBody>
                  {map(
                    slice(
                      survivoreScores,
                      page * ROWS_PER_PAGE,
                      page * ROWS_PER_PAGE + ROWS_PER_PAGE
                    ),
                    (score, rank) => (
                      <SurvivorScoreRow
                        key={`${score.userId}${score.tournamentLeague}`}
                        row={{ score, rank: page * ROWS_PER_PAGE + rank }}
                      />
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[]}
              count={survivoreScores.length}
              rowsPerPage={ROWS_PER_PAGE}
              page={page}
              onChangePage={handleChangePage}
            />
          </>
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          dir={theme.direction}
          classes={classes.expansionStyle}
        >
          <>
            <TableContainer component="div">
              <Table aria-label="collapsible table">
                <TableBody>
                  {map(
                    slice(
                      confidenceScores,
                      page * ROWS_PER_PAGE,
                      page * ROWS_PER_PAGE + ROWS_PER_PAGE
                    ),
                    (score, rank) => (
                      <ConfidenceScoreRow
                        key={`${score.userId}${score.tournamentLeague}`}
                        row={{ score, rank: page * ROWS_PER_PAGE + rank }}
                      />
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[]}
              count={survivoreScores.length}
              rowsPerPage={ROWS_PER_PAGE}
              page={page}
              onChangePage={handleChangePage}
            />
          </>
        </TabPanel>
      </SwipeableViews>
    </Grid>
  );
}

export default React.memo(ScoreBoard);
