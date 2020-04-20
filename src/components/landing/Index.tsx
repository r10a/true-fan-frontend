// --- Post bootstrap -----
import React from "react";
import ProductHero from "./modules/views/ProductHero";
import ProductValues from "./modules/views/ProductValues";
import ProductCategories from "./modules/views/ProductCategories";
import ProductHowItWorks from "./modules/views/ProductHowItWorks";
import AppFooter from "./modules/views/AppFooter";
import { URL } from "../../Routes";

interface IIndexProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  history: any;
}

function Index(props: IIndexProps) {
  if (props.isAuthenticated) props.history.push(URL.DASHBOARD.HOME);

  return (
    <React.Fragment>
      <ProductHero />
      <ProductValues />
      <ProductCategories />
      <ProductHowItWorks />
      <AppFooter />
    </React.Fragment>
  );
}

export default Index;
