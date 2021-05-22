import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import {
  Box,
  Button,
  ButtonGroup,
  useToast,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  Text,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { editUser, getUser, deleteUser } from 'services/user.service';
import { Card } from 'components/card/card';
import { CardHeader } from 'components/card/card.header';
import { CardContent } from 'components/card/card.content';
import { Property } from 'components/card/card.property';
import { User } from 'types/user.type';
import { Input } from 'components/input/input';
import { RequestStatus } from 'components/request-status/request-status';

type FormInput = Pick<User, 'name' | 'email' | 'roles'>;

export const UserDetailPage = (): JSX.Element => {
  const [isEdit, setEdit] = useState(false);
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const history = useHistory();
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

  const { mutate: deleteUserMutate, error: deleteMutationError } = useMutation(
    (variables: { userId: User['id'] }) => {
      return deleteUser(variables.userId);
    },
    {
      onSuccess: (dataSuccess, variables) => {
        queryClient.setQueryData<{ users: User[] } | undefined>(['users'], (oldData) => {
          return oldData
            ? {
                users: oldData.users.filter((user) => user.id !== variables.userId),
              }
            : undefined;
        });
      },
    }
  );

  const { register, handleSubmit } = useForm<FormInput>();

  useEffect(() => {
    if (mutationError || deleteMutationError) {
      toast({
        title: 'Error',
        description: 'We could not process this request',
        duration: 5000,
        variant: 'top-accent',
        isClosable: true,
        status: 'error',
      });
    }
  }, [mutationError, deleteMutationError, toast]);

  function toggleEdit() {
    setEdit((_isEdit) => !_isEdit);
  }

  function handleDelete() {
    deleteUserMutate({ userId });
    history.goBack();
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

  return (
    <RequestStatus isLoading={isLoading} error={error} data={data} noResultsMessage="No user with this ID was found">
      <Box as="section">
        <Card maxW="3xl" mx="auto" as="form" onSubmit={handleSubmit(onSubmit)}>
          <CardHeader
            title={data ? data.user.name : ''}
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
                <Button variant="outline" fontSize={{ base: 'xs', md: 'md' }} onClick={toggleEdit}>
                  {isEdit ? 'Cancel' : 'Edit'}
                </Button>
                {isEdit && (
                  <Popover>
                    <PopoverTrigger>
                      <Button variant="outline" colorScheme="red" fontSize={{ base: 'xs', md: 'md' }}>
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmation!</PopoverHeader>
                      <PopoverBody>
                        <VStack>
                          <Text>Are you sure you want delete this user?</Text>
                          <Button colorScheme="red" onClick={handleDelete} variant="solid" isFullWidth>
                            Yes, delete this user
                          </Button>
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

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
                isEdit ? <Input register={register} name="name" defaultValue={data?.user.name} /> : data?.user.name
              }
            />
            <Property
              label="Email"
              value={
                isEdit ? <Input register={register} name="email" defaultValue={data?.user.email} /> : data?.user.email
              }
            />
            <Property
              label="roles"
              value={
                isEdit ? (
                  <Input register={register} name="roles" defaultValue={getUserRoles(data)} />
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
  if (!data) {
    return undefined;
  }

  return Array.isArray(data?.user.roles) ? data?.user.roles.join(',') : data?.user.roles;
}
