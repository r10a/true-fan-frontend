import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    display: "flex",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
});

interface ICardListItemProps {
  title: string;
  description: string;
  owner: string;
  onClick: () => void;
  onOptionsClick?: () => void;
}

function CardListItem(props: ICardListItemProps) {
  const classes = useStyles();
  const { title, description, owner } = props;

  return (
    <Grid item xs={12}>
      <CardActionArea component="a">
        <Card className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Grid container spacing={4} justify="center" alignItems="center">
                <Grid item xs={8} md={10} onClick={props.onClick}>
                  <Typography component="h2" variant="h5">
                    {title}
                  </Typography>
                  <Typography variant="subtitle1" paragraph>
                    {description}
                  </Typography>
                  <Typography variant="subtitle2" paragraph>
                    {owner}
                  </Typography>
                </Grid>
                {!!props.onOptionsClick ? (
                  <Grid item xs={4} md={2}>
                    <IconButton
                      aria-label="settings"
                      onClick={props.onOptionsClick}
                    >
                      <Typography variant="button">Invite</Typography>
                    </IconButton>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </CardContent>
          </div>
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default React.memo(CardListItem);
