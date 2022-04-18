import "./App.css";
import "antd/dist/antd.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { createContext, useState } from "react";

import { CreateGame } from "./CreateGame";
import { CustomLayout } from "./Layout";
import { GamePage } from "./GamePage";
import { HomePage } from "./Home";
import { staticSeries } from "./utility/Contants";

export const GlobalProvider = createContext();

const CustomApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CustomLayout>
              <HomePage />
            </CustomLayout>
          }
        />
        <Route
          path="/new-game"
          element={
            <CustomLayout>
              <CreateGame />
            </CustomLayout>
          }
        />
        <Route
          path="/start-game/:game_name"
          element={
            <CustomLayout>
              <GamePage />
            </CustomLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  const [values, setValues] = useState({
    isAdmin: false,
    name: "",
    points: null,
    series: [...staticSeries],
    isGameStart: false,
    activeUsers: [],
    selectedSeries: "",
    isShowCount: false,
    isSelected: null, // for selecting the series
    gameOver:false
  });
  const updateGlobalData = (data) => {
    setValues((oldState) => ({ ...oldState, ...data }));
  };
  return (
    <GlobalProvider.Provider value={{ ...values, updateGlobalData }}>
      <CustomApp />
    </GlobalProvider.Provider>
  );
};

export default App;
