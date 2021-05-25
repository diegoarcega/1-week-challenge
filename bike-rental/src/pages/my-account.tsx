import React, { useState, useEffect } from 'react';

import { Box, Button, ButtonGroup, useToast } from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { editUser, EditUserInput, getUser } from 'services/user.service';
import { Card } from 'components/card/card';
import { CardHeader } from 'components/card/card.header';
import { CardContent } from 'components/card/card.content';
import { Property } from 'components/card/card.property';
import { User } from 'types/user.type';
import { Input } from 'components/input/input';
import { RequestStatus } from 'components/request-status/request-status';
import createRequiredSchema from 'validations/required';
import emailSchema from 'validations/email';
import { useUserStore } from 'stores/user.store';

type FormInput = Pick<User, 'name' | 'email' | 'roles'>;

const schema = yup.object().shape({
  name: createRequiredSchema('name'),
  email: emailSchema,
});

export const MyAccountPage = (): JSX.Element => {
  const [isEdit, setEdit] = useState(false);
  const userId = useUserStore((state) => state.user?.id) ?? '';
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const toast = useToast();

  const cacheKey = ['user', userId];

  const { data, error, isLoading } = useQuery<{ user: User }>(cacheKey, () => {
    return getUser(userId);
  });

  const { mutate, error: mutationError } = useMutation(
    ({ user }: { user: EditUserInput }) => {
      return editUser(user);
    },
    {
      onSuccess: (dataSuccess, { user }) => {
        setUser({
          ...user,
          roles: user.roles ? user.roles?.split(',') : [],
        });
        queryClient.setQueryData<{ user: EditUserInput } | undefined>(cacheKey, (oldData) => {
          return oldData
            ? {
                user,
              }
            : undefined;
        });
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (mutationError) {
      toast({
        title: 'Error',
        description: 'We could not process this request',
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

  const onSubmit: SubmitHandler<EditUserInput> = async (formData) => {
    mutate({
      user: {
        ...formData,
        id: userId,
      },
    });
    toggleEdit();
  };

  return (
    <RequestStatus isLoading={isLoading} error={error} data={data} noResultsMessage="No user with this ID was found">
      <Box as="section">
        <Card maxW="3xl" mx="auto" as="form" onSubmit={handleSubmit(onSubmit)}>
          <CardHeader
            title={data ? data.user?.name : ''}
            action={
              <ButtonGroup>
                <Button variant="outline" fontSize={{ base: 'xs', md: 'md' }} onClick={toggleEdit}>
                  {isEdit ? 'Cancel' : 'Edit'}
                </Button>

                {isEdit && (
                  <Button variant="solid" colorScheme="blue" type="submit" fontSize={{ base: 'xs', md: 'md' }}>
                    Save
                  </Button>
                )}
              </ButtonGroup>
            }
          />
          <CardContent>
            <Property
              label="Name"
              value={
                isEdit ? (
                  <Input
                    register={register}
                    name="name"
                    defaultValue={data?.user?.name}
                    error={errors?.name?.message}
                  />
                ) : (
                  data?.user?.name
                )
              }
            />
            <Property
              label="Email"
              value={
                isEdit ? (
                  <Input
                    register={register}
                    name="email"
                    defaultValue={data?.user?.email}
                    error={errors?.email?.message}
                    isReadOnly
                  />
                ) : (
                  data?.user?.email
                )
              }
            />
            <Property
              label="roles"
              value={
                isEdit ? (
                  <Input register={register} name="roles" isReadOnly defaultValue={getUserRoles(data)} />
                ) : (
                  getUserRoles(data)
                )
              }
            />
          </CardContent>
        </Card>
      </Box>
    </RequestStatus>
  );
};

function getUserRoles(data?: { user: User }): string | undefined {
  if (!data || !data.user) {
    return undefined;
  }

  return Array.isArray(data?.user.roles) ? data?.user.roles.join(',') : data?.user.roles;
}
