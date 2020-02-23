import { GAME_TYPE } from "../components/dashboard/Dashboard";
import { API, Auth } from "aws-amplify";

interface IAPIResult {
    Count: number;
    ScannedCount: number;
}

export interface ICreateLeaguePayload {
    userId: string;
    leagueName: string;
    description: string;
    leagueType: GAME_TYPE;
    tournament: string;
    created?: string;
}

export interface IUserLeagues extends IAPIResult {
    Items: Array<{
        adminLeagues: ICreateLeaguePayload[];
        userLeagues: ICreateLeaguePayload[];
    }>;
}

export interface IUserLeagueMembers extends IAPIResult {
    Items: ILeagueMemberPayload[];
}

export type IGameSchedule = Array<string[]>;

export interface IGameScheduleResult extends IAPIResult {
    Item: IGameSchedule;
}

export interface ILeagueMemberPayload {
    leagueName: string;
    userId: string;
}

export interface ISurvivorPrediction {
    team: string;
    mom: string;
    confidence: number;
}

interface ISurvivorPredictionPayload {
    predictions: ISurvivorPrediction[];
    tournament: string;
    leagueName: string;
    userId?: string;
}

export interface ISurvivorPredictionResult extends IAPIResult {
    Item: ISurvivorPredictionPayload;
}

const createLeague = async (payload: ICreateLeaguePayload): Promise<IUserLeagues> => {
    console.log("payload", payload);
    const user = await Auth.currentAuthenticatedUser();
    return API.post("tru-fan", "/create-league", {
        body: {
            ...payload,
            userId: user.attributes.email
        }
    });
}

const getUserLeagues = async (): Promise<Array<ICreateLeaguePayload>> => {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user);
    return API.get("tru-fan", `/get-leagues/${user.attributes.email}`, {
        headers: {}
    });
}

const getLeagueMembers = async (leagueName: string): Promise<IUserLeagueMembers> => {
    return API.get("tru-fan", `/get-league-members/${leagueName}`, {
        headers: {}
    });
}

const setLeagueMembers = async (leagueName: string, members: string[]): Promise<IUserLeagueMembers> => {
    return API.post("tru-fan", `/set-league-members/${leagueName}`, {
        body: { members }
    });
}

const getSchedule = async (tournament: string): Promise<IGameSchedule> => {
    return API.get("tru-fan", `/get-schedule/${tournament}`, {
        headers: {}
    });
};

const getSurvivorPrediction = async (tournament: string, leagueName: string) => {
    const user = await Auth.currentAuthenticatedUser();
    return API.get("tru-fan", `/get-survivor-prediction/${tournament}/${leagueName}/${user.attributes.email}`, {
        headers: {}
    }).catch(error => {
        if (error.response.data.error.message === "No such Item exists") {
            return Promise.resolve({});
        }
    });
};

const setSurvivorPrediction = async (payload: ISurvivorPredictionPayload): Promise<ISurvivorPredictionResult> => {
    const user = await Auth.currentAuthenticatedUser();
    return API.post("tru-fan", `/set-survivor-prediction/${payload.tournament}/${payload.leagueName}/${user.attributes.email}`, {
        body: { predictions: payload.predictions }
    });
};

export default {
    create: createLeague,
    getUserLeagues,
    getLeagueMembers,
    setLeagueMembers,
    getSchedule,
    getSurvivorPrediction,
    setSurvivorPrediction
};