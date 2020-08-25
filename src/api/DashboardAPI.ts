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

export interface ITournamentStatsResult {
  result: {
    Item: ITournamentStats;
  };
}

export interface TournamentMatchStat extends IMatch {
  leftCount: number;
  leftConfidence: number;
  rightCount: number;
  rightConfidence: number;
}

export interface ITournamentStats {
  tournament: string;
  stats: TournamentMatchStat[];
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

export interface IGameScheduleResult {
  result: {
    Item: IGameSchedule;
  };
}

const getStats = async (
  tournament: string
): Promise<ITournamentStatsResult> => {
  return API.get("tru-fan", `/get-tournament-stats/${tournament}`, {
    headers: {},
  });
};

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

const getSchedule = async (
  tournament: string
): Promise<IGameScheduleResult> => {
  return API.get("tru-fan", `/get-schedule/${tournament}`, {
    headers: {},
  });
};

const updateSchedule = async (
  tournament: string,
  schedule: IMatch[]
): Promise<IGameScheduleResult> => {
  return API.post("tru-fan", `/update-schedule/${tournament}`, {
    body: { schedule },
  });
};

export default {
  getStats,
  getScores,
  getTotalScores,
  getSchedule,
  updateSchedule,
};
