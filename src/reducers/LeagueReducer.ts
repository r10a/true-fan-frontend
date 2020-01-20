import { cloneDeep } from 'lodash-es';

export const LEAGUE_ACTIONS = {
    RESET: "RESET"
};

const initialState = {
};

export type LeagueStore = typeof initialState;

export default (state = initialState, action: any) => {
    switch (action.type) {
        case LEAGUE_ACTIONS.RESET: {
            return cloneDeep(initialState);
        }
        default: return { ...state };
    }
};