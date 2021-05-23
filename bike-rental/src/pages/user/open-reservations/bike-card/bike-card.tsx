/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex, Circle, Box, Image, Badge, useColorModeValue, Text, Button } from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
import { Bike } from 'types/bike.type';
import { Rating } from 'types/rating.type';

const data = {
  isNew: true,
  imageURL: 'https://media.zigcdn.com/media/model/2021/Feb/right-side-view-1977503713_930x620.jpg',
  name: 'Wayfarer Classic',
  price: 4.5,
  rating: 4.2,
  numReviews: 34,
};

interface RatingProps {
  rating: number;
  numReviews: number;
}

function RatingComponent({ rating, numReviews }: RatingProps) {
  return (
    <Box d="flex" alignItems="center">
      {Array(5)
        .fill('')
        .map((_, i) => {
          const roundedRating = Math.round(rating * 2) / 2;
          if (roundedRating - i >= 1) {
            return <BsStarFill key={i} style={{ marginLeft: '1' }} color={i < rating ? 'teal.500' : 'gray.300'} />;
          }
          if (roundedRating - i === 0.5) {
            return <BsStarHalf key={i} style={{ marginLeft: '1' }} />;
          }
          return <BsStar key={i} style={{ marginLeft: '1' }} />;
        })}
      <Box as="span" ml="2" color="gray.600" fontSize="sm">
        {numReviews} review{numReviews > 1 && 's'}
      </Box>
    </Box>
  );
}

interface BikeCardProps extends Omit<Bike, 'id'> {
  onReserve: () => void;
}

function BikeCard({ model, color, location, onReserve }: BikeCardProps): JSX.Element {
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
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                New
              </Badge>
            )}
          </Box>
          <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            {color} {model}
          </Box>

          <Text mb="5" as="address">
            {location}
          </Text>
          <RatingComponent rating={data.rating} numReviews={data.numReviews} />
          <Button colorScheme="blue" w="full" mt="5" onClick={onReserve}>
            Reserve now!
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}

export { BikeCard };
