// --- Post bootstrap -----
import React from "react";
import ProductHero from "./modules/views/ProductHero";
import ProductHowItWorks from "./modules/views/ProductHowItWorks";
import AppFooter from "./modules/views/AppFooter";
import { URL } from "../../Routes";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    padding: 0,
  },
}));

interface IIndexProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  history: any;
}

function Index(props: IIndexProps) {
  if (props.isAuthenticated) props.history.push(URL.LEAGUES.INSIGHTS);
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.mainGrid}>
      <ProductHero />
      {/* <ProductValues /> */}
      {/* <ProductCategories /> */}
      <ProductHowItWorks />
      <AppFooter />
    </Container>
  );
}

export default Index;
