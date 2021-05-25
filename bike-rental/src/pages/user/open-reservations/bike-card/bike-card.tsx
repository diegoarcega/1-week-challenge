/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex, Box, Image, useColorModeValue, Text, Button } from '@chakra-ui/react';
import { Rating as RatingComponent } from 'components/rating/rating';
import { Bike } from 'types/bike.type';
import { Rating } from 'types/rating.type';

export const bikeImageSample = {
  imageURL:
    'https://www.10wallpaper.com/wallpaper/1366x768/1710/2017_Triumph_street_cup_Motorcycles_Wallpaper_1366x768.jpg',
};

interface BikeCardProps extends Omit<Bike, 'id' | 'status'> {
  onReserve: () => void;
  ratingAverage?: Rating['rating'];
}

function BikeCard({ model, color, location, onReserve, ratingAverage }: BikeCardProps): JSX.Element {
  return (
    <Flex justifyContent="center">
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        maxW="full"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
        flexDirection="column"
      >
        <Flex
          maxW="full"
          minHeight="165px"
          justifyContent="center"
          overflow="hidden"
          roundedTop="lg"
          backgroundClip="padding-box"
        >
          <Image src={bikeImageSample.imageURL} alt={`Picture of a ${color} ${model}`} roundedTop="lg" maxW="full" />
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

            <Button colorScheme="blue" w="full" onClick={onReserve}>
              Reserve now!
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

export { BikeCard };
