/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex, Circle, Box, Image, Badge, useColorModeValue, Text, Button } from '@chakra-ui/react';
import { Rating as RatingComponent } from 'components/rating/rating';
import { Bike } from 'types/bike.type';
import { Rating } from 'types/rating.type';

const data = {
  isNew: true,
  imageURL:
    'https://www.10wallpaper.com/wallpaper/1366x768/1710/2017_Triumph_street_cup_Motorcycles_Wallpaper_1366x768.jpg',
  name: 'Yellow Tr',
};

interface BikeCardProps extends Omit<Bike, 'id'> {
  onReserve: () => void;
  ratingAverage?: Rating['rating'];
}

function BikeCard({ model, color, location, onReserve, ratingAverage }: BikeCardProps): JSX.Element {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        {data.isNew && <Circle size="10px" position="absolute" top={2} right={2} bg="red.200" />}
        <Box maxW="full">
          <Image src={data.imageURL} alt={`Picture of ${data.name}`} roundedTop="lg" />
        </Box>

        <Box p="6">
          <Box d="flex" alignItems="baseline">
            {data.isNew && (
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="yellow">
                New
              </Badge>
            )}
          </Box>
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
          </Box>
          <Button colorScheme="blue" w="full" onClick={onReserve}>
            Reserve now!
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}

export { BikeCard };
