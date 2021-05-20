import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiPencilAlt } from 'react-icons/hi';
import { Box, Button, useColorModeValue } from '@chakra-ui/react';
import { Card } from '../../../../components/card/card';
import { CardHeader } from '../../../../components/card/card.header';
import { CardContent } from '../../../../components/card/card.content';
import { Property } from '../../../../components/card/card.property';

export const UserDetailPage = (): JSX.Element => {
  const [isEdit] = useState(true);
  const { id } = useParams<{ id: string }>();

  return (
    <Box as="section" bg={useColorModeValue('gray.100', 'inherit')}>
      <Card maxW="3xl" mx="auto">
        <CardHeader
          title="Diego Arcega"
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
          <Property label="Name" value="Diego" />
          <Property label="Email" value="diego@gmail.com" />
          <Property label="roles" value="manager" />
        </CardContent>
      </Card>
    </Box>
  );
};
