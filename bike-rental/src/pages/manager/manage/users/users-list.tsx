import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Text, Flex } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getAllUsers } from 'services/user.service';
import { User } from 'types/user.type';
import { RequestStatus } from 'components/request-status/request-status';

const COLUMNS = ['name', 'email', 'roles'];
interface DataTableProps {
  columns: string[];
  data: (User & {
    onOpen: () => void;
  })[];
}

function DataTable({ columns, data }: DataTableProps) {
  return (
    <Table variant="simple" bg="white">
      <Thead>
        <Tr display={{ base: 'none', md: 'table-row' }}>
          {columns.map((column) => (
            <Th key={column}>{column}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody display={{ base: 'table-row-group', md: 'none' }}>
        {data.map((d) => (
          <Tr key={d.id} onClick={d.onOpen}>
            <Td>
              <Flex flexDirection="column">
                <Text>{d.name}</Text>
                <Text fontSize={{ base: 'xs', md: 'md' }}>{d.email}</Text>
                <Text fontSize={{ base: 'xs', md: 'md' }}>{d.roles.join(',')}</Text>
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
      <Tbody display={{ base: 'none', md: 'table-row-group' }}>
        {data.map((d) => (
          <Tr
            key={d.id}
            onClick={d.onOpen}
            _hover={{
              cursor: 'pointer',
              backgroundColor: 'green.50',
            }}
          >
            <Td>
              <Text>{d.name}</Text>
            </Td>
            <Td>
              <Text>{d.email}</Text>
            </Td>
            <Td>
              <Text>{d.roles.join(',')}</Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

type RequestType = { users: User[] };
const cacheKey = ['users'];

export const UsersListPage = (): JSX.Element => {
  const history = useHistory();

  const { data, error, isLoading } = useQuery<RequestType>(cacheKey, getAllUsers);

  let usersData = null;

  if (data?.users) {
    usersData = data.users.map((user) => ({
      ...user,
      onOpen: () => history.push(`/manager/manage/users/${user.id}`),
    }));
  }
  return (
    <RequestStatus
      isLoading={isLoading}
      error={error}
      data={usersData}
      noResultsMessage="There are no users in the system"
    >
      {usersData ? <DataTable data={usersData} columns={COLUMNS} /> : null}
    </RequestStatus>
  );
};
