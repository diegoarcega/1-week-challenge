import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderApp } from 'tests/test.utils';
import { LoginPage } from './login';
import App from '../app';

describe('Login', () => {
  test('validate password and email showing error', async () => {
    const { getByText, getByTestId, findByText } = renderApp(<LoginPage />);
    expect(getByText('Sign in to your account')).toBeInTheDocument();

    fireEvent.change(getByTestId('email-field'), { target: { value: 'john@gmail.com' } });
    fireEvent.change(getByTestId('password-field'), { target: { value: '22222222' } });
    fireEvent.submit(getByTestId('sign-in-button'));

    expect(await findByText('Invalid email or password')).toBeVisible();
  });

  test('allow user to enter the app if credentials are correct', async () => {
    const { getByText, getByTestId, findByText } = renderApp(<App />);
    expect(getByText('Sign in to your account')).toBeInTheDocument();

    fireEvent.change(getByTestId('email-field'), { target: { value: 'diego.normal@gmail.com' } });
    fireEvent.change(getByTestId('password-field'), { target: { value: '11111111' } });
    fireEvent.submit(getByTestId('sign-in-button'));

    expect(await findByText('Diego Normal')).toBeInTheDocument();
  });
});
