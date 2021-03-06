/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/login/LoginPage";
import MoviesPage from '../pages/movies/MoviesPage'
import PrivateRoute from "../pages/privateAuth/privateAuth";

export default () => {
  return (
    <Router>
      <App>
        <Switch>
        <PrivateRoute  path="/movies" >
          <MoviesPage/>
          </PrivateRoute>
        <Route path="/" component={LoginPage} />
        </Switch>
      </App>
    </Router>
  );
};
