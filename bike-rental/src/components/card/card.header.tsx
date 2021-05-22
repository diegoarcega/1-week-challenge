import { Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';

interface Props {
  title: string;
  // eslint-disable-next-line react/require-default-props
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
