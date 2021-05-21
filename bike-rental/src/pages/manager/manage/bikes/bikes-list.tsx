import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Bike } from 'types/bike.type';
import { getAllBikes } from 'services/bike.service';
import { useQuery } from 'react-query';

const COLUMNS = ['id', 'model', 'color', 'location', 'action'];
interface DataTableProps {
  columns: string[];
  data: (Bike & {
    onOpen: () => void;
    onEdit: () => void;
  })[];
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
  const { data, error, isLoading } = useQuery<{ bikes: Bike[] }>(['bikes'], getAllBikes);

  if (isLoading) {
    return <h1>'loading'</h1>;
  }

  if (!data) {
    return <h1>'nothing'</h1>;
  }

  if (error) {
    return <h1>'error'</h1>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const bikes = data.bikes.map((bike) => ({
    ...bike,
    onOpen: () => history.push(`/manager/manage/bikes/${bike.id}`),
    onEdit: () => history.push(`/manager/manage/bikes/edit/${bike.id}`),
  }));

  return <DataTable data={bikes} columns={COLUMNS} />;
};
