import React from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox, FormControl, FormErrorMessage } from '@chakra-ui/react';

/**
 * ValidatedCheck is a wrapper around FormControl that adds validation
 *
 * @param {Object} props with the following properties:
 * - control: the control object from react-hook-form
 * - name: the name of the input
 * - label: the label of the input
 * - rules: the rules for the input
 * @see https://react-hook-form.com/api/useform/register
 * @returns the Checkbox with validation
 */
export default function ValidatedCheck({ control, name, label, rules }) {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <FormControl isInvalid={!!error}>
          <Checkbox isChecked={!!value} value={value} onChange={onChange} onBlur={onBlur} ref={ref}>
            {label}
          </Checkbox>
          {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  );
}
