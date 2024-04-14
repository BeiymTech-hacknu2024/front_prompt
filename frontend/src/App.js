import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LogIn from "./components/LogIn";
import Main from "./components/Main";
import { NotFound } from "./components/NotFound";
import Register from "./components/Register";

function App() {
  useEffect(() => {
    const screenRes = {
      width: window.screen.width,
      height: window.screen.height,
    };
    localStorage.setItem("screenRes", JSON.stringify(screenRes));
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Main}></Route>
          <Route path="/login" Component={LogIn}></Route>
          <Route path="/register" Component={Register}></Route>
          <Route path="*" Component={NotFound}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
