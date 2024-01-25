import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AppBar from "./components/appbar";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Welcome from './pages/welcome'
import "./App.css";
import { BACKEND_LINK } from './backend-link';
import axios from "axios";

const check_login_url = `${BACKEND_LINK}api/profile`;

const App = () => {

  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  const CHECK_LOGIN = () => {
      const check_login = async () => {
          const USER = await JSON.parse(localStorage.getItem("USER"));
          if (!USER) return;
          const res = await axios.get(check_login_url, { headers: { Authorization: USER.token } });
          if (res.data.status === "SUCCESS") {
              setLogin(true);
              setUser(USER);
          }
      }
  
      check_login();
  }

  useEffect(() => {
    CHECK_LOGIN()
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <AppBar
        login={login}
        setLogin={setLogin}
        user={user}
        setUser={setUser}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Welcome login={login} user={user} />
          }
        />

        <Route
          exact
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
              login={login}
              setLogin={setLogin}
            />
          }
        />

        <Route exact path="/signup" element={<SignUp />} />
      </Routes>
    </>
  )
};

export default App;
