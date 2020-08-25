import { API, Auth } from "aws-amplify";
import { IUserScore, IScoreResult } from "./DashboardAPI";

interface IAPIQueryResult {
  Count: number;
  ScannedCount: number;
}

export interface ILeague {
  userId: string;
  leagueName: string;
  description: string;
  tournament: string;
  totalPowerPlayPoints: number;
  created?: string;
}

interface ILeagueResult {
  result: {
    Item: ILeague;
  };
}

export interface IUserLeagues extends IAPIQueryResult {
  Items: Array<{
    adminLeagues: ILeague[];
    userLeagues: ILeague[];
  }>;
}

export interface IUserLeagueMembers extends IAPIQueryResult {
  Items: ILeagueMemberPayload[];
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

export interface ITeamPlayers {
  tournament: string;
  team: string;
  players: string[];
}

export interface ISurvivorPredictionPayload {
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

const createLeague = async (payload: ILeague): Promise<IUserLeagues> => {
  const user = await Auth.currentAuthenticatedUser();
  return API.post("tru-fan", "/create-league", {
    body: {
      ...payload,
      userId: user.attributes.email,
    },
  });
};

const getLeague = async (leagueName: string): Promise<ILeagueResult> => {
  return API.get("tru-fan", `/get-league/${leagueName}`, {
    headers: {},
  });
};

const getUserLeagues = async (): Promise<Array<ILeague>> => {
  const user = await Auth.currentAuthenticatedUser();
  return API.get("tru-fan", `/get-leagues/${user.attributes.email}`, {
    headers: {},
  });
};

const getLeagueMembers = async (
  tournament: string,
  leagueName: string
): Promise<IUserLeagueMembers> => {
  return API.get("tru-fan", `/get-league-members/${tournament}/${leagueName}`, {
    headers: {},
  });
};

const setLeagueMembers = async (
  tournament: string,
  leagueName: string,
  members: string[]
): Promise<IUserLeagueMembers> => {
  const user = await Auth.currentAuthenticatedUser();
  return API.post(
    "tru-fan",
    `/set-league-members/${tournament}/${leagueName}`,
    {
      body: {
        members,
        user: {
          name: user.attributes.given_name,
          email: user.attributes.email,
        },
      },
    }
  );
};

const getSurvivorPrediction = async (
  tournament: string,
  leagueName: string
) => {
  const user = await Auth.currentAuthenticatedUser();
  return API.get(
    "tru-fan",
    `/get-survivor-prediction/${tournament}/${leagueName}/${user.attributes.email}`,
    {
      headers: {},
    }
  ).catch((error) => {
    if (error.response.data.error.message === "No such Item exists") {
      return Promise.resolve({});
    }
  });
};

const setSurvivorPrediction = async (
  payload: ISurvivorPredictionPayload
): Promise<ISurvivorPredictionResult> => {
  const user = await Auth.currentAuthenticatedUser();
  return API.post(
    "tru-fan",
    `/set-survivor-prediction/${payload.tournament}/${payload.leagueName}/${user.attributes.email}`,
    {
      body: { predictions: payload.predictions },
    }
  );
};

const getPlayers = async (
  tournament: string,
  team: string
): Promise<IPlayerListResult> => {
  return API.get("tru-fan", `/get-players/${tournament}/${team}`, {
    headers: {},
  });
};

const getScore = async (
  tournament: string,
  leagueName: string
): Promise<IScoreResult> => {
  const user = await Auth.currentAuthenticatedUser();
  return API.get(
    "tru-fan",
    `/get-score/${tournament}/${leagueName}/${user.attributes.email}`,
    {
      headers: {},
    }
  );
};

const putScore = async (
  tournament: string,
  leagueName: string,
  score: IUserScore
): Promise<IScoreResult> => {
  const user = await Auth.currentAuthenticatedUser();
  return API.put(
    "tru-fan",
    `/update-score/${tournament}/${leagueName}/${user.attributes.email}`,
    {
      body: { score },
    }
  );
};

export default {
  create: createLeague,
  getLeague,
  getUserLeagues,
  getLeagueMembers,
  setLeagueMembers,
  getSurvivorPrediction,
  setSurvivorPrediction,
  getPlayers,
  getScore,
  putScore,
};
