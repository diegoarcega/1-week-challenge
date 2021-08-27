import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { Box, Button, ButtonGroup, useToast, IconButton, Select } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card } from 'components/card/card';
import { CardHeader } from 'components/card/card.header';
import { CardContent } from 'components/card/card.content';
import { Property } from 'components/card/card.property';
import { Input } from 'components/input/input';
import { CreateBikeInput, createBike } from 'services/bike.service';
import createRequiredSchema from 'validations/required';
import { GraphQLError } from 'types/error.type';
import { Bike } from 'types/bike.type';
import { useUserStore } from 'stores/user.store';

const schema = yup.object().shape({
  model: createRequiredSchema('model'),
  color: createRequiredSchema('color'),
  location: createRequiredSchema('location'),
  status: createRequiredSchema('status'),
});

export const BikeCreatePage = (): JSX.Element => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const toast = useToast();
  const user = useUserStore((state) => state.user);
  const cacheKey = ['bikes', user?.id];

  const {
    mutate,
    error: mutationError,
    data,
  } = useMutation(
    ({ bike }: { bike: CreateBikeInput }) => {
      return createBike(bike);
    },
    {
      onSuccess: (dataSuccess) => {
        const bikesCached = queryClient.getQueryData<{ bikes: Bike[] }>(cacheKey);
        queryClient.setQueryData<{ bikes: Bike[] } | undefined>(cacheKey, () => {
          return {
            bikes: bikesCached ? bikesCached?.bikes.concat(dataSuccess.bike) : [],
          };
        });
      },
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBikeInput>({
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
    const newBikeId: string | undefined = data?.bike?.id;
    if (newBikeId) {
      toast({
        title: 'Bike created!',
        duration: 5000,
        variant: 'top-accent',
        isClosable: true,
        status: 'success',
        position: 'bottom-right',
      });

      history.push(`/manager/manage/bikes/${newBikeId}`);
    }
  }, [data, toast, history]);

  function handleBack() {
    history.push('/manager/manage/bikes');
  }

  const onSubmit: SubmitHandler<CreateBikeInput> = (formData) => {
    mutate({
      bike: formData,
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
              to="/manager/manage/bikes"
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
            label="Model"
            value={<Input register={register} name="model" placeholder="BMW" error={errors?.model?.message} />}
          />
          <Property
            label="Color"
            value={<Input register={register} name="color" placeholder="red" error={errors?.color?.message} />}
          />
          <Property
            label="Location"
            value={
              <Input
                register={register}
                name="location"
                placeholder="55 Marino St, San Diego, CA, USA"
                error={errors?.location?.message}
              />
            }
          />
          <Property
            label="Availability"
            value={
              <Select {...register('status')} name="status">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </Select>
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
};
