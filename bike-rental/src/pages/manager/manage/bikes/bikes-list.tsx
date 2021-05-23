import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Text, Flex, Button } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { RequestStatus } from 'components/request-status/request-status';
import { getUser } from 'utils/user';
import { getAllBikes } from 'services/bike.service';
import { Bike } from 'types/bike.type';

interface DataTableProps {
  columns: string[];
  data: (Bike & {
    onOpen: () => void;
  })[];
}

type RequestType = { bikes: Bike[] };

const COLUMNS = ['bike', 'location'];
const cacheKey = ['users', getUser().id];

export const BikesListPage = (): JSX.Element => {
  const history = useHistory();
  const { data, error, isLoading } = useQuery<RequestType>(cacheKey, getAllBikes);

  function handleCreateClick() {
    history.push(`/manager/manage/bikes/create`);
  }

  let bikesData = null;

  if (data?.bikes) {
    bikesData = data.bikes.map((bike) => ({
      ...bike,
      onOpen: () => history.push(`/manager/manage/bikes/${bike.id}`),
    }));
  }
  return (
    <>
      <Flex justifyContent="flex-end" mb="5">
        <Button colorScheme="blue" onClick={handleCreateClick}>
          Create Bke
        </Button>
      </Flex>
      <RequestStatus
        isLoading={isLoading}
        error={error}
        data={bikesData}
        noResultsMessage="There are no bikes in the system"
      >
        {bikesData ? <DataTable data={bikesData} columns={COLUMNS} /> : null}
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
                <Text fontSize={{ base: 'xs', md: 'md' }}>
                  {d.color} {d.model}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'md' }}>{d.location}</Text>
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
              <Text>
                {d.color} {d.model}
              </Text>
            </Td>
            <Td>
              <Text>{d.location}</Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
