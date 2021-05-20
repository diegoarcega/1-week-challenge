import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

const COLUMNS = ['id', 'name', 'email', 'roles', 'action'];
const USERS = [
  {
    id: 1,
    name: 'Diego',
    email: 'diegoarcega@gmail.com',
    roles: ['manager'],
  },
  {
    id: 2,
    name: 'Diego c',
    email: 'diegoarcega2@gmail.com',
    roles: [],
  },
];

interface DataTableProps {
  columns: string[];
  data: {
    id: number;
    name: string;
    email: string;
    roles: string[];
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
            <Td>{d.name}</Td>
            <Td>{d.email}</Td>
            <Td>{d.roles.join(',')}</Td>
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

export const UsersListPage = (): JSX.Element => {
  const history = useHistory();

  const users = USERS.map((user) => ({
    ...user,
    onOpen: () => history.push(`/manager/manage/users/${user.id}`),
    onEdit: () => history.push(`/manager/manage/users/edit/${user.id}`),
  }));

  return <DataTable data={users} columns={COLUMNS} />;
};
