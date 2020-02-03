import React, { useState, useEffect } from 'react';
import './App.css';
import Routes from "./Routes";
import AppAppBar from './components/landing/modules/views/AppAppBar';
import { Auth } from 'aws-amplify';


const App: React.FC = () => {

  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isSidebarOpen, openSidebar] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  const toggleSidebar = () => openSidebar(!isSidebarOpen);

  const props = {isAuthenticated, userHasAuthenticated, isSidebarOpen, toggleSidebar};

  return (
    <div className="App">
      {!isAuthenticating &&
        <div>
          <AppAppBar { ...props } />
          <Routes { ...props } />
        </div>
      }
    </div>
  );
}

export default App;
