import React, { EventHandler, FormEventHandler, useRef } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Input,
  VStack,
  HStack,
  InputGroup,
  InputLeftAddon,
  Box,
  InputRightAddon,
  SimpleGrid,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Bike } from 'types/bike.type';
import { getOpenReservations } from 'services/reservation.service';
import { OpenReservation, PaginationAndFilteringOutput } from 'mocks/handlers';
import { BikeCard } from 'components/bike-card/bike-card';

const COLUMNS = ['bike', 'availability', 'rating', 'action'];

interface DataTableProps {
  columns: string[];
  data: (OpenReservation & {
    onReserveBike: () => void;
  })[];
}
// TODO: make it responsive
function DataTable({ columns, data }: DataTableProps) {
  return (
    <Table variant="simple" bg="white">
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column}>{column}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((d) => (
          <Tr key={d.bike.id}>
            <Td>{d.bike.model}</Td>
            <Td>{JSON.stringify(d.availablePeriods, null, 2)}</Td>

            <Td>{d.ratingAverage}</Td>

            <Td>
              <Button variant="solid" onClick={d.onReserveBike} size="sm">
                reserve
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// TODO: DONT NEED TO BE LOGGED IN
interface QueryParams {
  page: number;
  perPage: number;
  filters: Record<string, string>;
}
export const OpenReservationsPage = (): JSX.Element | null => {
  const [page, setPage] = React.useState(1);
  const selectRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const queryParamsRef = useRef({
    perPage: 12,
    filters: {},
  });
  const queryParams = {
    ...queryParamsRef.current,
    page,
  };
  const cacheKey = ['open-reservations', queryParams];
  const { data, error, isLoading } = useQuery<{ openReservations: PaginationAndFilteringOutput<OpenReservation> }>(
    cacheKey,
    () => {
      return getOpenReservations(queryParams);
    }
  );
  const { mutate, isLoading: isSearching } = useMutation(
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

  // console.log({ data, error, isLoading });

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const filterKey = selectRef.current?.value;
    const filterValue = inputRef.current?.value;
    const query = {
      ...queryParams,
    };

    if (filterKey) {
      query.filters = {
        [filterKey]: filterValue,
      };
    }

    console.log({ query });
    mutate(query);
  }

  function handleSearchByChange() {
    console.log({ inputRef, selectRef });
  }

  function handlePrevious() {
    setPage((_page) => _page - 1);
  }

  function handleNext() {
    setPage((_page) => _page + 1);
  }

  function handleReserveBike(bikeId: Bike['id']) {
    // eslint-disable-next-line no-alert
    window.alert(JSON.stringify({ bikeId, userId: 1 }, null, 2));
  }

  let openReservations = null;
  if (data) {
    openReservations = data?.openReservations.results.map((reservation) => ({
      ...reservation,
      onReserveBike: () => handleReserveBike(reservation.bike.id),
    }));
  }

  if (!openReservations) {
    return null;
  }

  const totalPages = data ? data.openReservations.totalPages : 1;
  return (
    <Box pb="20">
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
                <Input ref={inputRef} type="date" />
              </InputGroup>
            </FormControl>
            <FormControl id="to" mt={{ base: '1', md: '0' }} w={{ base: 'full', md: '210px' }}>
              <InputGroup size="sm">
                <InputLeftAddon bg="white">To</InputLeftAddon>
                <Input placeholder="example: red" ref={inputRef} type="date" />
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
          />
        ))}
      </SimpleGrid>
      {/* <DataTable data={openReservations} columns={COLUMNS} /> */}
      <Flex justifyContent={{ base: 'center', sm: 'flex-end' }} mt="5" w="full">
        <ButtonGroup variant="outline" colorScheme="green" w={['full', 'xs']}>
          <Button onClick={handlePrevious} isDisabled={page === 1} w={['full']}>
            Previous
          </Button>
          <Button onClick={handleNext} isDisabled={page === totalPages} w={['full']}>
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};
