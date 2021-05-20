import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { User } from '../../../types/user.type';
import { Bike } from '../../../types/bike.type';

interface Reservation {
  id: number;
  user: User['name'];
  bike: Bike['model'];
  periodOfTime: {
    startTime: string;
    endTime: string;
  };
}

const COLUMNS = ['id', 'user', 'bike', 'period of time'];
const USERS: Reservation[] = [
  {
    id: 1,
    user: 'Diego',
    bike: '55-4',
    periodOfTime: {
      startTime: '2021-05-20',
      endTime: '2021-05-21',
    },
  },
  {
    id: 2,
    user: 'Carina',
    bike: '55gg-4',
    periodOfTime: {
      startTime: '2021-05-21',
      endTime: '2021-05-22',
    },
  },
];

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
  return <DataTable data={USERS} columns={COLUMNS} />;
};
