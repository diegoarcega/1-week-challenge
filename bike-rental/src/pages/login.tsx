/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Box, Heading, Button, chakra, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import logo from '../logo.svg';

export const LoginPage = (): JSX.Element => {
  return (
    <Box minH="100vh" py="12" px={{ base: '4', lg: '8' }}>
      <Box maxW="md" mx="auto">
        <Box mx="auto" h="12" mb="10">
          <chakra.img src={logo} alt="bike-rental" maxHeight="100%" />
        </Box>
        <Heading textAlign="center" size="xl" fontWeight="extrabold" mb="10">
          Log in to your account
        </Heading>
        <Box py="8" px={{ base: '4', md: '10' }} shadow="base" rounded={{ sm: 'lg' }} bg="white">
          <chakra.form
            onSubmit={(e) => {
              e.preventDefault();
              // your login logic here
            }}
          >
            <Stack spacing="6">
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input name="email" type="email" autoComplete="email" required />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input name="password" type="password" autoComplete="password" required />
              </FormControl>

              <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
                Log in
              </Button>
            </Stack>
          </chakra.form>
        </Box>
      </Box>
    </Box>
  );
};
