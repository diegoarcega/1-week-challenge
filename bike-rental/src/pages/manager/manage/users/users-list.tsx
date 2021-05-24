import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Text, Flex, Button } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { getAllUsers } from 'services/user.service';
import { User } from 'types/user.type';
import { RequestStatus } from 'components/request-status/request-status';

interface DataTableProps {
  columns: string[];
  data: (User & {
    onOpen: () => void;
  })[];
}

type RequestType = { users: User[] };

const COLUMNS = ['name', 'email', 'roles'];
const cacheKey = ['users'];

export const UsersListPage = (): JSX.Element => {
  const history = useHistory();
  const { data, error, isLoading } = useQuery<RequestType>(cacheKey, getAllUsers);

  function handleCreateUserClick() {
    history.push(`/manager/manage/users/create`);
  }

  let usersData = null;

  if (data?.users) {
    usersData = data.users.map((user) => ({
      ...user,
      onOpen: () => history.push(`/manager/manage/users/${user.id}`),
    }));
  }
  return (
    <>
      <Flex justifyContent="flex-end" mb="5">
        <Button colorScheme="blue" onClick={handleCreateUserClick}>
          Create User
        </Button>
      </Flex>
      <RequestStatus
        isLoading={isLoading}
        error={error}
        data={usersData}
        noResultsMessage="There are no users in the system"
      >
        {usersData ? <DataTable data={usersData} columns={COLUMNS} /> : null}
      </RequestStatus>
    </>
  );
};

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
              backgroundColor: 'blue.50',
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
