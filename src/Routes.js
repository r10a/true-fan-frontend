import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './components/landing/Index';
import SignUp from './components/landing/SignUp';
import SignIn from './components/landing/SignIn';

export default () => {
    return (
        <Switch>
            <Route path="/" exact component={Index} />
            <Route path="/sign-up" exact component={SignUp} />
            <Route path="/sign-in" exact component={SignIn} />
        </Switch>
    );
};