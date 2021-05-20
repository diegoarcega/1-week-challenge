/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Flex, Heading, Stack, Image, FormErrorMessage, FormControl } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import * as yup from 'yup';
import { Input } from '../components/input/input';
import emailSchema from '../validations/email';
import passwordSchema from '../validations/password';
import { login } from '../services/auth.service';

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
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const history = useHistory();

  const onSubmit: SubmitHandler<FormInput> = async ({ email, password }) => {
    try {
      clearErrors('formError');
      const user = await login({ email, password });

      if (user.roles.includes('manager')) {
        history.push('/manager');
        return;
      }

      history.push('/dashboard');
    } catch (e) {
      setError('formError', {
        type: 'manual',
        message: e.message,
      });
    }
  };

  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={4} w="full" maxW="md">
          <Heading fontSize="6xl" color="green.300" mb="3" fontWeight="black" letterSpacing="tighter">
            TRECK
          </Heading>
          <Heading fontSize="2xl">Sign in to your account</Heading>
          <Box py="8" px={{ base: '4', md: '10' }} shadow="base" rounded={{ sm: 'lg' }} bg="white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="6">
                <Input
                  name="email"
                  type="email"
                  control={control}
                  label="Email address"
                  isRequired
                  error={errors.email?.message}
                />
                <Input
                  name="password"
                  type="password"
                  control={control}
                  label="Password"
                  isRequired
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

                <Button type="submit" colorScheme="green" size="lg" fontSize="md">
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
          maxHeight="100vh"
          src="https://gumlet.assettype.com/bloombergquint%2F2020-08%2Fcdfaedf9-42e9-452a-9c08-817a9dac38a7%2Fbicycle.jpg?rect=288%2C0%2C3635%2C2617&auto=format%2Ccompress&w=1200"
        />
      </Flex>
    </Stack>
  );
};
