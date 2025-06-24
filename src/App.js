import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">SmartCharge AI - EV Charging Demand Dashboard</h1>
      <Dashboard />
    </div>
  );
}

export default App;
