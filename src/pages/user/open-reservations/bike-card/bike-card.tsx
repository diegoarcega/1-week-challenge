import React from 'react';
import { Flex, Box, Image, useColorModeValue, Text, Button, Badge } from '@chakra-ui/react';
import { Rating as RatingComponent } from 'components/rating/rating';
import { Bike } from 'types/bike.type';
import { SelectedReservation } from '../open-reservations';

export const bikeImageSample = {
  imageURL:
    'https://www.10wallpaper.com/wallpaper/1366x768/1710/2017_Triumph_street_cup_Motorcycles_Wallpaper_1366x768.jpg',
};

interface BikeCardProps extends SelectedReservation {
  onReserve: (props: Omit<Bike, 'status'> & { ratingAverage?: number }) => void;
}

const BikeCard = React.memo(function BikeCard({
  id,
  model,
  color,
  location,
  status,
  onReserve,
  ratingAverage,
}: BikeCardProps): JSX.Element {
  function handleReserveBike() {
    onReserve({ id, model, color, location, ratingAverage });
  }
  return (
    <Flex justifyContent="center">
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        maxW="full"
        borderWidth="1px"
        rounded="md"
        shadow="lg"
        position="relative"
        flexDirection="column"
      >
        {status !== 'available' && (
          <Box position="absolute" top="1" right="0">
            <Badge>not available</Badge>
          </Box>
        )}
        <Flex
          maxW="full"
          minHeight="165px"
          justifyContent="center"
          overflow="hidden"
          roundedTop="md"
          backgroundClip="padding-box"
        >
          <Image src={bikeImageSample.imageURL} alt={`Picture of a ${color} ${model}`} roundedTop="md" maxW="full" />
        </Flex>

        <Flex p="6" direction="column" justifyContent="space-between" h={['auto', 'full']}>
          <Text fontSize="xl" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated casing="uppercase">
            {color} {model}
          </Text>

          <Text mb="2" as="address" isTruncated>
            {location}
          </Text>

          <Box mb="2">
            {ratingAverage !== undefined ? (
              <RatingComponent value={ratingAverage} edit={false} isHalf />
            ) : (
              <Text fontSize="xs" color="gray.500" as="i">
                No reviews yet
              </Text>
            )}

            <Button colorScheme="blue" w="full" onClick={handleReserveBike} isDisabled={status !== 'available'}>
              {status === 'available' ? 'Reserve now!' : 'Not available'}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
});

export { BikeCard };
