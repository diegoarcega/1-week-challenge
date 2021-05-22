import { Container, Heading } from '@chakra-ui/react';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import Navigation, { NavItem } from '../container/navigation.container';
import { ReservationsPage } from '../pages/user/reservations';
import { ReservePage } from '../pages/user/reserve';

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
      <Container maxW="container.xl" mt={{ base: '5', md: '10' }}>
        <Switch>
          <Route path={`${match.path}`} exact>
            <ReservePage />
            {/* <p>
              * See a list of all available bikes for some specific dates. * Filter by model, color, location, or rate
              averages. * Reserve a bike for a specific period of time. * Rate the bikes with a score of 1 to 5.
            </p> */}
          </Route>

          <Route path={`${match.path}/reservations`} exact>
            <ReservationsPage />
            {/* <p>* Cancel a reservation.</p> */}
          </Route>
          <Route>
            <Heading>Page not found</Heading>
          </Route>
        </Switch>
      </Container>
    </>
  );
};

export default UserRoutes;
