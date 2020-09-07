import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Intro from "./modules/components/Intro";
import JumboButton from "./modules/components/JumboButton";
import { URL } from "../../Routes";
import CreateLeagueDialog from "./modules/components/CreateLeagueDialog";
import { cloneDeep, isEmpty, reduce, noop } from "lodash-es";
import { check } from "../landing/modules/form/validation";
import LeagueAPI, { ILeague } from "../../api/LeagueAPI";
import { LEAGUE_ACTIONS } from "../../reducers/LeagueReducer";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  leaguesSection: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

interface IDashboardProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (isAuthenticated: boolean) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  history: any;
}

export function CreateLeagueDialogContainer(props: {
  isCreateOpen: boolean;
  openCreate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const { isCreateOpen, openCreate } = props;

  const [formFields, setFormField] = useState({
    leagueName: "",
    description: "",
  });

  const [helperTexts, setHelperText] = useState({
    leagueName: "",
    description: "",
  });

  const fields = [
    { id: "leagueName", label: "League Name" },
    { id: "description", label: "Description" },
    // { id: "leagueType", label: "Type" },
  ];

  const validate = () => {
    const errors = cloneDeep(helperTexts);
    check(isEmpty(formFields.leagueName), "leagueName", "Required", errors);
    check(
      !/^[A-Za-z0-9-]*$/.test(formFields.leagueName.trim()) ||
        formFields.leagueName.trim().length > 20,
      "leagueName",
      "Only less than 20 characters, numbers, and dashes allowed",
      errors
    );

    setHelperText(errors);
    return reduce(
      errors,
      (acc, value) => {
        return acc && isEmpty(value);
      },
      true
    );
  };

  const createLeague = async (tournament: string) => {
    if (validate()) {
      const payload: ILeague = {
        ...formFields,
        tournament,
        totalPowerPlayPoints: 3000,
        userId: "", // will be set later in LeagueAPI
      };
      LeagueAPI.create(payload)
        .then(() => {
          openCreate(false);
          dispatch({ type: LEAGUE_ACTIONS.GET_USER_LEAGUES });
        })
        .catch((err) => {
          const errors = cloneDeep(helperTexts);
          if (err.response.data.error.message === "Already Exists") {
            check(
              true,
              "leagueName",
              "League already exists! Please choose a different name.",
              errors
            );
          } else {
            check(
              true,
              "leagueName",
              "Something went wrong! Please try again.",
              errors
            );
          }
          setHelperText(errors);
          console.log(err.response.data.error.message);
        });
    }
  };

  return (
    <CreateLeagueDialog<{ leagueName: string; description: string }>
      open={isCreateOpen}
      fields={fields}
      formFields={formFields}
      setFormField={setFormField}
      helperTexts={helperTexts}
      handleClose={() => openCreate(false)}
      handleSubmit={createLeague}
      type={"IPL-2020"}
    />
  );
}

export default function CreateLeague(props: IDashboardProps) {
  if (!props.isAuthenticated) props.history.push(URL.HOME);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isCreateOpen, openCreate] = useState(false);

  // constructor and destructor
  useEffect(() => {
    const getUserLeagues = async () => {
      dispatch({ type: LEAGUE_ACTIONS.GET_USER_LEAGUES });
    };
    getUserLeagues();
    return function cleanup() {
      dispatch({ type: LEAGUE_ACTIONS.RESET });
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.mainGrid}>
        <main>
          <Intro
            title="Create a League"
            description=""
            image="https://source.unsplash.com/oDs_AxeR5g4"
            imgText="main image description"
            linkText=""
          />
          <Grid container spacing={4}>
            <JumboButton
              title="IPL-2020"
              description=""
              image="https://source.unsplash.com/ghxL3qOfkPo"
              imgText="main image description"
              onClick={() => openCreate(true)}
            />
            <JumboButton
              title="More coming soon"
              description=""
              image="https://source.unsplash.com/ghxL3qOfkPo"
              imgText="main image description"
              onClick={noop}
            />
            {/* <JumboButton
              title="Public Leagues coming soon"
              description=""
              image="https://source.unsplash.com/mUtQXjjLPbw"
              imgText="main image description"
              onClick={() => console.log("Join public")}
            /> */}
          </Grid>
          <CreateLeagueDialogContainer
            isCreateOpen={isCreateOpen}
            openCreate={openCreate}
          />
        </main>
      </Container>
    </React.Fragment>
  );
}
