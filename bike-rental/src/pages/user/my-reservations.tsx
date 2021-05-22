import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Bike } from '../../types/bike.type';
import { Reservation } from '../../types/reservation.type';

interface Reservations extends Pick<Reservation, 'id' | 'periodOfTime' | 'status'> {
  bike: Bike;
}

const COLUMNS = ['bike', 'period of time', 'action'];
const RESERVATIONS: Reservations[] = [
  {
    id: 1,
    bike: {
      id: 1,
      model: '55-p4',
      color: 'blue',
      location: 'san diego, sf, usa',
    },
    periodOfTime: {
      startTime: '2021-05-25',
      endTime: '2021-05-26',
    },
    status: 'active',
  },
];

interface DataTableProps {
  columns: string[];
  data: (Reservations & {
    onCancelReservation: () => void;
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
          <Tr key={d.id}>
            <Td>{d.bike.model}</Td>
            <Td>{JSON.stringify(d.periodOfTime, null, 2)}</Td>
            <Td>
              <Button variant="solid" onClick={d.onCancelReservation} size="sm">
                cancel
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export const MyReservationsPage = (): JSX.Element => {
  function handleCancelReservation(bikeId: Bike['id']) {
    // eslint-disable-next-line no-alert
    window.alert(JSON.stringify({ bikeId, userId: 1 }, null, 2));
  }
  const reservations = RESERVATIONS.map((reserve) => ({
    ...reserve,
    onCancelReservation: () => handleCancelReservation(reserve.bike.id),
  }));

  return (
    <>
      <DataTable data={reservations} columns={COLUMNS} />
    </>
  );
};
