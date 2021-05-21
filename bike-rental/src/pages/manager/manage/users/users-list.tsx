import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { request, gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { User } from '../../../../types/user.type';
import { config } from '../../../../config/config';

const COLUMNS = ['id', 'name', 'email', 'roles', 'action'];

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

  const { data, error, isLoading } = useQuery<{ users: User[] }>(['users'], () => {
    return request(
      config.baseApiUrl,
      gql`
        query GetUsers {
          users {
            id
            name
            email
            roles
          }
        }
      `
    );
  });

  if (isLoading) {
    return <h1>'loading'</h1>;
  }

  if (!data) {
    return <h1>'nothing'</h1>;
  }

  if (error) {
    return <h1>'error'</h1>;
  }

  const users = data.users.map((user) => ({
    ...user,
    onOpen: () => history.push(`/manager/manage/users/${user.id}`),
    onEdit: () => history.push(`/manager/manage/users/edit/${user.id}`),
  }));

  return <DataTable data={users} columns={COLUMNS} />;
};
