import React, { Dispatch, SetStateAction, useState, useRef } from 'react';
import clsx from 'clsx';
import { withStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import { IconButton, Menu, MenuItem, Popper, Grow, Paper, ClickAwayListener, MenuList } from '@material-ui/core';
import Button from '../components/Button';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import { Auth } from 'aws-amplify';
import { URL } from '../../../../Routes';

const styles = (theme: Theme) => ({
  title: {
    fontSize: 24,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    display: "flex",
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-start',
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
    },
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  hidden: {
    display: 'none',
  },
  show: {
    display: 'unset',
  },
  right: {
    flex: 1,
    display: "flex",
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
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
});

interface IAppAppBarProps {
  classes: any;
  appProps: {
    isAuthenticated: boolean;
    userHasAuthenticated: Dispatch<SetStateAction<boolean>>;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
  };
};

function AppAppBar(props: IAppAppBarProps) {
  const { classes, appProps } = props;
  const history = useHistory();
  const [isSettingOpen, openSettings] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    openSettings(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    openSettings(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
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
    appProps.userHasAuthenticated(false);
    history.push(URL.HOME);
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={e => appProps.toggleSidebar()}
              className={clsx(appProps.isAuthenticated && !appProps.isSidebarOpen ? classes.show : classes.hidden)}
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
            to={appProps.isAuthenticated ? URL.DASHBOARD : URL.HOME}
          >
            {'Tru Fan'}
          </Link>
          <div className={clsx(classes.right)}>
            <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={clsx(classes.rightLink, appProps.isAuthenticated && classes.hidden)}
              component={RouterLink}
              to={URL.SIGNIN}
            >
              {'Sign In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              className={clsx(classes.rightLink, classes.linkSecondary, appProps.isAuthenticated && classes.hidden)}
              component={RouterLink}
              to={URL.SIGNUP}
            >
              {'Sign Up'}
            </Link>
            <div>
              <IconButton
                ref={anchorRef}
                aria-controls={isSettingOpen ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className={clsx(classes.rightLink, !appProps.isAuthenticated && classes.hidden)}
              >
                <SettingsIcon/>
              </IconButton>
              <Popper open={isSettingOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={isSettingOpen} id="menu-list-grow" onKeyDown={handleListKeyDown}>
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
      <div className={classes.placeholder} />
    </div>
  );
}

export default withStyles(styles)(AppAppBar);