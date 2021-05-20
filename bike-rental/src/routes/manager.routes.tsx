import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import Navigation, { NavItem } from '../container/navigation.container';
import { UsersListPage } from '../pages/manager/manage/users/users-list';
import { UserDetailPage } from '../pages/manager/manage/users/user-detail';

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
      <Container maxW="container.xl" mt="10">
        <Switch>
          <Route path={`${match.path}/manage`} exact>
            <p>* Create, Read, Edit, and Delete Bikes. * Create, Read, Edit, and Delete Users and Managers.</p>
          </Route>
          <Route path={`${match.path}/manage/users`} exact>
            <UsersListPage />
          </Route>
          <Route path={`${match.path}/manage/users/:id`} exact>
            <UserDetailPage />
          </Route>
          <Route path={`${match.path}/manage/bike`} exact>
            <p>* Create, Read, Edit, and Delete Bikes.</p>
          </Route>

          <Route path={`${match.path}/reservations`}>
            <p>
              * See all the users who reserved a bike, and the period of time they did it. * See all the bikes reserved
              by a user and the period of time they did it.
            </p>
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
