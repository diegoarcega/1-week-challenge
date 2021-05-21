import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiPencilAlt } from 'react-icons/hi';
import { Box, Button, useColorModeValue } from '@chakra-ui/react';
import { request, gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { Card } from '../../../../components/card/card';
import { CardHeader } from '../../../../components/card/card.header';
import { CardContent } from '../../../../components/card/card.content';
import { Property } from '../../../../components/card/card.property';
import { config } from '../../../../config/config';
import { User } from '../../../../types/user.type';

export const UserDetailPage = (): JSX.Element => {
  const [isEdit] = useState(true);
  const { userId } = useParams<{ userId: string }>();
  const { data, error, isLoading } = useQuery<{ user: User }>(['user', userId], () => {
    return request(
      config.baseApiUrl,
      gql`
        query GetUser($userId: String!) {
          user {
            id
            name
            email
            roles
          }
        }
      `,
      {
        userId,
      }
    );
  });

  if (isLoading) {
    return <h1>'loading'</h1>;
  }

  if (!data) {
    return <h1>'nothing'</h1>;
  }

  if (error) {
    return <h1>'error'</h1>;
  }
  console.log({ data, error });
  const { id, name, email, roles } = data.user;

  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    <Box as="section" bg={useColorModeValue('gray.100', 'inherit')}>
      <Card maxW="3xl" mx="auto">
        <CardHeader
          title={name}
          action={
            isEdit ? (
              <Button variant="solid" minW="20">
                Save
              </Button>
            ) : (
              <Button variant="outline" minW="20" leftIcon={<HiPencilAlt />}>
                Edit {id}
              </Button>
            )
          }
        />
        <CardContent>
          <Property label="Name" value={name} />
          <Property label="Email" value={email} />
          <Property label="roles" value={roles.join(',')} />
        </CardContent>
      </Card>
    </Box>
  );
};
