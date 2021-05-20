import { Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';

interface Props {
  title: string;
  // eslint-disable-next-line react/require-default-props
  action?: React.ReactNode;
}

export const CardHeader = (props: Props): JSX.Element => {
  const { title, action } = props;
  return (
    <Flex align="center" justify="space-between" px="6" py="4" borderBottomWidth="1px">
      <Heading as="h2" fontSize="lg">
        {title}
      </Heading>
      {action}
    </Flex>
  );
};