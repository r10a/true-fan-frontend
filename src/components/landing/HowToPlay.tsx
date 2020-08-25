import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { URL } from "../../Routes";
import { red } from "@material-ui/core/colors";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Collapse,
  List,
  ListItem,
  Grid,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

interface IDashboardProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  history: any;
}

export default function HowToPlay(props: IDashboardProps) {
  if (!props.isAuthenticated) props.history.push(URL.HOME);
  const classes = useStyles();

  const [survivorExpanded, setSurvivorExpanded] = React.useState(false);

  const handleSurvivorExpandClick = () => {
    setSurvivorExpanded(!survivorExpanded);
  };

  const [confidenceExpanded, setConfidenceExpanded] = React.useState(false);

  const handleConfidenceExpandClick = () => {
    setConfidenceExpanded(!confidenceExpanded);
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.mainGrid}>
        <Grid container spacing={4}>
          <Grid item>
            <Card className={classes.root}>
              <CardHeader title="Survivor League" subheader="Rules" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  The objective of the Survivor Pool is to get least strikes.
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: survivorExpanded,
                  })}
                  onClick={handleSurvivorExpandClick}
                  aria-expanded={survivorExpanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={survivorExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>How To:</Typography>
                  <Typography paragraph>
                    In order to accomplish this goal, a player must correctly
                    pick the winner of every World Cup match.
                  </Typography>
                  <Typography paragraph>
                    Games that end in a tie (or Abandoned) will be considered as
                    a win.
                  </Typography>
                  <Typography paragraph>
                    Missed selection for any match will be defaulted to a loss.
                  </Typography>
                  <Typography>
                    All picks can be made ahead of time but the last update for
                    the match should be made 1 hour before the start of the
                    match.
                  </Typography>
                  <Typography>
                    The ranking will be decided based on the following rules -
                    <List component="div" aria-label="rules">
                      <ListItem>1. Least number of Strikes</ListItem>
                      2. If number of strikes are equal then following Tie
                      breaker rules will be applied
                      <ListItem>
                        Highest # of correct picks before the last Strike.
                      </ListItem>
                      <ListItem>
                        Highest # of correct picks before the Last but 1 Strike.
                      </ListItem>
                      <ListItem>-------</ListItem>
                      <ListItem>-------</ListItem>
                      <ListItem>
                        Highest # of correct picks before the 2nd strike.
                      </ListItem>
                      <ListItem>
                        Highest # of correct picks before the 1st strike.
                      </ListItem>
                    </List>
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
          <Grid item>
            {/* Confidence */}
            <Card className={classes.root}>
              <CardHeader title="Confidence League" subheader="Rules" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  Each player will assign a “Weight” to every game based on how
                  confident they are that the team they will pick win the match.
                  <List component="div" aria-label="conf-rules">
                    <ListItem>20 – Not Confident</ListItem>
                    <ListItem>40 – Less Confident</ListItem>
                    <ListItem>60 - Confident</ListItem>
                    <ListItem>80 - More Confident</ListItem>
                    <ListItem>100 - Most Confident</ListItem>
                  </List>
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: confidenceExpanded,
                  })}
                  onClick={handleConfidenceExpandClick}
                  aria-expanded={confidenceExpanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={confidenceExpanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>How To:</Typography>
                  <Typography paragraph>
                    IPL has 60 Matches hence every weight is available 12 times.
                  </Typography>
                  <Typography paragraph>
                    For each correct pick, Player will receive the number of
                    points she has assigned to that pick.
                  </Typography>
                  <Typography paragraph>
                    All picks can be made ahead of time but the last update for
                    the match should be made 1 hour before the start of the
                    match.
                  </Typography>
                  <Typography>
                    Illustration -
                    <List component="div" aria-label="rules">
                      <ListItem>
                        Suppose you have assigned 20 (Not Confident) points to
                        Game 1 and 100 (Most Confident) points to Game 2 then
                        following points will be awarded in 4 different
                        scenarios.
                      </ListItem>
                      <ListItem>
                        If both the selections win the matches then you will
                        earn 120 points.
                      </ListItem>
                      <ListItem>
                        If the team you have selected for Game1 wins the match
                        and team you have selected for Game2 loses the match
                        then you will earn 20 points.
                      </ListItem>
                      <ListItem>
                        If the team you have selected for Game1 loses the match
                        and team you have selected for Game2 wins the match then
                        you will earn 100 points.
                      </ListItem>
                      <ListItem>
                        If your both the selection lose the match then you will
                        earn 0 point.
                      </ListItem>
                      <ListItem>
                        For the remaining matches you will be able to assign 100
                        and 20 points 11 times and 40, 60, and 80 points 12
                        times.
                      </ListItem>
                    </List>
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
          <Grid item>
            {/* Free Hit */}
            <Card className={classes.root}>
              <CardHeader title="Free Hit" subheader="Description" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  During the tournament if a player guess the Man of the Match
                  (MotM)right then for the next 26 hours she/he will be allowed
                  to change the winner and Confidence points.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  A Player can change her/his Selection up to half time of the
                  match.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Free Hit will be available for the next 26 hours only. You can
                  use it to change the selections of any match as long as the
                  Half Time of the match is within 26 hrs range.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  If you guessed the MotM right for the match that happened
                  between 6-10PM then Free hit will be available till 12PM Next
                  Day.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            {/* Power Play */}
            <Card className={classes.root}>
              <CardHeader title="Power Play" subheader="Description" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  During the tournament a player will be allowed to change the
                  prediction and Confidence point using PowerPlay.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  P1 - 25% of the Match. Costs 100 Points.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  P2 - 50% of the Match. Costs 500 Points.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  P3 - 80% of the Match. Costs 1000 Points.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  All Players will get 3000 Points at the start of the game.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
