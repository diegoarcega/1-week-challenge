import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
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
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MyReservation, getMyReservations, updateReservation, UpdateReservation } from 'services/reservation.service';
import { Rating as RatingComponent } from 'components/rating/rating';
import { rateBike, RateBikeInput } from 'services/rating.service';
import { Rating } from 'types/rating.type';
import { useUserStore } from 'stores/user.store';
import { RequestStatus } from 'components/request-status/request-status';
import dayjs from 'utils/date.util';

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
            <Td>
              {d.bike.color} {d.bike.model}
            </Td>
            <Td>
              from {dayjs(d.periodOfTime.from).format('DD/MM/YYYY')} to {dayjs(d.periodOfTime.to).format('DD/MM/YYYY')}
            </Td>
            <Td>
              <Flex justifyItems="flex-start" flexDirection="column">
                <RatingComponent onChange={d.onRateChange} value={d.rating} edit={d.rating === undefined} />
                <Button onClick={d.onCancelReservation} size="sm" variant="link" mt="3" w="140px">
                  Cancel reservation
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
  const history = useHistory();
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

        queryClient.setQueryData<{ myReservations: MyReservation[] } | undefined>(cacheKey, (oldData) => {
          return oldData
            ? {
                myReservations: oldData.myReservations.filter(
                  (reservation) => reservation.id !== updateVariables.reservationId
                ),
              }
            : undefined;
        });

        onClose();
      },
    }
  );
  const { mutate: rateBikeMutation, error: rateBikeMutationError } = useMutation(
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
    if (mutationError || rateBikeMutationError) {
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
  }, [mutationError, rateBikeMutationError, toast, onClose]);

  function cancelReservation() {
    const reservationId = selectedReservationId.current;
    if (!reservationId) return;

    updateReservationMutation({
      status: 'cancelled',
      reservationId,
    });
  }

  const reservations = data?.myReservations.map((reservation) => ({
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
      <RequestStatus
        isLoading={isLoading}
        error={error}
        data={reservations}
        noResultsMessage={
          <Flex justifyContent="center" direction="column" alignItems="center">
            <Text>You have no reservations</Text>
            <Button size="lg" variant="solid" colorScheme="blue" mt="5" onClick={() => history.push('/dashboard')}>
              Reserve now!
            </Button>
          </Flex>
        }
      >
        {reservations ? <DataTable data={reservations} columns={COLUMNS} /> : null}
      </RequestStatus>
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
