import { cloneDeep } from 'lodash-es';
import LeagueAPI, { IUserLeagues, IUserLeagueMembers } from '../api/LeagueAPI';

export const LEAGUE_ACTIONS = {
    CREATE_LEAGUE: "CREATE_LEAGUE",
    GET_USER_LEAGUES: "GET_USER_LEAGUES",
    GET_LEAGUE_MEMBERS: "GET_LEAGUE_MEMBERS",
    RESET: "RESET"
};

export interface ILeagueState {
    user_leagues: IUserLeagues;
    members: IUserLeagueMembers;
    [key: string]: any;
}

const initialState :ILeagueState = {
    user_leagues: {} as IUserLeagues,
    members: {} as IUserLeagueMembers,
};

export type LeagueStore = typeof initialState;

export default (state = initialState, action: any) => {
    switch (action.type) {
        case LEAGUE_ACTIONS.GET_USER_LEAGUES: {
            return {
                ...state,
                user_leagues: LeagueAPI.getUserLeagues(),
            }
        }
        case LEAGUE_ACTIONS.GET_LEAGUE_MEMBERS: {
            console.log(action);
            return {
                ...state,
                members: LeagueAPI.getLeagueMembers(action.leagueName),
            }
        }
        case LEAGUE_ACTIONS.RESET: {
            return cloneDeep(initialState);
        }
        default: return { ...state };
    }
};