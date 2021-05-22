import { Center, Spinner } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import { LoginPage } from '../pages/login';
import { CreateAccountPage } from '../pages/signup';

const ManagerRoutesLazy = React.lazy(() => import(/* webpackChunkName: "ManagerRoutes" */ './manager.routes'));
const UserRoutesLazy = React.lazy(() => import(/* webpackChunkName: "UserRoutes" */ './user.routes'));

const LoadingFallback = () => (
  <Center height="100vh">
    <Spinner size="xl" color="green.500" />
  </Center>
);

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
        <Route path="/signup" exact>
          <CreateAccountPage />
        </Route>
        <Route
          path="/manager"
          render={(props: RouteComponentProps) => (
            <Suspense fallback={<LoadingFallback />}>
              <ManagerRoutesLazy history={props.history} location={props.location} match={props.match} />
            </Suspense>
          )}
        />
        <Route
          path="/dashboard"
          render={(props: RouteComponentProps) => (
            <Suspense fallback={LoadingFallback}>
              <UserRoutesLazy history={props.history} location={props.location} match={props.match} />
            </Suspense>
          )}
        />
        <Route>
          <p>not found</p>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export { Routes };
