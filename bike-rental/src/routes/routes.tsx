import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LoginPage } from '../pages/login';

const Routes = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Redirect to="login" />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/manager">
          <p>I'm manager</p>
        </Route>
        <Route path="/dashboard">
          <p>I'm dashboard</p>
        </Route>
        <Route>
          <p>not found</p>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export { Routes };
