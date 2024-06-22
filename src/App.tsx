import React from "react";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="main-content">
          <Outlet />
        </div>
      </header>
    </div>
  );
}

export default App;
