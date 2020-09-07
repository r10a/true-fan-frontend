import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { URL } from "../../Routes";
import { red } from "@material-ui/core/colors";
import { Grid } from "@material-ui/core";
import ContactForm from "./modules/views/ContactForm";

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

export default function ContactUS(props: IDashboardProps) {
  if (!props.isAuthenticated) props.history.push(URL.HOME);
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.mainGrid}>
        <Grid container spacing={4} justify="center">
          <ContactForm />
        </Grid>
      </Container>
    </React.Fragment>
  );
}
