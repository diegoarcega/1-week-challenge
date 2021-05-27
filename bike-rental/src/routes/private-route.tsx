import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useUserStore } from 'stores/user.store';

interface PrivateRouteProps extends RouteProps {
  allowedRoles: string[];
}

const PrivateRoute = ({ render, allowedRoles, ...rest }: PrivateRouteProps): JSX.Element => {
  const userRoles = useUserStore((state) => state.user?.roles);
  const isAllowed = userRoles?.some((role) => allowedRoles.includes(role));
  if (!isAllowed) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return <Route {...rest} render={render} />;
};

export { PrivateRoute };
