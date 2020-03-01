import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';

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

interface IJumboButtonProps {
  image: string;
  imgText: string;
  title: string;
  description: string;
  onClick: () => void;
}

function JumboButton(props: IJumboButtonProps) {
  const classes = useStyles();
  const { image, imgText, title, description } = props;

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a">
        <Card className={classes.card} onClick={props.onClick}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component="h2" variant="h5">
                {title}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {description}
              </Typography>
            </CardContent>
          </div>
          <Hidden xsDown>
            <CardMedia className={classes.cardMedia} image={image} title={imgText} />
          </Hidden>
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default React.memo(JumboButton);