import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function withFormController(InputComponent, control) {
  function ControlledInput({ name, type, label, placeholder, size, sx, isDisabled }) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
          <FormControl sx={sx} isInvalid={!!error} size={size}>
            {label && <FormLabel>{label}</FormLabel>}
            <InputComponent
              type={type}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={ref}
              size={size}
              isDisabled={isDisabled}
              placeholder={placeholder}
            />
            {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
    );
  }

  ControlledInput.defaultProps = {
    name: '',
    type: '',
    label: null,
    size: 'md',
    sx: {},
    isDisabled: false,
    placeholder: null,
  };

  return ControlledInput;
}

withFormController.propTypes = {
  InputComponent: PropTypes.element,
  control: typeof {},
};

export default withFormController;
