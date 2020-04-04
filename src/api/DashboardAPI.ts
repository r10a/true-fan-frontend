import { API, Auth } from "aws-amplify";

export interface IScoreResult {
    result: {
        Item: ITournament;
    }
}

export interface ITournament {
    tournament: string;
    leagues: ILeagueScore[];
}

export interface ILeagueScore {
    leagueName: string;
    scores: IUserScore[];
}

export interface IUserScore {
    userId: string;
    tournamentLeague: string;
    freeHits: number;
    strikes: number;
    username: string;
    confidenceScore: number;
    remainingPoints: number;
    lostMatches: number[];
    survivorRank: number;
    confidenceRank: number;
    usedPowerPlayPoints: number;
    totalFreeHits: number;
    usedFreeHits: number;
}

const getScores = async (tournament: string): Promise<IScoreResult> => {
    const user = await Auth.currentAuthenticatedUser();
    return API.get("tru-fan", `/get-scores/${tournament}/${user.attributes.email}`, {
        headers: {}
    });
};

export default {
    getScores
}