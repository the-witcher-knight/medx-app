/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';

function InputComponent(props) {
  const { type, innerRef, ...rest } = props;

  switch (type) {
    case 'textarea':
      return <Textarea ref={innerRef} {...rest} />;
    default:
      return <Input type={type} ref={innerRef} {...rest} />;
  }
}

/**
 * ValidatedInput is a wrapper around Input that adds validation
 *
 * @param {Object} props with the following properties:
 * - control: the control object from react-hook-form
 * - name: the name of the input
 * - type: the type of the input
 * - label: the label of the input
 * - rules: the rules for the input
 * @see https://react-hook-form.com/api/useform/register
 * @returns the Input with validation
 */
export default function ValidatedInput({ control, name, type, label, size = 'md', rules, sx }) {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <FormControl sx={sx} isInvalid={!!error} size={size}>
          <FormLabel>{label}</FormLabel>
          <InputComponent
            type={type}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            innerRef={ref}
            size={size}
          />
          {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  );
}
