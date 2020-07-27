import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { URL } from "../../Routes";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  leaguesSection: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

interface IDashboardProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  history: any;
}

export default function FAQs(props: IDashboardProps) {
  if (!props.isAuthenticated) props.history.push(URL.HOME);
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.mainGrid}>
        Under Construction
      </Container>
    </React.Fragment>
  );
}
