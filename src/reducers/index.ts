import { ReducersMapObject, combineReducers} from 'redux';
import LeagueReducer from './LeagueReducer';

const inboudReducers: ReducersMapObject = {
    LeagueReducer
};

export type reducers = typeof inboudReducers;

export default combineReducers(inboudReducers);