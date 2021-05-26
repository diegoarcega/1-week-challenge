import React from 'react';
import { Input as InputChakra, InputProps, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

interface Props extends InputProps {
  error?: string;
  isRequired?: boolean;
  name: string;
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
}

export const Input = (props: Props): JSX.Element => {
  const { error, isRequired, label, name, register, defaultValue, ...otherProps } = props;

  return (
    <>
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <InputChakra {...register(name)} defaultValue={defaultValue} id={name} {...otherProps} />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </>
  );
};
