import React, { useEffect, useRef } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUser } from 'utils/user';
import { MyReservation, getMyReservations, updateReservation, UpdateReservation } from 'services/reservation.service';

const COLUMNS = ['bike', 'period of time', 'action'];
const cacheKey = ['my-reservations', getUser().id];
interface DataTableProps {
  columns: string[];
  data: (MyReservation & {
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
  const { data, error, isLoading } = useQuery<{ myReservations: MyReservation[] }>(cacheKey, getMyReservations);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const selectedReservationId = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { mutate: updateReservationMutation, error: mutationError } = useMutation(
    (updateVariables: UpdateReservation) => {
      return updateReservation(updateVariables);
    },
    {
      onSuccess: (dataSuccess, updateVariables) => {
        queryClient.setQueryData<{ myReservations: MyReservation[] } | undefined>(cacheKey, (oldData) => {
          toast({
            title: 'Reservation cancelled',
            description: 'Your reservation was successfully cancelled',
            position: 'bottom-right',
            status: 'success',
            variant: 'top-accent',
          });

          onClose();
          return oldData
            ? {
                myReservations: oldData.myReservations.filter(
                  (reservation) => reservation.id !== updateVariables.reservationId
                ),
              }
            : undefined;
        });
      },
    }
  );

  useEffect(() => {
    if (mutationError) {
      toast({
        title: 'Error',
        description: 'We could not process this request',
        duration: 5000,
        variant: 'top-accent',
        isClosable: true,
        status: 'error',
        position: 'bottom-right',
      });

      onClose();
    }
  }, [mutationError, toast, onClose]);

  if (isLoading) {
    return <h1>'loading'</h1>;
  }

  if (!data) {
    return <h1>'nothing'</h1>;
  }

  if (error) {
    return <h1>'error'</h1>;
  }

  function cancelReservation() {
    const reservationId = selectedReservationId.current;
    if (!reservationId) return;

    updateReservationMutation({
      status: 'cancelled',
      reservationId,
    });
  }

  const reservations = data.myReservations.map((reservation) => ({
    ...reservation,
    onCancelReservation: () => {
      selectedReservationId.current = reservation.id;
      onOpen();
    },
  }));

  return (
    <>
      <DataTable data={reservations} columns={COLUMNS} />
      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        colorScheme="red"
        motionPreset="scale"
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Cancel reservation ?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Are you sure you want to cancel this reservation ?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={cancelReservation}>
              Yes, I'm sure
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
