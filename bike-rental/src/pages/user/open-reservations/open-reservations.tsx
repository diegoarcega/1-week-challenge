import React, { useRef } from 'react';
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
  Select,
  Input,
  InputGroup,
  InputLeftAddon,
  Box,
  SimpleGrid,
  Text,
  FormLabel,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getOpenReservations, reserve, ReserveInput } from 'services/reservation.service';
import { OpenReservation, PaginationAndFilteringOutput } from 'mocks/handlers';
import { BikeCard } from 'pages/user/open-reservations/bike-card/bike-card';
import { useUserStore } from 'stores/user.store';

// TODO: DONT NEED TO BE LOGGED IN
interface QueryParams {
  from: string;
  to: string;
  page: number;
  perPage: number;
  filters: Record<string, string>;
}

export const OpenReservationsPage = (): JSX.Element | null => {
  const [page, setPage] = React.useState(1);
  const selectRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const searchByFromRef = useRef<HTMLInputElement | null>(null);
  const searchByToRef = useRef<HTMLInputElement | null>(null);
  const selectedOpenReservation = useRef<OpenReservation | null>(null);
  const user = useUserStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast();
  const queryParamsRef = useRef({
    from: '',
    to: '',
    perPage: 12,
    filters: {},
  });
  const queryParams = {
    ...queryParamsRef.current,
    page,
  };
  const cacheKey = ['open-reservations', queryParams, user?.id];
  const { data, error, isLoading } = useQuery<{ openReservations: PaginationAndFilteringOutput<OpenReservation> }>(
    cacheKey,
    () => {
      return getOpenReservations(queryParams);
    }
  );

  const { mutate: searchMutation, isLoading: isSearching } = useMutation(
    (queryParamsVariable: QueryParams) => {
      return getOpenReservations(queryParamsVariable);
    },
    {
      onSuccess: (dataSuccess) => {
        queryClient.setQueryData<{ openReservations: PaginationAndFilteringOutput<OpenReservation> } | undefined>(
          cacheKey,
          () => {
            return dataSuccess;
          }
        );
      },
    }
  );

  const { mutate: reserveMutation, isLoading: isReserving } = useMutation(
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

  function handleReserve() {
    const bikeId = selectedOpenReservation.current?.bike.id;
    const from = fromRef.current?.value;
    const to = toRef.current?.value;

    if (!bikeId || !from || !to) return;

    reserveMutation({
      bikeId,
      periodOfTime: {
        from,
        to,
      },
    });

    onClose();
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const filterKey = selectRef.current?.value;
    const filterValue = inputRef.current?.value;
    const from = searchByFromRef.current?.value;
    const to = searchByToRef.current?.value;
    const query = {
      ...queryParams,
    };

    if (filterKey) {
      query.filters = {
        [filterKey]: filterValue,
      };
    }

    if (from !== undefined && to !== undefined) {
      query.from = from;
      query.to = to;
    }

    searchMutation(query);
  }

  function handlePrevious() {
    setPage((_page) => _page - 1);
  }

  function handleNext() {
    setPage((_page) => _page + 1);
  }

  let openReservations = null;
  if (data) {
    openReservations = data?.openReservations.results.map((reservation) => ({
      ...reservation,
      onReserveBike: () => {
        selectedOpenReservation.current = reservation;
        onOpen();
      },
    }));
  }

  if (!openReservations) {
    return null;
  }

  const totalPages = data ? data.openReservations.totalPages : 1;
  const selectedReservation = selectedOpenReservation?.current;
  return (
    <>
      <Box bg="white" p="5">
        <Flex
          as="form"
          onSubmit={handleSearch}
          flexDirection={{ base: 'column', lg: 'row' }}
          justifyContent={{ base: 'initial', md: 'space-between' }}
          w="full"
        >
          <Flex flexDirection={{ base: 'column', md: 'row' }} justifyContent={{ md: 'flex-end', lg: 'flex-start' }}>
            <FormControl id="from" w={{ base: 'full', md: '210px' }} mr={{ base: '0', md: '5' }}>
              <InputGroup size="sm">
                <InputLeftAddon bg="white">From</InputLeftAddon>
                <Input ref={searchByFromRef} type="date" defaultValue="" />
              </InputGroup>
            </FormControl>
            <FormControl id="to" mt={{ base: '1', md: '0' }} w={{ base: 'full', md: '210px' }}>
              <InputGroup size="sm">
                <InputLeftAddon bg="white">To</InputLeftAddon>
                <Input placeholder="example: red" ref={searchByToRef} type="date" defaultValue="" />
              </InputGroup>
            </FormControl>
          </Flex>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent={{ md: 'flex-end', lg: 'flex-start' }}
            mt={{ md: '5', lg: '0' }}
          >
            <Box minW={{ base: 'full', md: '200' }} mt={{ base: '5', md: '0' }}>
              <FormControl id="search-by" w={{ base: 'full', md: '190px' }}>
                <InputGroup size="sm">
                  <InputLeftAddon bg="white">Search by</InputLeftAddon>
                  <Select name="searchBy" ref={selectRef}>
                    <option value="bike.model">Model</option>
                    <option value="bike.color">Color</option>
                    <option value="bike.location">Location</option>
                    <option value="rating">Rating</option>
                  </Select>
                </InputGroup>
              </FormControl>
            </Box>
            <Flex flexDirection={{ base: 'column', md: 'row' }} ml={{ base: '0', md: '4' }}>
              <FormControl id="term" mt={{ base: '1', md: '0' }} w={{ base: 'full', md: '210px' }}>
                <InputGroup size="sm">
                  <InputLeftAddon bg="white">Term</InputLeftAddon>
                  <Input placeholder="example: red" ref={inputRef} />
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="sm"
                minW={{ base: 'full', md: '50' }}
                ml={{ base: '0', md: '2' }}
                mt={{ base: '5', md: '0' }}
                isLoading={isSearching}
              >
                Search
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <SimpleGrid columns={[1, 2, 3, 4]} gap="5" py="5">
        {openReservations.map((reservation) => (
          <BikeCard
            key={reservation.bike.id}
            model={reservation.bike.model}
            color={reservation.bike.color}
            location={reservation.bike.location}
            ratingAverage={reservation.ratingAverage}
            onReserve={reservation.onReserveBike}
          />
        ))}
      </SimpleGrid>
      {/* <DataTable data={openReservations} columns={COLUMNS} /> */}
      <Flex justifyContent={{ base: 'center', sm: 'flex-end' }} mt="5" w="full">
        <ButtonGroup variant="outline" colorScheme="blue" w={['full', 'xs']}>
          <Button onClick={handlePrevious} isDisabled={page === 1} w={['full']}>
            Previous
          </Button>
          <Button onClick={handleNext} isDisabled={page === totalPages} w={['full']}>
            Next
          </Button>
        </ButtonGroup>
      </Flex>
      {selectedReservation && (
        <Drawer isOpen={isOpen} placement="right" size="sm" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              Reserve the {selectedReservation.bike.color} {selectedReservation.bike.model}
            </DrawerHeader>

            <DrawerBody>
              <Text as="address">{selectedReservation.bike.location}</Text>
              <Text>{selectedReservation.ratingAverage}</Text>

              <VStack mt="10" spacing="5">
                <FormControl id="selectedFrom">
                  <FormLabel>From</FormLabel>
                  <Input ref={fromRef} type="date" />
                </FormControl>
                <FormControl id="selectedTo">
                  <FormLabel>To</FormLabel>
                  <Input ref={toRef} type="date" />
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
    </>
  );
};
