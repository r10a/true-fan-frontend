import React from "react";
import { Route, Switch } from "react-router-dom";
import Index from "./components/landing/Index";
import SignUp from "./components/landing/SignUp";
import SignIn from "./components/landing/SignIn";
import HowToPlay from "./components/landing/HowToPlay";
import FAQs from "./components/landing/FAQs";
import ResetPassword from "./components/landing/ResetPassword";
import Dashboard from "./components/dashboard/MyLeagues";
import CreateLeague from "./components/dashboard/CreateLeague";
import ManageLeagues from "./components/dashboard/ManageLeagues";
import IPL from "./components/dashboard/modules/views/IPL";
import Survivor from "./components/dashboard/modules/views/Survivor";
import ScheduleEditor from "./components/dashboard/modules/views/ScheduleEditor";

const AppliedRoute = ({ component: C, appProps, ...rest }) => {
  return <Route {...rest} render={(props) => <C {...props} {...appProps} />} />;
};

const NotFound = () => {
  return <div>You are not supposed to be here!</div>;
};

export const URL = {
  HOME: "/",
  SIGNUP: "/sign-up",
  SIGNIN: "/sign-in",
  FAQ: "/faq",
  HOW_TO_PLAY: "/how-to-play",
  LEAGUES: {
    HOME: "/leagues",
    CREATE: "/leagues/create",
    MANAGE: "/leagues/manage",
    IPL: "/leagues/IPL",
    SURVIVOR: "/leagues/:game/:league/survivor",
    SCHEDULE_EDITOR: "/leagues/:game/editor",
  },
  FORGOT_PASSWORD: "/reset-password",
};

export default (props) => {
  return (
    <Switch>
      <AppliedRoute path={URL.HOME} exact component={Index} appProps={props} />
      <AppliedRoute
        path={URL.SIGNUP}
        exact
        component={SignUp}
        appProps={props}
      />
      <AppliedRoute
        path={URL.SIGNIN}
        exact
        component={SignIn}
        appProps={props}
      />
      <AppliedRoute
        path={URL.FORGOT_PASSWORD}
        exact
        component={ResetPassword}
        appProps={props}
      />
      <AppliedRoute path={URL.FAQ} exact component={FAQs} appProps={props} />
      <AppliedRoute
        path={URL.HOW_TO_PLAY}
        exact
        component={HowToPlay}
        appProps={props}
      />
      <AppliedRoute
        path={URL.LEAGUES.HOME}
        exact
        component={Dashboard}
        appProps={props}
      />
      <AppliedRoute
        path={URL.LEAGUES.CREATE}
        exact
        component={CreateLeague}
        appProps={props}
      />
      <AppliedRoute
        path={URL.LEAGUES.MANAGE}
        exact
        component={ManageLeagues}
        appProps={props}
      />
      <AppliedRoute
        path={URL.LEAGUES.IPL}
        exact
        component={IPL}
        appProps={props}
      />
      <AppliedRoute
        path={URL.LEAGUES.SURVIVOR}
        exact
        component={Survivor}
        appProps={props}
      />
      <AppliedRoute
        path={URL.LEAGUES.SCHEDULE_EDITOR}
        exact
        component={ScheduleEditor}
        appProps={props}
      />
      <Route component={NotFound} />
    </Switch>
  );
};
