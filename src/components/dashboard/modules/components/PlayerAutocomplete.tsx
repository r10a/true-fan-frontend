import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IPlayerOption } from "./TeamSwitcher";
import LeagueAPI, { IPlayerListResult } from "../../../../api/LeagueAPI";
import { get, map } from "lodash-es";

interface IPlayerAutocompleteProps {
  value: IPlayerOption;
  tournament: string;
  leftTeam: string;
  rightTeam: string;
  disabled: boolean;
  wrong?: boolean;
  correct?: boolean;
  changeHandler: (e: object, value: IPlayerOption | null) => void;
}

// const useStyles = makeStyles(theme => ({
// }));

export default function PlayerAutocomplete(props: IPlayerAutocompleteProps) {
  const {
    leftTeam,
    rightTeam,
    changeHandler,
    value,
    tournament,
    disabled,
    wrong,
  } = props;
  const [players, setPlayers] = useState<IPlayerOption[]>([]);
  const [openPlayers, setOpenPlayers] = React.useState(false);
  const loading = openPlayers && players.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const leftPlayerResponse = await LeagueAPI.getPlayers(
        tournament,
        leftTeam
      );
      const rightPlayerResponse = await LeagueAPI.getPlayers(
        tournament,
        rightTeam
      );
      const players = [
        ..._playerResponseFormatter(leftPlayerResponse),
        ..._playerResponseFormatter(rightPlayerResponse),
      ];

      if (active) {
        setPlayers(players);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const _playerResponseFormatter = (playerResponse: IPlayerListResult) => {
    const { team, players } = get(playerResponse, "result.Item", {});
    return map(players, (player) => ({ team, player }));
  };

  useEffect(() => {
    if (!openPlayers) {
      setPlayers([]);
    }
  }, [openPlayers]);

  return (
    <React.Fragment>
      <Autocomplete
        options={players as IPlayerOption[]}
        getOptionLabel={(option) => option.player}
        renderOption={(option) => <span>{option.player}</span>}
        groupBy={(option) => option.team}
        open={openPlayers}
        onOpen={() => setOpenPlayers(true)}
        onClose={() => setOpenPlayers(false)}
        loading={loading}
        value={value}
        disabled={disabled}
        onChange={changeHandler}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Man of the Match"
            error={wrong}
            variant="outlined"
            placeholder="Man of the Match"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </React.Fragment>
  );
}
