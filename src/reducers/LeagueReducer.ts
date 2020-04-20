import { cloneDeep } from "lodash-es";
import LeagueAPI, {
  IUserLeagues,
  IUserLeagueMembers,
  IGameScheduleResult,
} from "../api/LeagueAPI";

export const LEAGUE_ACTIONS = {
  CREATE_LEAGUE: "CREATE_LEAGUE",
  GET_USER_LEAGUES: "GET_USER_LEAGUES",
  GET_LEAGUE_MEMBERS: "GET_LEAGUE_MEMBERS",
  GET_SCHEDULE: "GET_SCHEDULE",
  GET_SURVIVOR_PREDICTION: "GET_SURVIVOR_PREDICTION",
  SET_SURVIVOR_PREDICTION: "SET_SURVIVOR_PREDICTION",
  RESET: "RESET",
};

export interface ILeagueState {
  // eslint-disable-next-line camelcase
  user_leagues: IUserLeagues;
  members: Promise<IUserLeagueMembers>;
  schedule: Promise<IGameScheduleResult>;
  [key: string]: any;
}

const initialState: ILeagueState = {
  user_leagues: {} as IUserLeagues,
  members: {} as Promise<IUserLeagueMembers>,
  schedule: {} as Promise<IGameScheduleResult>,
};

export default (state: ILeagueState = initialState, action: any) => {
  switch (action.type) {
    case LEAGUE_ACTIONS.GET_USER_LEAGUES: {
      return {
        ...state,
        user_leagues: LeagueAPI.getUserLeagues(),
      };
    }
    case LEAGUE_ACTIONS.GET_LEAGUE_MEMBERS: {
      return {
        ...state,
        members: LeagueAPI.getLeagueMembers(
          action.tournament,
          action.leagueName
        ),
      };
    }
    case LEAGUE_ACTIONS.GET_SCHEDULE: {
      return {
        ...state,
        schedule: LeagueAPI.getSchedule(action.tournament),
      };
    }
    case LEAGUE_ACTIONS.GET_SURVIVOR_PREDICTION: {
      return {
        ...state,
        survivorPrediction: LeagueAPI.getSurvivorPrediction(
          action.tournament,
          action.leagueName
        ),
      };
    }
    case LEAGUE_ACTIONS.SET_SURVIVOR_PREDICTION: {
      return {
        ...state,
        survivorPrediction: LeagueAPI.setSurvivorPrediction(action.payload),
      };
    }
    case LEAGUE_ACTIONS.RESET:
    default:
      return cloneDeep(initialState);
  }
};
