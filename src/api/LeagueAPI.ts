import { API, Auth } from "aws-amplify";

interface IAPIQueryResult {
    Count: number;
    ScannedCount: number;
}

export interface ICreateLeaguePayload {
    userId: string;
    leagueName: string;
    description: string;
    tournament: string;
    created?: string;
}

export interface IUserLeagues extends IAPIQueryResult {
    Items: Array<{
        adminLeagues: ICreateLeaguePayload[];
        userLeagues: ICreateLeaguePayload[];
    }>;
}

export interface IUserLeagueMembers extends IAPIQueryResult {
    Items: ILeagueMemberPayload[];
}

export interface IGameScheduleResult  {
    result: {
        Item: IGameSchedule;
    };
}

export interface IPlayerListResult {
    result: {
        Item: ITeamPlayers;
    };
}

export interface ILeagueMemberPayload {
    leagueName: string;
    userId: string;
}

export interface IPrediction {
    team: string;
    mom: string;
    confidence: number;
}

export interface IGameSchedule {
    tournament: string;
    modified: string;
    schedule: IMatch[];
}

export interface IMatch {
    start: string;
    mom: string;
    right: string;
    left: string;
    completed: boolean;
    winner: string;
    end: string;
}

export interface ITeamPlayers {
    tournament: string;
    team: string;
    players: string[];
}

interface ISurvivorPredictionPayload {
    predictions: IPrediction[];
    tournament: string;
    leagueName: string;
    userId?: string;
}

export interface ISurvivorPredictionResult {
    result: {
        Item: ISurvivorPredictionPayload;
    };
}

const createLeague = async (payload: ICreateLeaguePayload): Promise<IUserLeagues> => {
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
    return API.get("tru-fan", `/get-leagues/${user.attributes.email}`, {
        headers: {}
    });
}

const getLeagueMembers = async (tournament: string, leagueName: string): Promise<IUserLeagueMembers> => {
    return API.get("tru-fan", `/get-league-members/${tournament}/${leagueName}`, {
        headers: {}
    });
}

const setLeagueMembers = async (tournament: string, leagueName: string, members: string[]): Promise<IUserLeagueMembers> => {
    return API.post("tru-fan", `/set-league-members/${tournament}/${leagueName}`, {
        body: { members }
    });
}

const getSchedule = async (tournament: string): Promise<IGameScheduleResult> => {
    return API.get("tru-fan", `/get-schedule/${tournament}`, {
        headers: {}
    });
};

const updateSchedule = async (tournament: string, schedule: IMatch[]): Promise<IGameScheduleResult> => {
    return API.post("tru-fan", `/update-schedule/${tournament}`, {
        body: { schedule }
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

const getPlayers = async (tournament: string, team: string): Promise<IPlayerListResult> => {
    return API.get("tru-fan", `/get-players/${tournament}/${team}`, {
        headers: {}
    });
};

export default {
    create: createLeague,
    getUserLeagues,
    getLeagueMembers,
    setLeagueMembers,
    getSchedule,
    updateSchedule,
    getSurvivorPrediction,
    setSurvivorPrediction,
    getPlayers,
};