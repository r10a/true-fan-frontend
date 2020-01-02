import React from 'react';
import './App.css';
import Routes from "./Routes";
import AppAppBar from './components/landing/modules/views/AppAppBar';

const App: React.FC = () => {
  return (
    <div className="App">
      <AppAppBar />
      <Routes />
    </div>
  );
}

export default App;
