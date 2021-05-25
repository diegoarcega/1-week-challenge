/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useHistory, Link as LinkRouter } from 'react-router-dom';
import { Box, Button, Flex, Heading, Stack, Image, FormErrorMessage, FormControl, Text, Link } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import * as yup from 'yup';
import { Input } from 'components/input/input';
import emailSchema from 'validations/email';
import passwordSchema from 'validations/password';
import { login } from 'services/auth.service';
import * as Storage from 'utils/storage.util';
import { AUTHENTICATION_TOKEN_KEY } from 'constants/storage.constant';
import { useUserStore } from 'stores/user.store';
import jwtDecode from 'jwt-decode';
import { User } from 'types/user.type';

const schema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

interface FormInput {
  email: string;
  password: string;
  formError: string;
}

export const LoginPage = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const history = useHistory();
  const setUser = useUserStore((state) => state.setUser);

  const onSubmit: SubmitHandler<FormInput> = async ({ email, password }) => {
    try {
      clearErrors('formError');
      const { token } = await login({ email, password });
      const userFromToken = jwtDecode<{ data: User }>(token);
      const user = userFromToken.data;
      setUser(user);
      Storage.setItem(AUTHENTICATION_TOKEN_KEY, token);

      if (user.roles.includes('manager')) {
        history.push('/manager/manage/users');
        return;
      }

      history.push('/dashboard');
    } catch (e) {
      setError('formError', {
        type: 'manual',
        message: e.response.errors[0].message,
      });
    }
  };

  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={4} w="full" maxW="md">
          <Heading fontSize="6xl" color="blue.500" mb="3" fontWeight="black" letterSpacing="tighter">
            BikeWorld
          </Heading>
          <Heading fontSize="2xl">Sign in to your account</Heading>
          <Text>
            Don't have an account?{' '}
            <Link as={LinkRouter} to="/signup" color="blue.500">
              Sign up for free
            </Link>
          </Text>
          <Box py="8" px={{ base: '4', md: '10' }} shadow="base" rounded={{ sm: 'lg' }} bg="white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="6">
                <Input
                  name="email"
                  type="email"
                  register={register}
                  label="Email address"
                  error={errors.email?.message}
                />
                <Input
                  name="password"
                  type="password"
                  register={register}
                  label="Password"
                  error={errors.password?.message}
                />
                <ErrorMessage
                  errors={errors}
                  name="formError"
                  render={({ message }) => (
                    <FormControl isInvalid={!!message} mt="0">
                      <FormErrorMessage>{message}</FormErrorMessage>
                    </FormControl>
                  )}
                />

                <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
                  Sign in
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt="Login Image"
          objectFit="cover"
          maxHeight="100%"
          src="https://www.10wallpaper.com/wallpaper/1366x768/1710/BMW_motorrad_concept_Motorcycles_Wallpaper_1366x768.jpg"
        />
      </Flex>
    </Stack>
  );
};
