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

export interface ILeagueMemberPayload {
    leagueName: string;
    userId: string;
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

const setLeagueMembers = async (leagueName: string, payload: string[]): Promise<IUserLeagueMembers> => {
    return API.post("tru-fan", `/set-league-members/${leagueName}`, {
        body: {
            members: payload
        }
    });
}

export default {
    create: createLeague,
    getUserLeagues,
    getLeagueMembers,
    setLeagueMembers,
};