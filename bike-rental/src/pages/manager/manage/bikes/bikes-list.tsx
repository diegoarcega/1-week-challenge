import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

interface Bike {
  id: number;
  model: string;
  color: string;
  location: string;
  rating: number;
  isAvailable: boolean;
}

const COLUMNS = ['id', 'model', 'color', 'location', 'rating', 'availability', 'action'];
const USERS: Bike[] = [
  {
    id: 1,
    model: '55-p4',
    color: 'blue',
    location: 'san diego, sf, usa',
    rating: 4,
    isAvailable: true,
  },
  {
    id: 2,
    model: '54-p4',
    color: 'yellow',
    location: 'san raphael, sf, usa',
    rating: 5,
    isAvailable: false,
  },
];

interface DataTableProps {
  columns: string[];
  data: {
    id: number;
    model: string;
    color: string;
    location: string;
    rating: number;
    isAvailable: boolean;
    onOpen: () => void;
    onEdit: () => void;
  }[];
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
          <Tr key={d.id} onClick={d.onOpen}>
            <Td>{d.id}</Td>
            <Td>{d.model}</Td>
            <Td>{d.color}</Td>
            <Td>{d.location}</Td>
            <Td>{d.rating}</Td>
            <Td>{d.isAvailable}</Td>
            <Td>
              <Button onClick={d.onEdit} size="sm">
                edit
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export const BikesListPage = (): JSX.Element => {
  const history = useHistory();

  const users = USERS.map((user) => ({
    ...user,
    onOpen: () => history.push(`/manager/manage/bikes/${user.id}`),
    onEdit: () => history.push(`/manager/manage/bikes/edit/${user.id}`),
  }));

  return <DataTable data={users} columns={COLUMNS} />;
};
