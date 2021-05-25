import { Container, Heading } from '@chakra-ui/react';
import { MyAccountPage } from 'pages/my-account';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import Navigation, { NavItem } from '../container/navigation.container';
import { MyReservationsPage } from '../pages/user/my-reservations';
import { OpenReservationsPage } from '../pages/user/open-reservations/open-reservations';

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
      <Container maxW="container.xl" mt={{ base: '5', md: '10' }} pb="20">
        <Switch>
          <Route path={`${match.path}`} exact>
            <OpenReservationsPage />
          </Route>

          <Route path={`${match.path}/reservations`} exact>
            <MyReservationsPage />
          </Route>

          <Route path={`${match.path}/my-account`} exact>
            <MyAccountPage />
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
