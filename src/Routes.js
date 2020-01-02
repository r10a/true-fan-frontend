import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './components/landing/Index';

export default () => {
    return (
        <Switch>
            <Route path="/" exact component={Index} />
        </Switch>
    );
};