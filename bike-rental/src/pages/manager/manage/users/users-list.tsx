import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  ButtonGroup,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteUser, getAllUsers } from 'services/user.service';
import { User } from '../../../../types/user.type';

const COLUMNS = ['id', 'name', 'email', 'roles', 'actions'];

interface DataTableProps {
  columns: string[];
  data: (User & {
    onOpen: () => void;
    onDelete: () => void;
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
            <Td>{d.id}</Td>
            <Td>{d.name}</Td>
            <Td>{d.email}</Td>
            <Td>{d.roles.join(',')}</Td>
            <Td>
              <ButtonGroup size="sm" variant="outline" spacing="6">
                <Button onClick={d.onOpen} colorScheme="green">
                  OPEN
                </Button>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="link">DELETE</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Confirmation!</PopoverHeader>
                    <PopoverBody>
                      <VStack>
                        <Text>Are you sure you want delete this user?</Text>
                        <Button colorScheme="red" onClick={d.onDelete} variant="solid">
                          Yes, delete this user
                        </Button>
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </ButtonGroup>
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
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<RequestType>(cacheKey, getAllUsers);
  const { mutate, error: mutationError } = useMutation(
    ({ userId }: { userId: User['id'] }) => {
      return deleteUser(userId);
    },
    {
      onSuccess: (dataSuccess, { userId }) => {
        queryClient.setQueryData<RequestType | undefined>(cacheKey, (oldData) => {
          return oldData
            ? {
                users: oldData.users.filter((user) => user.id !== userId),
              }
            : undefined;
        });
      },
      // onError: (error) => {},
    }
  );

  useEffect(() => {
    if (mutationError) {
      toast({
        title: 'Error',
        description: 'We could not process this request to delete this user',
        duration: 5000,
        variant: 'top-accent',
        isClosable: true,
        status: 'error',
      });
    }
  }, [mutationError, toast]);

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
    onDelete: () => {
      mutate({ userId: user.id });
    },
  }));

  return <DataTable data={users} columns={COLUMNS} />;
};
