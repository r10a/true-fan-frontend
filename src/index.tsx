import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Amplify from 'aws-amplify';
import inboundReducers from './reducers';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import theme from './theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { SnackbarProvider } from 'notistack';

const store = createStore(inboundReducers, applyMiddleware(thunk));

const snackBarStyles = makeStyles({
    root: {
        top: theme.spacing(16)
    }
});

const Root: React.FC<{}> = (props) => {
    return (
        <Provider store={store} >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Router>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider
                            dense
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            classes={snackBarStyles()}
                        >
                            <CssBaseline />
                            <App />
                        </SnackbarProvider>
                    </ThemeProvider>
                </Router>
            </MuiPickersUtilsProvider>
        </Provider>
    );
};

if (process.env.REACT_APP_STAGE === 'prod') {
    Amplify.configure({
        Auth: {
            mandatorySignIn: true,
            region: process.env.REACT_APP_REGION,
            userPoolId: process.env.REACT_APP_COGNITO_USERPOOL,
            identityPoolId: process.env.REACT_APP_COGNITO_IDENTITYPOOL,
            userPoolWebClientId: process.env.REACT_APP_COGNITO_APPCLIENT
        },
        API: {
            endpoints: [
                {
                    name: "tru-fan",
                    endpoint: process.env.REACT_APP_APIGATEWAY,
                    region: process.env.REACT_APP_REGION
                },
            ]
        }
    });
} else {
    const config = require('./config').default;
    Amplify.configure({
        Auth: {
            mandatorySignIn: true,
            region: config.cognito.REGION,
            userPoolId: config.cognito.USER_POOL_ID,
            identityPoolId: config.cognito.IDENTITY_POOL_ID,
            userPoolWebClientId: config.cognito.APP_CLIENT_ID
        },
        API: {
            endpoints: [
                {
                    name: "tru-fan",
                    endpoint: config.apiGateway.URL,
                    region: config.apiGateway.REGION
                },
            ]
        }
    });

}




ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
