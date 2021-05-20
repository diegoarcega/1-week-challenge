import { Container } from '@chakra-ui/react';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import Navigation, { NavItem } from '../container/navigation.container';

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/dashboard',
  },
  {
    label: 'Reservations',
    href: '/dashboard/reservations',
  },
];

const UserRoutes = ({ match }: RouteComponentProps): JSX.Element => {
  return (
    <>
      <Navigation options={NAV_ITEMS} />
      <Container maxW="container.xl" mt="10">
        <Switch>
          <Route path={`${match.path}`} exact>
            <p>
              * See a list of all available bikes for some specific dates. * Filter by model, color, location, or rate
              averages. * Reserve a bike for a specific period of time. * Rate the bikes with a score of 1 to 5.
            </p>
          </Route>

          <Route path={`${match.path}/reservations`} exact>
            <p>* Cancel a reservation.</p>
          </Route>
          <Route>
            <p>not found</p>
          </Route>
        </Switch>
      </Container>
    </>
  );
};

export default UserRoutes;
