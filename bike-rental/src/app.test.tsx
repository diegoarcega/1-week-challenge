import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderApp } from './tests/test.utils';
import App from './app';

describe('App', () => {
  test('Renders the app on the login page', () => {
    const { getByText } = renderApp(<App />);
    expect(getByText('Sign in to your account')).toBeInTheDocument();
  });

  test('Clicking on Signup takes user to create account page', () => {
    const { getByTestId, getByText } = renderApp(<App />);
    fireEvent.click(getByTestId('signup-link'));
    expect(getByText('Create my account')).toBeInTheDocument();
  });
});
