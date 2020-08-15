import { API, Auth } from "aws-amplify";

export interface IScoreResult {
  result: {
    Item: ITournament;
  };
}

export interface ITotalScoreResult {
  result: {
    Item: ITournamentScore;
  };
}

export interface ITournament {
  tournament: string;
  leagues: ILeagueScore[];
}

export interface ITournamentScore {
  tournament: string;
  scores: IUserScore[];
}

export interface ILeagueScore {
  leagueName: string;
  scores: IUserScore[];
}

export interface IUserScore {
  userId: string;
  tournamentLeague: string;
  freeHits: Array<{
    expiry: string;
    match: number;
  }>;
  strikes: number;
  username: string;
  confidenceScore: number;
  remainingPoints: number;
  lostMatches: number[];
  survivorRank: number;
  confidenceRank: number;
  usedPowerPlayPoints: number;
  usedFreeHits: number[];
}

const getTotalScores = async (
  tournament: string
): Promise<ITotalScoreResult> => {
  return API.get("tru-fan", `/get-total-scores/${tournament}`, {
    headers: {},
  });
};

const getScores = async (tournament: string): Promise<IScoreResult> => {
  const user = await Auth.currentAuthenticatedUser();
  return API.get(
    "tru-fan",
    `/get-scores/${tournament}/${user.attributes.email}`,
    {
      headers: {},
    }
  );
};

export default {
  getScores,
  getTotalScores,
};
