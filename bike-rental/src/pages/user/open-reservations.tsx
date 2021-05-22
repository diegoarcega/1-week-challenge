import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Bike } from '../../types/bike.type';
import { Reservation } from '../../types/reservation.type';
import { Rating } from '../../types/rating.type';

// interface ReserveBike {
//   bike: Bike;
//   availability: string;
//   rating: string;
// }

const COLUMNS = ['bike', 'availability', 'rating', 'action'];
const RESERVE = [
  {
    bike: {
      id: 1,
      model: '55-p4',
      color: 'blue',
      location: 'san diego, sf, usa',
    },
    reservations: [
      {
        startTime: '2021-05-25',
        endTime: '2021-05-26',
      },
    ],
    rating: 5,
  },
];

interface DataTableProps {
  columns: string[];
  data: {
    bike: Bike;
    reservations: Reservation['periodOfTime'][];
    rating: Rating['rating'];
    onReserveBike: () => void;
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
          <Tr key={d.bike.id}>
            <Td>{d.bike.model}</Td>
            <Td>{JSON.stringify(d.reservations, null, 2)}</Td>

            <Td>{d.rating}</Td>

            <Td>
              <Button variant="solid" onClick={d.onReserveBike} size="sm">
                reserve
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export const OpenReservationsPage = (): JSX.Element => {
  function handleReserveBike(bikeId: Bike['id']) {
    // eslint-disable-next-line no-alert
    window.alert(JSON.stringify({ bikeId, userId: 1 }, null, 2));
  }
  const users = RESERVE.map((reserve) => ({
    ...reserve,
    onReserveBike: () => handleReserveBike(reserve.bike.id),
  }));

  return (
    <>
      <DataTable data={users} columns={COLUMNS} />
    </>
  );
};
