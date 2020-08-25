import React, { useMemo } from "react";
import { TournamentMatchStat } from "../../../../api/DashboardAPI";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  CardHeader,
  useTheme,
  Theme,
  makeStyles,
} from "@material-ui/core";
import { PieChart } from "react-minimal-pie-chart";
import { LabelRenderProps } from "react-minimal-pie-chart/types/Label";
import { Data } from "react-minimal-pie-chart/types/commonTypes";

interface IMatchStatsProps {
  stats: TournamentMatchStat;
  idx: number;
}

const useStyles = makeStyles((theme) => ({
  divider: {
    padding: theme.spacing(1),
  },
}));

const getSurvivorData = (stats: TournamentMatchStat, theme: Theme) => {
  const { left, right, leftCount = 0, rightCount = 0 } = stats;

  return [
    {
      title: left,
      value:
        leftCount === 0
          ? rightCount === 0
            ? 0.1
            : rightCount / 10
          : leftCount,
      color: theme.palette.primary.main,
    },
    {
      title: right,
      value:
        rightCount === 0
          ? leftCount === 0
            ? 0.1
            : leftCount / 10
          : rightCount,
      color: theme.palette.secondary.main,
    },
  ];
};

const getConfidenceData = (stats: TournamentMatchStat, theme: Theme) => {
  const { left, right, leftConfidence = 0, rightConfidence = 0 } = stats;

  return [
    {
      title: left,
      value: leftConfidence === 0 ? 5 : leftConfidence,
      color: theme.palette.primary.main,
    },
    {
      title: right,
      value: rightConfidence === 0 ? 5 : rightConfidence,
      color: theme.palette.secondary.main,
    },
  ];
};

const labelGenerator = ({ dataEntry }: LabelRenderProps) => dataEntry.title;
const labelStyleGenerator = (data: Data) => (index: number) => ({
  fill: data[index].color,
  fontSize: "8px",
  fontFamily: "sans-serif",
});
const pieChartStyle = { maxHeight: 250 };

export default function MatchStats({ stats, idx }: IMatchStatsProps) {
  const theme = useTheme();
  const classes = useStyles();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const survivorData = useMemo(() => getSurvivorData(stats, theme), [stats]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const confidenceData = useMemo(() => getConfidenceData(stats, theme), [
    stats,
  ]);

  return (
    <Card>
      <CardHeader title={`Match #${idx + 1}`} />
      <CardContent>
        <Typography variant="subtitle1" component="p">
          Survivor selections
        </Typography>
        <PieChart
          data={survivorData}
          lineWidth={30}
          label={labelGenerator}
          labelPosition={50}
          paddingAngle={2}
          labelStyle={labelStyleGenerator(survivorData)}
          style={pieChartStyle}
          lengthAngle={-180}
          startAngle={0}
          viewBoxSize={[100, 50]}
        />
        <div className={classes.divider} />
        <PieChart
          data={confidenceData}
          lineWidth={30}
          label={labelGenerator}
          labelPosition={50}
          paddingAngle={2}
          labelStyle={labelStyleGenerator(survivorData)}
          style={pieChartStyle}
          lengthAngle={180}
          startAngle={0}
          viewBoxSize={[100, 50]}
          center={[50, 0]}
        />
        <Typography variant="subtitle1" component="p">
          Confidence selections
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
