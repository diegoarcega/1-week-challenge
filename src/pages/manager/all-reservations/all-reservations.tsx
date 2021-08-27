import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getAllReservations, ReservationOutput } from 'services/reservation.service';
import { useUserStore } from 'stores/user.store';
import { RequestStatus } from 'components/request-status/request-status';
import dayjs from 'utils/date.util';

const COLUMNS = ['user', 'bike', 'period of time'];

interface DataTableProps {
  columns: string[];
  data: ReservationOutput[];
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
          <Tr key={d.id}>
            <Td>{d.user.name}</Td>
            <Td>
              {d.bike.color} {d.bike.model}
            </Td>
            <Td>
              from {dayjs(d.periodOfTime.from).format('DD/MM/YYYY')} to {dayjs(d.periodOfTime.to).format('DD/MM/YYYY')}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// TODO: filter by user and by bike
export const ReservationsPage = (): JSX.Element => {
  const user = useUserStore((state) => state.user);
  const cacheKey = ['allReservations', user?.id];
  const { data, error, isLoading } = useQuery<{ allReservations: ReservationOutput[] }>(cacheKey, getAllReservations);

  return (
    <RequestStatus
      isLoading={isLoading}
      error={error}
      data={data?.allReservations}
      noResultsMessage="There are no reservations in the system"
    >
      {data?.allReservations ? <DataTable data={data.allReservations} columns={COLUMNS} /> : null}
    </RequestStatus>
  );
};
