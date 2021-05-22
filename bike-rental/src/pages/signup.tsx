/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { useHistory, Link as LinkRouter } from 'react-router-dom';
import { Box, Button, Flex, Heading, Stack, Image, FormErrorMessage, FormControl, Text, Link } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import * as yup from 'yup';
import { Input } from '../components/input/input';
import emailSchema from '../validations/email';
import emailConfirmationSchema from '../validations/confirm-email';
import passwordSchema from '../validations/password';
import passwordConfirmationSchema from '../validations/confirm-password';
import { createAccount } from '../services/auth.service';
import createRequiredSchema from '../validations/required';

const schema = yup.object().shape({
  name: createRequiredSchema('name'),
  email: emailSchema,
  emailConfirmation: emailConfirmationSchema,
  password: passwordSchema,
  passwordConfirmation: passwordConfirmationSchema,
});

interface FormInput {
  name: string;
  email: string;
  emailConfirmation: string;
  password: string;
  passwordConfirmation: string;
  formError: string;
}

export const CreateAccountPage = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });
  const history = useHistory();

  const onSubmit: SubmitHandler<FormInput> = async ({ email, password, name }) => {
    try {
      clearErrors('formError');
      await createAccount({ email, password, name });

      history.push('/dashboard');
    } catch (e) {
      setError('formError', {
        type: 'manual',
        message: e.message,
      });
    }
  };

  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }} bg="green.500">
      <Flex flex={1}>
        <Image
          alt="Login Image"
          objectFit="cover"
          maxHeight="100%"
          src="https://gumlet.assettype.com/bloombergquint%2F2020-08%2Fcdfaedf9-42e9-452a-9c08-817a9dac38a7%2Fbicycle.jpg?rect=288%2C0%2C3635%2C2617&auto=format%2Ccompress&w=1200"
        />
      </Flex>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={1} w="full" maxW="md">
          <Heading fontSize="5xl" fontWeight="black" letterSpacing="tighter" color="green.50">
            TRECK
          </Heading>
          <Text color="green.50">A few clicks away from creating your ticket to freedom</Text>
          <Box py="8" px={{ base: '4', md: '10' }} shadow="base" rounded={{ sm: 'lg' }} bg="white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="6">
                <Input name="name" register={register} label="Name" isRequired error={errors.name?.message} />
                <Input
                  name="email"
                  type="email"
                  register={register}
                  label="Email address"
                  isRequired
                  error={errors.email?.message}
                />
                <Input
                  name="emailConfirmation"
                  type="email"
                  register={register}
                  label="Confirm email address"
                  isRequired
                  error={errors.emailConfirmation?.message}
                />
                <Input
                  name="password"
                  type="password"
                  register={register}
                  label="Password"
                  isRequired
                  error={errors.password?.message}
                />
                <Input
                  name="passwordConfirmation"
                  type="password"
                  register={register}
                  label="Confirm password"
                  isRequired
                  error={errors.passwordConfirmation?.message}
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
                  Create my account
                </Button>

                <Text>
                  Already have an account?
                  <Link as={LinkRouter} to="/login" color="blue.500">
                    Log in
                  </Link>
                </Text>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </Stack>
  );
};
