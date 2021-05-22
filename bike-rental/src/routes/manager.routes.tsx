import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import Navigation, { NavItem } from '../container/navigation.container';
import { UsersListPage } from '../pages/manager/manage/users/users-list';
import { UserDetailPage } from '../pages/manager/manage/users/user-detail';
import { BikesListPage } from '../pages/manager/manage/bikes/bikes-list';
import { ReservationsPage } from '../pages/manager/reservations/reservations';

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Manage',
    children: [
      {
        label: 'Users',
        subLabel: 'Create, Edit, and Delete Users',
        href: '/manager/manage/users',
      },
      {
        label: 'Bikes',
        subLabel: 'Create, Edit, and Delete Bikes',
        href: '/manager/manage/bikes',
      },
    ],
  },
  {
    label: 'Reservations',
    href: '/manager/reservations',
  },
];

const ManagerRoutes = ({ match }: RouteComponentProps): JSX.Element => {
  return (
    <>
      <Navigation options={NAV_ITEMS} />
      <Container maxW="container.xl" mt={{ base: '5', md: '10' }}>
        <Switch>
          <Route path={`${match.path}/manage/users`} exact>
            <UsersListPage />
          </Route>
          <Route path={`${match.path}/manage/users/:userId`} exact>
            <UserDetailPage />
          </Route>
          <Route path={`${match.path}/manage/bikes`} exact>
            <BikesListPage />
          </Route>

          <Route path={`${match.path}/reservations`}>
            <ReservationsPage />
          </Route>
          <Route>
            <p>not found</p>
          </Route>
        </Switch>
      </Container>
    </>
  );
};

export default ManagerRoutes;
