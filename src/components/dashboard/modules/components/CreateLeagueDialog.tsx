import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { map, isEmpty } from "lodash-es";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { useMediaQuery, useTheme } from "@material-ui/core";

interface ICreateDialogProps<T> {
  open: boolean;
  formFields: T;
  helperTexts: { [key: string]: string };
  setFormField: React.Dispatch<React.SetStateAction<T>>;
  fields: Array<{
    id: string;
    label: string;
  }>;
  type: string;
  handleClose: () => void;
  handleSubmit: () => void;
}

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function CreateLeagueDialog<T>(props: ICreateDialogProps<T>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
        fullScreen={fullScreen}
      >
        <DialogTitle id="form-dialog-title">Create a League</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To Create a new private {props.type} league, please enter the
            following information.
          </DialogContentText>
          {map(props.fields, ({ id, label }, index) => (
            <TextField
              key={id}
              autoFocus={index === 0}
              required={index === 0}
              margin="dense"
              id={id}
              label={label}
              onChange={(e) =>
                props.setFormField({
                  ...props.formFields,
                  [id]: e.target.value,
                })
              }
              helperText={props.helperTexts[id]}
              error={!isEmpty(props.helperTexts[id])}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={props.handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
