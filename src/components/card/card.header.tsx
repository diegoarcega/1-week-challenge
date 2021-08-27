import * as React from 'react';
import { Flex, Heading } from '@chakra-ui/react';

interface Props {
  title: string;
  prefix?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = (props: Props): JSX.Element => {
  const { title, action, prefix } = props;
  return (
    <Flex align="center" justify="space-between" px="6" py="4" borderBottomWidth="1px">
      {prefix}
      <Heading as="h2" fontSize={['sm', 'md']} display={['none', 'block']}>
        {title}
      </Heading>
      {action}
    </Flex>
  );
};
