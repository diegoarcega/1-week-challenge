import React, { useCallback, useRef } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Input,
  Checkbox,
  CheckboxGroup,
  Box,
  SimpleGrid,
  Text,
  FormLabel,
  VStack,
  useToast,
  FormErrorMessage,
  Image,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useMutation, useQuery } from 'react-query';
import queryString from 'query-string';
import { getOpenReservations, reserve, ReserveInput } from 'services/reservation.service';
import { OpenReservation, PaginationAndFilteringOutput } from 'mocks/handlers';
import { BikeCard, bikeImageSample } from 'pages/user/open-reservations/bike-card/bike-card';
import { useUserStore } from 'stores/user.store';
import { Bike } from 'types/bike.type';
import { Rating } from 'types/rating.type';
import { useHistory, useLocation } from 'react-router-dom';

interface GetOpenReservations {
  models: {
    [key: string]: number;
  };
  colors: {
    [key: string]: number;
  };
  openReservations: PaginationAndFilteringOutput<OpenReservation>;
}

export interface SelectedReservation extends Bike {
  ratingAverage: Rating['rating'];
}

const initialQueryParams = {
  from: '',
  to: '',
  page: 1,
  perPage: 12,
  filters: {},
};

// the source of truth is the URL params
// the state of this app is tied to the URL params
// the state is being shared with react-query, all cached
// TODO: move the filter to its own component
// TODO: fetch the filter options separately inside the filter component
// TODO: move the pagination to its own component
// TODO: backend: combine the filters restricting the search instead of amplifying it
// TODO: DONT NEED TO BE LOGGED IN (use next.js to prefetch the data)
// TODO: show/add reservation price per bike
export const OpenReservationsPage = (): JSX.Element | null => {
  const location = useLocation();
  const locationSearch = queryString.parse(location.search, {
    arrayFormat: 'comma',
  });
  const pageRef = useRef(1);
  const modelFilterRef = useRef<string[]>([]); // avoid rerender
  const colorFilterRef = useRef<string[]>([]); // avoid rerender
  const locationFilterRef = useRef<HTMLInputElement | null>(null); // avoid rerender
  const ratingFilterRef = useRef<HTMLSelectElement | null>(null); // avoid rerender
  const fromRef = useRef<HTMLInputElement>(null); // avoid rerender
  const toRef = useRef<HTMLInputElement>(null); // avoid rerender
  const searchByFromRef = useRef<HTMLInputElement | null>(null); // avoid rerender
  const searchByToRef = useRef<HTMLInputElement | null>(null); // avoid rerender
  const selectedOpenReservation = useRef<SelectedReservation | null>(null);
  const user = useUserStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const toast = useToast();

  const searchByFrom = searchByFromRef.current?.value ?? '';
  const searchByTo = searchByToRef.current?.value ?? '';
  const queryParams =
    Object.keys(locationSearch).length !== 0
      ? {
          from: searchByFrom,
          to: searchByTo,
          perPage: 12,
          filters: {
            ...(modelFilterRef.current.length && { 'bike.model': modelFilterRef.current }),
            ...(colorFilterRef.current.length && { 'bike.color': colorFilterRef.current }),
            ...(locationFilterRef.current?.value && { 'bike.location': locationFilterRef.current?.value }),
            ...(ratingFilterRef.current?.value && { ratingAverage: Number(ratingFilterRef.current?.value) }),
          },
          page: pageRef.current,
        }
      : initialQueryParams;
  const cacheKey = ['open-reservations', queryParams, user?.id];
  const { data, isLoading } = useQuery<GetOpenReservations>(
    cacheKey,
    () => {
      return getOpenReservations(queryParams);
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const {
    mutateAsync: reserveMutation,
    isLoading: isReserving,
    error: reserveMutationError,
    reset: resetReservationMutation,
  } = useMutation(
    (variables: ReserveInput) => {
      return reserve(variables);
    },
    {
      onSuccess: () => {
        toast({
          title: 'Reservation created',
          description: 'Your reservation was successfully created',
          position: 'bottom-right',
          status: 'success',
          variant: 'top-accent',
        });
      },
    }
  );

  async function handleReserve() {
    const bikeId = selectedOpenReservation.current?.id;
    const from = fromRef.current?.value;
    const to = toRef.current?.value;

    if (!bikeId || !from || !to) return;

    try {
      await reserveMutation({
        bikeId,
        periodOfTime: {
          from,
          to,
        },
      });
      onClose();
    } catch (error) {
      // log to analytics and sentry
      console.info('date is taken', error);
    }
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = {
      from: initialQueryParams.from,
      to: initialQueryParams.to,
      perPage: initialQueryParams.perPage,
      page: initialQueryParams.page,
    };
    pageRef.current = 1;

    const filters = {
      ...(modelFilterRef.current.length && { 'bike.model': modelFilterRef.current }),
      ...(colorFilterRef.current.length && { 'bike.color': colorFilterRef.current }),
      ...(locationFilterRef.current?.value && { 'bike.location': locationFilterRef.current?.value }),
      ...(ratingFilterRef.current?.value && { ratingAverage: Number(ratingFilterRef.current?.value) }),
    };

    const from = searchByFromRef.current?.value;
    const to = searchByToRef.current?.value;

    if (from !== undefined && to !== undefined) {
      query.from = from;
      query.to = to;
    }

    const newRoute = queryString.stringify(
      { ...query, ...filters },
      {
        arrayFormat: 'comma',
        sort: false,
        encode: false,
      }
    );

    // causes rerender, thus updating the query
    history.replace(`/dashboard/?${newRoute}`);
  }

  // pagination
  function handlePrevious() {
    const routeParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
    });

    const newPage = pageRef.current - 1;
    const newRoute = queryString.stringify(
      { ...routeParams, ...{ page: newPage } },
      {
        arrayFormat: 'comma',
        sort: false,
        encode: false,
      }
    );

    pageRef.current = newPage;
    // causes rerender, thus updating the query
    history.replace(`/dashboard/?${newRoute}`);
  }

  function handleNext() {
    const routeParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
    });

    const newPage = pageRef.current + 1;
    const newRoute = queryString.stringify(
      { ...routeParams, ...{ page: newPage } },
      {
        arrayFormat: 'comma',
        sort: false,
        encode: false,
      }
    );

    pageRef.current = newPage;
    // causes rerender, thus updating the query
    history.replace(`/dashboard/?${newRoute}`);
  }

  // filters
  function handleChangeModelFilter(value: string[]) {
    modelFilterRef.current = value;
  }

  function handleChangeColorFilter(value: string[]) {
    colorFilterRef.current = value;
  }

  const handleReserveBike = useCallback(
    (reservation) => {
      resetReservationMutation();
      selectedOpenReservation.current = reservation;
      onOpen();
    },
    [onOpen, resetReservationMutation]
  );

  let openReservations = null;
  if (data) {
    openReservations = data?.openReservations.results.map((reservation) => ({
      ...reservation,
      onReserveBike: handleReserveBike,
    }));
  }

  const totalPages = data ? data.openReservations.totalPages : 1;
  const selectedReservation = selectedOpenReservation?.current;

  return (
    <SimpleGrid templateColumns={{ base: '1', md: '200px 1fr' }} columnGap="5">
      <Box bg="white" p="5" rounded="5">
        <Accordion allowToggle defaultIndex={0}>
          <AccordionItem border="0">
            <AccordionButton display={{ base: 'inline-flex', md: 'none' }} mb={{ base: '5', md: '0' }}>
              <Box flex="1" textAlign="left">
                Filters
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel padding="0">
              {data !== undefined ? (
                <Flex as="form" onSubmit={handleSearch} flexDirection={{ base: 'column' }}>
                  <Flex flexDirection={{ base: 'column' }}>
                    <FormControl id="from">
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
                        From
                      </FormLabel>
                      <Input ref={searchByFromRef} type="date" defaultValue="" fontSize="sm" />
                    </FormControl>
                    <FormControl id="to" mt={{ base: '5' }}>
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
                        To
                      </FormLabel>
                      <Input ref={searchByToRef} fontSize="sm" type="date" defaultValue="" />
                    </FormControl>
                  </Flex>
                  <Flex flexDirection={{ base: 'column' }} mt={{ base: '10' }}>
                    {data && (
                      <FormControl id="model">
                        <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
                          Model
                        </FormLabel>
                        <CheckboxGroup onChange={handleChangeModelFilter} size="sm">
                          <VStack alignItems="flex-start">
                            {Object.entries(data.models).map(([key, value]) => (
                              <Checkbox value={key} key={key} textTransform="capitalize">
                                {key}
                                <Text ml="2" fontSize="xs" color="gray.400" as="span">
                                  {value}
                                </Text>
                              </Checkbox>
                            ))}
                          </VStack>
                        </CheckboxGroup>
                      </FormControl>
                    )}

                    {data && (
                      <FormControl id="color" mt="5">
                        <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
                          Color
                        </FormLabel>
                        <CheckboxGroup onChange={handleChangeColorFilter} size="sm">
                          <VStack alignItems="flex-start">
                            {Object.entries(data.colors).map(([key, value]) => (
                              <Checkbox value={key} key={key} textTransform="capitalize">
                                {key}
                                <Text ml="2" fontSize="xs" color="gray.400" as="span">
                                  {value}
                                </Text>
                              </Checkbox>
                            ))}
                          </VStack>
                        </CheckboxGroup>
                      </FormControl>
                    )}
                    <FormControl id="rating" mt="5">
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
                        Rating
                      </FormLabel>
                      <Flex>
                        <Select ref={ratingFilterRef} w="20">
                          <option value="">All</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </Select>
                      </Flex>
                    </FormControl>
                    <FormControl id="location" mt="5">
                      <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
                        Location
                      </FormLabel>
                      <Input ref={locationFilterRef} />
                    </FormControl>

                    <Flex justifyContent="flex-end" mt="10">
                      <Button type="submit" colorScheme="blue" size="sm" variant="ghost">
                        Search
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              ) : (
                <Center>
                  <Spinner color="blue.500" />
                </Center>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
      {isLoading && (
        <Center>
          <Spinner size="lg" color="blue.500" />
        </Center>
      )}
      {openReservations !== null && openReservations.length === 0 ? (
        <Text textAlign="center" mt="10" fontSize="xl" fontWeight="bold" color="blue.500">
          No results for this query
        </Text>
      ) : (
        <Box>
          <SimpleGrid columns={[1, 2, 3, 4]} gap="4" pb="5">
            {openReservations?.map((reservation) => (
              <BikeCard
                key={reservation.bike.id}
                id={reservation.bike.id}
                model={reservation.bike.model}
                color={reservation.bike.color}
                location={reservation.bike.location}
                status={reservation.bike.status}
                ratingAverage={reservation.ratingAverage}
                onReserve={reservation.onReserveBike}
              />
            ))}
          </SimpleGrid>
          {/* TODO: move pagination to a component */}
          <Flex justifyContent={{ base: 'center', sm: 'flex-end' }} mt="5" w="full">
            <ButtonGroup variant="outline" colorScheme="blue" w={['full', 'xs']}>
              <Button onClick={handlePrevious} isDisabled={pageRef.current === 1} w={['full']} isLoading={isLoading}>
                Previous
              </Button>
              <Button
                onClick={handleNext}
                isDisabled={pageRef.current === totalPages}
                w={['full']}
                isLoading={isLoading}
              >
                Next
              </Button>
            </ButtonGroup>
          </Flex>
        </Box>
      )}

      {/* TODO: move Drawer to a component */}
      {selectedReservation && (
        <Drawer isOpen={isOpen} placement="right" size="sm" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton color="white" />
            <DrawerHeader textTransform="uppercase" bg="blue.600" color="white">
              Reserve the {selectedReservation.color} {selectedReservation.model}
            </DrawerHeader>
            <Image
              src={bikeImageSample.imageURL}
              alt={`Picture of a ${selectedReservation.color} ${selectedReservation.model}`}
              rounded="sm"
              maxW="full"
            />

            <DrawerBody bg="gray.300">
              <Text as="address">{selectedReservation.location}</Text>
              {selectedReservation.ratingAverage && (
                <Text fontSize="xs" textTransform="uppercase">
                  Rating: {selectedReservation.ratingAverage}
                </Text>
              )}

              <VStack mt="10" spacing="5">
                <FormControl id="selectedFrom">
                  <FormLabel>From</FormLabel>
                  <Input ref={fromRef} type="date" variant="filled" />
                </FormControl>
                <FormControl id="selectedTo">
                  <FormLabel>To</FormLabel>
                  <Input ref={toRef} type="date" variant="filled" />
                </FormControl>
                <FormControl isInvalid={!!reserveMutationError}>
                  <FormErrorMessage>This bike is already taken for this period of time</FormErrorMessage>
                </FormControl>
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleReserve} isLoading={isReserving}>
                Reserve
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </SimpleGrid>
  );
};
