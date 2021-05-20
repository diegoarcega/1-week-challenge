import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Input as InputChakra, InputProps, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

interface Props extends InputProps {
  error?: string;
  isRequired?: boolean;
  name: string;
  label?: string;
  control: Control;
}

export const Input = (props: Props): JSX.Element => {
  const { error, isRequired, label, name, control, defaultValue, ...otherProps } = props;

  return (
    <>
      <FormControl isInvalid={!!error}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => <InputChakra {...otherProps} {...field} />}
        />

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </>
  );
};
