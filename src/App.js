import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { Auth } from './Auth';

function App() {
  return (
    <div className="App">
      {/*
        The Router component handles client-side navigation between
        the authentication and home pages. The basename has been
        removed since the app is intended to be run locally.
      */}
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/app" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;