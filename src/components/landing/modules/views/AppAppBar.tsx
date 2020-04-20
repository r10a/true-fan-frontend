import React, { useState, useRef } from "react";
import clsx from "clsx";
import Link from "@material-ui/core/Link";
import { Link as RouterLink, useHistory } from "react-router-dom";
import AppBar from "../components/AppBar";
import Toolbar, { styles as toolbarStyles } from "../components/Toolbar";
import {
  IconButton,
  MenuItem,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import SportsCricketIcon from "@material-ui/icons/SportsCricket";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Auth } from "aws-amplify";
import { URL } from "../../../../Routes";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 24,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    display: "flex",
    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-start",
    },
    [theme.breakpoints.up("md")]: {
      justifyContent: "center",
    },
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  hidden: {
    display: "none",
  },
  show: {
    display: "unset",
  },
  right: {
    flex: 1,
    display: "flex",
    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-end",
    },
    [theme.breakpoints.up("md")]: {
      justifyContent: "center",
    },
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  nested: {
    paddingLeft: theme.spacing(5),
  },
}));

interface IAppAppBarProps {
  isAuthenticated: boolean;
  userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  admin: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}
/**
 * Main app bar which appears as website header
 *
 * @export
 * @param {IAppAppBarProps} props
 * @return {JSX.Element} React component
 */
export default function AppAppBar(props: IAppAppBarProps) {
  const classes = useStyles();
  const history = useHistory();
  const [isSettingOpen, openSettings] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    openSettings((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    openSettings(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      openSettings(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(isSettingOpen);
  React.useEffect(() => {
    if (prevOpen.current === true && isSettingOpen === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = isSettingOpen;
  }, [isSettingOpen]);

  const handleLogout = async (event: React.MouseEvent<EventTarget>) => {
    handleClose(event);
    await Auth.signOut();
    props.userHasAuthenticated(false);
    props.setIsAdmin(false);
    history.push(URL.HOME);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={(e) => props.toggleSidebar()}
              className={clsx(
                props.isAuthenticated && !props.isSidebarOpen
                  ? classes.show
                  : classes.hidden
              )}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            className={classes.title}
            component={RouterLink}
            to={props.isAuthenticated ? URL.DASHBOARD.HOME : URL.HOME}
          >
            {"Tru Fan"}
          </Link>
          <div className={clsx(classes.right)}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={clsx(
                classes.rightLink,
                props.isAuthenticated && classes.hidden
              )}
              component={RouterLink}
              to={URL.SIGNIN}
            >
              {"Sign In"}
            </Link>
            <div>
              <IconButton
                ref={anchorRef}
                aria-controls={isSettingOpen ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className={clsx(
                  classes.rightLink,
                  !props.isAuthenticated && classes.hidden
                )}
              >
                <SettingsIcon />
              </IconButton>
              <Popper
                open={isSettingOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={isSettingOpen}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                          {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !props.isSidebarOpen && classes.drawerPaperClose
          ),
        }}
        open={props.isSidebarOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={props.toggleSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List component="nav" aria-labelledby="dashboard-sidebar">
          <ListItem
            button
            onClick={() => {
              history.push(URL.DASHBOARD.HOME);
              props.toggleSidebar();
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              history.push(URL.DASHBOARD.IPL);
              props.toggleSidebar();
            }}
          >
            <ListItemIcon>
              <SportsCricketIcon />
            </ListItemIcon>
            <ListItemText primary="IPL" />
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.placeholder} />
    </>
  );
}
