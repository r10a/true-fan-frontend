import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

const ConfidenceSlider = withStyles(theme => ({
    // root: {
    //   // color: theme.palette.primary.light,
    //   // height: 8,
    // },
    // thumb: {
      // height: theme.spacing(3),
      // width: theme.spacing(3),
      // backgroundColor: theme.palette.primary.main,
      // border: '2px solid currentColor',
      // marginTop: -2,
      // marginLeft: -12,
      // '&:focus,&:hover,&$active': {
      //   boxShadow: 'inherit',
      // },
    // },
    // active: {},
    // valueLabel: {
    //   left: 'calc(-50% + 4px)',
    // },
    // track: {
    //   height: theme.spacing(1),
    //   borderRadius: 4,
    // },
    // rail: {
    //   height: theme.spacing(1),
    //   borderRadius: 4,
    // },
  }))(Slider);

  export default ConfidenceSlider;