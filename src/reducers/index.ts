import { combineReducers} from 'redux';
import LeagueReducer from './LeagueReducer';

const inboudReducers = {
    LeagueReducer,
};

export type reducers = typeof inboudReducers;

export default combineReducers(inboudReducers);