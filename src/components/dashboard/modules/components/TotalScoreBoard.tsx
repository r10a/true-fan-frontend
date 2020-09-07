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
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  TablePagination,
} from "@material-ui/core";
import { map, sortBy, take, join, slice } from "lodash-es";
import { IUserScore, ITournamentScore } from "../../../../api/DashboardAPI";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
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

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

interface IScoreBoardProps {
  score: ITournamentScore;
  survivorSelector: string;
  confidenceSelector: string;
}

export function SurvivorScoreRow(props: {
  row: { score: IUserScore; rank: number };
}) {
  const {
    row: { score, rank },
  } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="right">
          <Typography className={classes.secondaryHeading} variant="subtitle2">
            #{rank + 1}
          </Typography>
        </TableCell>
        <TableCell align="right">{score.username}</TableCell>
        <TableCell align="right">
          {score.tournamentLeague.split("/").splice(1).join()}
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="summary">
                <TableHead>
                  <TableRow>
                    <TableCell>Strikes</TableCell>
                    <TableCell>Lost Matches</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {score.strikes}
                    </TableCell>
                    <TableCell>
                      {join(
                        map(score.lostMatches, (m) => `#${m}`),
                        " "
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function ConfidenceScoreRow(props: {
  row: { score: IUserScore; rank: number };
}) {
  const {
    row: { score, rank },
  } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="right">
          <Typography className={classes.secondaryHeading} variant="subtitle2">
            #{rank + 1}
          </Typography>
        </TableCell>
        <TableCell align="right">{score.username}</TableCell>
        <TableCell align="right">
          {score.tournamentLeague.split("/").splice(1).join()}
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="summary">
                <TableHead>
                  <TableRow>
                    <TableCell>Confidence Score</TableCell>
                    <TableCell>Remaining Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {score.confidenceScore}
                    </TableCell>
                    <TableCell>{score.remainingPoints}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const ROWS_PER_PAGE = 5;

function TotalScoreBoard(props: IScoreBoardProps) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const tabCustomStyles = {
    selected: classes.tabSelected,
  };
  const {
    score: { tournament, scores },
    survivorSelector,
    confidenceSelector,
  } = props;

  const [survivoreScores, setSurvivorScores] = useState([] as IUserScore[]);
  const [confidenceScores, setConfidenceScores] = useState([] as IUserScore[]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setSurvivorScores(take(sortBy(scores, [survivorSelector]), 5));
    setConfidenceScores(take(sortBy(scores, [confidenceSelector]), 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Typography className={classes.leagueTitle} variant="h5" noWrap>
          {tournament}
        </Typography>
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
                        key={score.userId}
                        row={{ score, rank }}
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
            <TableContainer component={Paper}>
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
                        key={score.userId}
                        row={{ score, rank }}
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

export default React.memo(TotalScoreBoard);
