import React from 'react';
import { Center, Spinner, Text } from '@chakra-ui/react';

interface RequestStatusProps {
  data: unknown;
  isLoading: boolean;
  error?: unknown;
  noResultsMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
  children: JSX.Element | null;
}
const RequestStatus = ({
  data,
  isLoading,
  error,
  children,
  noResultsMessage,
  errorMessage,
}: RequestStatusProps): RequestStatusProps['children'] => {
  if (isLoading) {
    return (
      <Center>
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <>
        {errorMessage || (
          <Text fontSize="4xl" colorScheme="red">
            Something went wrong
          </Text>
        )}
      </>
    );
  }

  if (!data || (Array.isArray(data) && !data.length)) {
    return (
      <>
        {noResultsMessage || (
          <Text fontSize="4xl" colorScheme="green">
            No results
          </Text>
        )}
      </>
    );
  }

  return children;
};

export { RequestStatus };
