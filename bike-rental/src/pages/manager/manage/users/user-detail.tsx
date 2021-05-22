import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiPencilAlt } from 'react-icons/hi';
import { IoIosArrowBack } from 'react-icons/io';
import {
  Box,
  Button,
  ButtonGroup,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { editUser, getUser } from 'services/user.service';
import { Card } from 'components/card/card';
import { CardHeader } from 'components/card/card.header';
import { CardContent } from 'components/card/card.content';
import { Property } from 'components/card/card.property';
import { User } from 'types/user.type';
import { Input } from 'components/input/input';

type FormInput = Pick<User, 'name' | 'email' | 'roles'>;

export const UserDetailPage = (): JSX.Element => {
  const [isEdit, setEdit] = useState(false);
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const cacheKey = ['user', userId];

  const { data, error, isLoading } = useQuery<{ user: User }>(cacheKey, () => {
    return getUser(userId);
  });
  const { mutate, error: mutationError } = useMutation(
    ({ user }: { user: User }) => {
      return editUser(user);
    },
    {
      onSuccess: (dataSuccess, { user }) => {
        queryClient.setQueryData<{ user: User } | undefined>(cacheKey, (oldData) => {
          return oldData
            ? {
                user,
              }
            : undefined;
        });
      },
    }
  );
  const { register, handleSubmit } = useForm<FormInput>();

  useEffect(() => {
    if (mutationError) {
      toast({
        title: 'Error',
        description: 'We could not process this request to edit this user',
        duration: 5000,
        variant: 'top-accent',
        isClosable: true,
        status: 'error',
      });
    }
  }, [mutationError, toast]);

  function toggleEdit() {
    setEdit((_isEdit) => !_isEdit);
  }

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    mutate({
      user: {
        ...formData,
        id: userId,
      },
    });
    toggleEdit();
  };

  if (isLoading) {
    return <h1>'loading'</h1>;
  }

  if (!data) {
    return <h1>'nothing'</h1>;
  }

  if (error) {
    return <h1>'error'</h1>;
  }

  const { name, email, roles } = data.user;
  const rolesValue = Array.isArray(roles) ? roles.join(',') : roles;
  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    <Box as="section">
      <Card maxW="3xl" mx="auto" as="form" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          title={name}
          prefix={
            <IconButton
              aria-label="navigate back"
              as={Link}
              to="/manager/manage/users"
              variant="outline"
              icon={<IoIosArrowBack />}
              fontSize={{ base: 'xs', md: 'md' }}
            />
          }
          action={
            <ButtonGroup>
              {isEdit && (
                <Button variant="solid" colorScheme="green" type="submit" fontSize={{ base: 'xs', md: 'md' }}>
                  Save
                </Button>
              )}
              <Button variant="outline" fontSize={{ base: 'xs', md: 'md' }} onClick={toggleEdit}>
                {isEdit ? 'Cancel' : 'Edit'}
              </Button>
            </ButtonGroup>
          }
        />
        <CardContent>
          <Property
            label="Name"
            value={isEdit ? <Input register={register} name="name" defaultValue={name} /> : name}
          />
          <Property
            label="Email"
            value={isEdit ? <Input register={register} name="email" defaultValue={email} /> : email}
          />
          <Property
            label="roles"
            value={isEdit ? <Input register={register} name="roles" defaultValue={rolesValue} /> : rolesValue}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
