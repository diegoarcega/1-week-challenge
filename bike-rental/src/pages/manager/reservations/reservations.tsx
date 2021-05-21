import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getAllReservations, Reservation } from '../../../services/reservation.service';

const COLUMNS = ['id', 'user', 'bike', 'period of time'];

interface DataTableProps {
  columns: string[];
  data: Reservation[];
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
            <Td>{d.id}</Td>
            <Td>{d.user}</Td>
            <Td>{d.bike}</Td>
            <Td>{`${d.periodOfTime.startTime} - ${d.periodOfTime.endTime}`}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// TODO: filter by user and by bike
export const ReservationsPage = (): JSX.Element => {
  const { data, error, isLoading } = useQuery<{ reservations: Reservation[] }>(['reservations'], getAllReservations);

  if (isLoading) {
    return <h1>'loading'</h1>;
  }

  if (!data) {
    return <h1>'nothing'</h1>;
  }

  if (error) {
    return <h1>'error'</h1>;
  }

  return <DataTable data={data.reservations} columns={COLUMNS} />;
};
