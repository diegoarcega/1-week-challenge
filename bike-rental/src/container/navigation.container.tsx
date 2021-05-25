import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import * as Storage from 'utils/storage.util';
import { AUTHENTICATION_TOKEN_KEY } from 'constants/storage.constant';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Heading,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useUserStore } from 'stores/user.store';

/* eslint-disable react/require-default-props, react/no-unused-prop-types */
export interface NavItem {
  label: string;
  subLabel?: string;
  children?: NavItem[];
  href?: string;
}
/* eslint-enable react/require-default-props, react/no-unused-prop-types */

interface Props {
  options: NavItem[];
}

export default function Navigation({ options }: Props): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();
  const history = useHistory();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  function handleLogout() {
    Storage.removeItem(AUTHENTICATION_TOKEN_KEY);
    clearUser();
    history.push('/login');
  }

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Container maxW="container.xl" display="flex">
          <Flex flex={{ base: 1 }} justify={{ base: 'start' }}>
            <Heading
              textAlign={useBreakpointValue({ base: 'left' })}
              fontSize="24"
              mb="0"
              color="blue.300"
              fontWeight="black"
              letterSpacing="tighter"
            >
              BikeWorld
            </Heading>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav options={options} />
            </Flex>
          </Flex>

          <Stack flex={{ base: 1, md: 0 }} justify="flex-end" direction="row" spacing={6}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="link" size="sm" fontWeight="300">
                {user?.name}
              </MenuButton>
              <MenuList>
                <MenuItem
                  as={NavLink}
                  to={user?.roles.includes('manager') ? '/manager/my-account' : '/dashboard/my-account'}
                >
                  My account
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Container>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav options={options} />
      </Collapse>
    </Box>
  );
}

function DesktopNav({ options }: Props) {
  return (
    <Stack direction="row" spacing={4}>
      {options.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link
                p={2}
                as={NavLink}
                to={navItem.href ?? '#'}
                fontSize="lg"
                fontWeight={500}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                color={useColorModeValue('gray.600', 'gray.200')}
                _hover={{
                  textDecoration: 'none',
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  color: useColorModeValue('gray.800', 'white'),
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={useColorModeValue('white', 'gray.800')}
                p={4}
                rounded="xl"
                minW="sm"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
}

function DesktopSubNav({ label, href, subLabel }: NavItem) {
  return (
    <Link
      as={NavLink}
      to={href ?? '#'}
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text transition="all .3s ease" _groupHover={{ color: 'blue.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize="sm">{subLabel}</Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="blue.400" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
}

function MobileNav({ options }: Props) {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {options.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
}

function MobileNavItem({ label, children, href }: NavItem) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={NavLink}
        to={href ?? '#'}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align="start"
        >
          {children &&
            children.map((child) => (
              <Link as={NavLink} to={child.href ?? '#'} key={child.label} py={2}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}
