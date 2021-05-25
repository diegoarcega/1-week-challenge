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
  Flex,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUser } from 'utils/user';
import { MyReservation, getMyReservations, updateReservation, UpdateReservation } from 'services/reservation.service';
import { Rating as RatingComponent } from 'components/rating/rating';
import { rateBike, RateBikeInput } from 'services/rating.service';
import { Rating } from 'types/rating.type';
import { useUserStore } from 'stores/user.store';

const COLUMNS = ['bike', 'period of time', 'action'];

interface DataTableProps {
  columns: string[];
  data: (MyReservation & {
    onCancelReservation: () => void;
    onRateChange: (rating: Rating['rating']) => void;
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
              <Flex alignItems="center">
                <RatingComponent onChange={d.onRateChange} value={d.rating} edit={d.rating === undefined} />
                <Button variant="solid" onClick={d.onCancelReservation} size="sm">
                  cancel
                </Button>
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export const MyReservationsPage = (): JSX.Element => {
  const user = useUserStore((state) => state.user);
  const cacheKey = ['my-reservations', user?.id];
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
        toast({
          title: 'Reservation cancelled',
          description: 'Your reservation was successfully cancelled',
          position: 'bottom-right',
          status: 'success',
          variant: 'top-accent',
        });

        onClose();

        queryClient.setQueryData<{ myReservations: MyReservation[] } | undefined>(cacheKey, (oldData) => {
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
  const { mutate: rateBikeMutation, error: bikeMutationError } = useMutation(
    (updateVariables: RateBikeInput) => {
      return rateBike(updateVariables);
    },
    {
      onSuccess: (dataSuccess, updateVariables) => {
        toast({
          title: 'Bike rated!',
          position: 'bottom-right',
          status: 'success',
          variant: 'top-accent',
        });

        queryClient.setQueryData<{ myReservations: MyReservation[] } | undefined>(cacheKey, (oldData) => {
          return oldData
            ? {
                myReservations: oldData.myReservations.map((reservation) => {
                  if (reservation.bike.id === updateVariables.bikeId) {
                    return {
                      ...reservation,
                      rating: updateVariables.rating,
                    };
                  }

                  return reservation;
                }),
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
    onRateChange: (rating: Rating['rating']) => {
      rateBikeMutation({
        rating,
        bikeId: reservation.bike.id,
      });
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
