import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, ButtonGroup, Flex } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { Bike } from 'types/bike.type';
import { getOpenReservations } from 'services/reservation.service';
import { OpenReservation, PaginationAndFilteringOutput } from 'mocks/handlers';

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

export const OpenReservationsPage = (): JSX.Element | null => {
  const queryParams = { page: 1, perPage: 1, filters: {} };
  const { data, error, isLoading } = useQuery<{ openReservations: PaginationAndFilteringOutput<OpenReservation> }>(
    ['open-reservations', queryParams],
    () => {
      return getOpenReservations(queryParams);
    }
  );

  console.log({ data, error, isLoading });

  function handlePrevious() {}

  function handleNext() {}

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

  return (
    <>
      <DataTable data={openReservations} columns={COLUMNS} />
      <Flex justifyContent="flex-end" mt="2">
        <ButtonGroup variant="outline" colorScheme="green">
          <Button onClick={handlePrevious}>Previous</Button>
          <Button onClick={handleNext}>Next</Button>
        </ButtonGroup>
      </Flex>
    </>
  );
};
