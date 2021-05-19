import React, { FunctionComponent } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

const UserRoutes: FunctionComponent<RouteComponentProps> = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/bikes" exact>
        <p>
          * See a list of all available bikes for some specific dates. * Filter by model, color, location, or rate
          averages. * Reserve a bike for a specific period of time. * Rate the bikes with a score of 1 to 5.
        </p>
      </Route>

      <Route path="/reservations">
        <p>* Cancel a reservation.</p>
      </Route>
      <Route>
        <p>not found</p>
      </Route>
    </Switch>
  );
};

export default UserRoutes;
