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
  Select,
} from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Card } from 'components/card/card';
import { CardHeader } from 'components/card/card.header';
import { CardContent } from 'components/card/card.content';
import { Property } from 'components/card/card.property';
import { Input } from 'components/input/input';
import { RequestStatus } from 'components/request-status/request-status';
import createRequiredSchema from 'validations/required';
import { Bike } from 'types/bike.type';
import { useUserStore } from 'stores/user.store';
import { deleteBike, editBike, getBike } from 'services/bike.service';

type FormInput = Omit<Bike, 'id'>;

const schema = yup.object().shape({
  model: createRequiredSchema('model'),
  color: createRequiredSchema('color'),
  location: createRequiredSchema('location'),
  status: createRequiredSchema('status'),
});

export const BikeDetailPage = (): JSX.Element => {
  const [isEdit, setEdit] = useState(false);
  const { bikeId } = useParams<{ bikeId: string }>();
  const queryClient = useQueryClient();
  const history = useHistory();
  const user = useUserStore((state) => state.user);
  const toast = useToast();
  const cacheKey = ['bike', bikeId, user?.id];

  const { data, error, isLoading } = useQuery<{ bike: Bike }>(cacheKey, () => {
    return getBike(bikeId);
  });

  const { mutate: editMutation, error: mutationError } = useMutation(
    ({ bike }: { bike: Bike }) => {
      return editBike(bike);
    },
    {
      onSuccess: (dataSuccess, { bike }) => {
        queryClient.setQueryData<{ bike: Bike } | undefined>(cacheKey, (oldData) => {
          return oldData
            ? {
                bike,
              }
            : undefined;
        });
      },
    }
  );

  const { mutate: deleteMutation, error: deleteMutationError } = useMutation(
    (variables: { bikeId: Bike['id'] }) => {
      return deleteBike(variables.bikeId);
    },
    {
      onSuccess: (dataSuccess, variables) => {
        queryClient.setQueryData<{ bikes: Bike[] } | undefined>(['bikes', user?.id], (oldData) => {
          return oldData
            ? {
                bikes: oldData.bikes.filter((bike) => bike.id !== variables.bikeId),
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
    deleteMutation({ bikeId });
    history.goBack();
  }

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    editMutation({
      bike: {
        ...formData,
        id: bikeId,
      },
    });
    toggleEdit();
  };

  return (
    <RequestStatus isLoading={isLoading} error={error} data={data} noResultsMessage="No bike with this ID was found">
      <Box as="section">
        <Card maxW="3xl" mx="auto" as="form" onSubmit={handleSubmit(onSubmit)}>
          <CardHeader
            title={data ? data.bike?.model : ''}
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
                          <Text>Are you sure you want delete this bike?</Text>
                          <Button colorScheme="red" onClick={handleDelete} variant="solid" isFullWidth>
                            Yes, delete
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
              label="Model"
              value={
                isEdit ? (
                  <Input
                    register={register}
                    name="model"
                    defaultValue={data?.bike?.model}
                    error={errors?.model?.message}
                  />
                ) : (
                  data?.bike?.model
                )
              }
            />
            <Property
              label="Color"
              value={
                isEdit ? (
                  <Input
                    register={register}
                    name="color"
                    defaultValue={data?.bike?.color}
                    error={errors?.color?.message}
                  />
                ) : (
                  data?.bike?.color
                )
              }
            />
            <Property
              label="Location"
              value={
                isEdit ? (
                  <Input
                    register={register}
                    name="location"
                    defaultValue={data?.bike?.location}
                    error={errors?.location?.message}
                  />
                ) : (
                  data?.bike?.location
                )
              }
            />
            <Property
              label="Availability"
              value={
                isEdit ? (
                  <Select {...register('status')} name="status" defaultValue={data?.bike?.status}>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </Select>
                ) : (
                  data?.bike?.status
                )
              }
            />
          </CardContent>
        </Card>
      </Box>
    </RequestStatus>
  );
};
