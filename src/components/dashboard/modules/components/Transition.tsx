import React from "react";
import { SlideProps, Slide } from "@material-ui/core";

export default React.forwardRef<unknown, SlideProps>(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
