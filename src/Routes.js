import React from "react";
import { Route, Switch } from "react-router-dom";
import Index from "./components/landing/Index";
import SignUp from "./components/landing/SignUp";
import SignIn from "./components/landing/SignIn";
import ResetPassword from "./components/landing/ResetPassword";
import Dashboard from "./components/dashboard/Dashboard";
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
  DASHBOARD: {
    HOME: "/dashboard",
    IPL: "/dashboard/IPL",
    SURVIVOR: "/dashboard/:game/:league/survivor",
    SCHEDULE_EDITOR: "/dashboard/:game/editor",
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
      <AppliedRoute
        path={URL.DASHBOARD.HOME}
        exact
        component={Dashboard}
        appProps={props}
      />
      <AppliedRoute
        path={URL.DASHBOARD.IPL}
        exact
        component={IPL}
        appProps={props}
      />
      <AppliedRoute
        path={URL.DASHBOARD.SURVIVOR}
        exact
        component={Survivor}
        appProps={props}
      />
      <AppliedRoute
        path={URL.DASHBOARD.SCHEDULE_EDITOR}
        exact
        component={ScheduleEditor}
        appProps={props}
      />
      <Route component={NotFound} />
    </Switch>
  );
};
