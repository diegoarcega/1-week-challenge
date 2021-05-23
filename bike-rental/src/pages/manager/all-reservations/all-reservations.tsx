import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getAllReservations, ReservationOutput } from 'services/reservation.service';
import { getUser } from 'utils/user';

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
            <Td>{`${d.periodOfTime.from} - ${d.periodOfTime.to}`}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

const cacheKey = ['allReservations', getUser().id];
// TODO: filter by user and by bike
export const ReservationsPage = (): JSX.Element => {
  const { data, error, isLoading } = useQuery<{ allReservations: ReservationOutput[] }>(cacheKey, getAllReservations);

  if (isLoading) {
    return <h1>'loading'</h1>;
  }

  if (!data) {
    return <h1>'nothing'</h1>;
  }

  if (error) {
    return <h1>'error'</h1>;
  }

  return <DataTable data={data.allReservations} columns={COLUMNS} />;
};
