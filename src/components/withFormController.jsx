import React from 'react';
import { Controller } from 'react-hook-form';

export default function withFormController(InputComponent, control) {
  return function ControlledInput(props) {
    const { name } = props;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <InputComponent
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ref={ref}
          />
        )}
      />
    );
  };
}
