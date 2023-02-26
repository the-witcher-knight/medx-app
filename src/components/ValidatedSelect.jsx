import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormErrorMessage, FormLabel, Select } from '@chakra-ui/react';

function ValidatedSelect({ name, rules, control, label, sx, size = 'md', children }) {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <FormControl sx={sx} isInvalid={!!error} size={size}>
          <FormLabel>{label}</FormLabel>
          <Select onChange={onChange} onBlur={onBlur} value={value} ref={ref} size={size}>
            {children}
          </Select>
          {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  );
}

export default ValidatedSelect;
