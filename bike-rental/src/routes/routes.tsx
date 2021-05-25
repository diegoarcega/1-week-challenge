import { Center, Spinner } from '@chakra-ui/react';
import { MyAccountPage } from 'pages/my-account';
import React, { Suspense } from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import { LoginPage } from '../pages/login';
import { CreateAccountPage } from '../pages/signup';
import Authenticated from './authenticated.route';

const ManagerRoutesLazy = React.lazy(() => import(/* webpackChunkName: "ManagerRoutes" */ './manager.routes'));
const UserRoutesLazy = React.lazy(() => import(/* webpackChunkName: "UserRoutes" */ './user.routes'));

const LoadingFallback = () => (
  <Center height="100vh">
    <Spinner size="xl" color="blue.500" />
  </Center>
);

const Routes = (): JSX.Element => {
  return (
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
            <Authenticated>
              <ManagerRoutesLazy history={props.history} location={props.location} match={props.match} />
            </Authenticated>
          </Suspense>
        )}
      />
      <Route
        path="/dashboard"
        render={(props: RouteComponentProps) => (
          <Suspense fallback={<LoadingFallback />}>
            <Authenticated>
              <UserRoutesLazy history={props.history} location={props.location} match={props.match} />
            </Authenticated>
          </Suspense>
        )}
      />
      <Route>
        <p>not found</p>
      </Route>
    </Switch>
  );
};

export { Routes };
