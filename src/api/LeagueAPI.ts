import { GAME_TYPE } from "../components/dashboard/Dashboard";
import { API, Auth } from "aws-amplify";

export interface ICreateLeaguePayload {
    userId?: string;
    lname: string;
    description: string;
    type: GAME_TYPE;
    tournament: string;
}

const createLeague = async (payload: ICreateLeaguePayload): Promise<ICreateLeaguePayload> => {
    console.log("payload", payload);
    const user = await Auth.currentAuthenticatedUser();
    return API.post("tru-fan", "/create-league", {
        body: {
            ...payload,
            userId: user.username
        }
    });
}

export default {
    create: createLeague
};