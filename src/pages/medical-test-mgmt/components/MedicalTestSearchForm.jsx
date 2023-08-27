import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, InputGroup, InputLeftElement, Wrap, WrapItem } from '@chakra-ui/react';

import { AppIcon, withFormController } from 'components';

export const MedicalTestSearchFormField = React.forwardRef(
  ({ icon, label, name, value, type = 'text', ...props }, ref) => (
    <InputGroup size="sm" borderRadius="md" maxWidth="max-content">
      <InputLeftElement pointerEvents="none">
        <AppIcon icon={icon} />
      </InputLeftElement>

      <Input
        variant="flushed"
        w="max-content"
        name={name}
        type={type}
        placeholder={label}
        ref={ref}
        value={value}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </InputGroup>
  )
);

function MedicalTestSearchForm({ fields, sx }) {
  const { control } = useFormContext();

  const ControlledFormInput = withFormController(MedicalTestSearchFormField, control);

  if (fields.lenght === 0) {
    return null;
  }

  return (
    <Wrap as="form" id="test-form" sx={sx} spacing="2">
      {fields.map((field) => (
        <WrapItem key={`filter_${field.id}`}>
          {field.render ? (
            field.render(control)
          ) : (
            <ControlledFormInput icon={field.icon} name={field.id} label={field.label} />
          )}
        </WrapItem>
      ))}
    </Wrap>
  );
}

export default MedicalTestSearchForm;
