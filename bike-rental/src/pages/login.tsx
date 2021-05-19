import React, { FormEvent, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Image } from '@chakra-ui/react';

export const LoginPage = (): JSX.Element => {
  const history = useHistory();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    history.push('/manager/manage');
  }

  return (
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={4} w="full" maxW="md">
          <Heading fontSize="6xl" color="green.300" mb="3" fontWeight="black" letterSpacing="tighter">
            TRECK
          </Heading>
          <Heading fontSize="2xl">Sign in to your account</Heading>
          <Box py="8" px={{ base: '4', md: '10' }} shadow="base" rounded={{ sm: 'lg' }} bg="white">
            <form onSubmit={handleSubmit}>
              <Stack spacing="6">
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" ref={emailRef} />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input type="password" ref={passwordRef} />
                </FormControl>
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
