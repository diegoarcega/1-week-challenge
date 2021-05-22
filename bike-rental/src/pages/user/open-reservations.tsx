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
    perPage: 2,
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
    <>
      <Flex bg="white" p="5" justifyContent={{ base: 'center', sm: 'flex-end' }}>
        <Flex
          as="form"
          onSubmit={handleSearch}
          flexDirection={{ base: 'column', sm: 'row' }}
          w={{ base: 'full', sm: 'max-content' }}
        >
          <Box minW={{ base: 'full', sm: '200' }}>
            <FormControl id="country">
              <InputGroup>
                <InputLeftAddon fontSize="sm">Search by</InputLeftAddon>
                <Select name="searchBy" ref={selectRef}>
                  <option value="bike.model">Model</option>
                  <option value="bike.color">Color</option>
                  <option value="bike.location">Location</option>
                  <option value="rating">rating</option>
                </Select>
              </InputGroup>
            </FormControl>
          </Box>
          <Flex flexDirection={{ base: 'column', sm: 'row' }} ml={{ base: '0', sm: '4' }}>
            <FormControl id="term">
              <InputGroup>
                <InputLeftAddon fontSize="sm">Term</InputLeftAddon>
                <Input placeholder="example: red" ref={inputRef} />
              </InputGroup>
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              minW={{ base: 'full', sm: '100' }}
              ml={{ base: '0', sm: '2' }}
              mt={{ base: '5', sm: '0' }}
              isLoading={isSearching}
            >
              Search
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <SimpleGrid columns={[1, 3, 4]} gap="5" py="5">
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
      <Flex justifyContent="flex-end" mt="2">
        <ButtonGroup variant="outline" colorScheme="green">
          <Button onClick={handlePrevious} isDisabled={page === 1}>
            Previous
          </Button>
          <Button onClick={handleNext} isDisabled={page === totalPages}>
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </>
  );
};
