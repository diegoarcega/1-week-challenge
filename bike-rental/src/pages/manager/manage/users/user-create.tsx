import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { Box, Button, ButtonGroup, useToast, IconButton } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card } from 'components/card/card';
import { CardHeader } from 'components/card/card.header';
import { CardContent } from 'components/card/card.content';
import { Property } from 'components/card/card.property';
import { Input } from 'components/input/input';
import createRequiredSchema from 'validations/required';
import emailSchema from 'validations/email';
import passwordSchema from 'validations/password';
import { GraphQLError } from 'types/error.type';
import { User } from 'types/user.type';
import { CreateUser, createUser } from 'services/user.service';
import { useUserStore } from 'stores/user.store';

const schema = yup.object().shape({
  name: createRequiredSchema('name'),
  email: emailSchema,
  password: passwordSchema,
});

export const UserCreatePage = (): JSX.Element => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const toast = useToast();
  const userData = useUserStore((state) => state.user);
  const cacheKey = ['users', userData?.id];

  const {
    mutate,
    error: mutationError,
    data,
  } = useMutation(
    ({ user }: { user: CreateUser }) => {
      return createUser(user);
    },
    {
      onSuccess: (dataSuccess) => {
        const usersCached = queryClient.getQueryData<{ users: User[] }>(cacheKey);
        queryClient.setQueryData<{ users: User[] } | undefined>(cacheKey, () => {
          return {
            users: usersCached ? usersCached?.users.concat(dataSuccess.user) : [],
          };
        });
      },
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUser>({
    resolver: yupResolver(schema),
  });

  const errorMessage: string | undefined = (mutationError as GraphQLError)?.response?.errors[0].message;
  useEffect(() => {
    if (errorMessage) {
      toast({
        title: 'Error',
        description: errorMessage,
        duration: 5000,
        variant: 'top-accent',
        isClosable: true,
        status: 'error',
        position: 'bottom-right',
      });
    }
  }, [errorMessage, toast]);

  useEffect(() => {
    const newUserId: string | undefined = data?.user?.id;
    if (newUserId) {
      toast({
        title: 'User created!',
        duration: 5000,
        variant: 'top-accent',
        isClosable: true,
        status: 'success',
        position: 'bottom-right',
      });

      history.push(`/manager/manage/users/${newUserId}`);
    }
  }, [data, toast, history]);

  function handleBack() {
    history.push('/manager/manage/users');
  }

  const onSubmit: SubmitHandler<CreateUser> = (formData) => {
    mutate({
      user: formData,
    });
  };

  return (
    <Box as="section">
      <Card maxW="3xl" mx="auto" as="form" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          title="Create user"
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
              <Button variant="outline" fontSize={{ base: 'xs', md: 'md' }} onClick={handleBack}>
                Cancel
              </Button>

              <Button variant="solid" colorScheme="blue" type="submit" fontSize={{ base: 'xs', md: 'md' }}>
                Create
              </Button>
            </ButtonGroup>
          }
        />
        <CardContent>
          <Property
            label="Name"
            value={<Input register={register} name="name" placeholder="John Doe" error={errors?.name?.message} />}
          />
          <Property
            label="Email"
            value={<Input register={register} name="email" placeholder="john@doe.com" error={errors?.email?.message} />}
          />
          <Property label="Roles" value={<Input register={register} name="roles" placeholder="manager, admin" />} />
          <Property
            label="Password"
            value={<Input register={register} name="password" error={errors?.password?.message} />}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
