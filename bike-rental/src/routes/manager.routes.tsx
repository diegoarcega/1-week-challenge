import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

const ManagerRoutes = ({ match }: RouteComponentProps): JSX.Element => {
  return (
    <Switch>
      <Route path={`${match.path}/manage`} exact>
        <p>* Create, Read, Edit, and Delete Bikes. * Create, Read, Edit, and Delete Users and Managers.</p>
      </Route>

      <Route path={`${match.path}/reservations`}>
        <p>
          * See all the users who reserved a bike, and the period of time they did it. * See all the bikes reserved by a
          user and the period of time they did it.
        </p>
      </Route>
      <Route>
        <p>not found</p>
      </Route>
    </Switch>
  );
};

export default ManagerRoutes;
