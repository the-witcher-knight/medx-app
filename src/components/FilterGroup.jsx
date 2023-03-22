import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tooltip,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import AppIcon from './AppIcon';

function FilterGroupItem({ control, icon, name, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <InputGroup size="sm" borderRadius="md">
          <InputLeftElement pointerEvents="none">
            <AppIcon icon={icon} />
          </InputLeftElement>

          <Input
            type="text"
            variant="flushed"
            w="max-content"
            placeholder={label}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ref={ref}
          />
        </InputGroup>
      )}
    />
  );
}

function FilterGroupGender({ control, icon, name, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <InputGroup size="sm" borderRadius="md">
          <InputLeftElement pointerEvents="none" mr={2}>
            <AppIcon icon={icon} />
          </InputLeftElement>

          <Input
            as={Select}
            placeholder={label}
            onChange={onChange}
            onBlur={onBlur}
            variant="flushed"
            value={value}
            ref={ref}
            size="sm"
          >
            <option value={0}>Không xác định</option>
            <option value={1}>Nam</option>
            <option value={2}>Nữ</option>
          </Input>
        </InputGroup>
      )}
    />
  );
}

/**
 * FilterGroup component
 * @param {Object} props - FilterGroup component
 * @param {string} props.fields - all fields for filter `{id, label, type}`
 * @returns FilterGroup component
 */
function FilterGroup({ fields, onFilter, children, sx }) {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: fields.reduce((a, v) => ({ ...a, [v.id]: '' }), {}),
  });

  if (fields.lenght === 0) {
    return null;
  }

  const onSubmit = (values) => {
    const filters = Object.keys(values)
      .map((k) => ({ fieldName: k, value: values[k] }))
      .filter((f) => f.value !== '');

    onFilter(filters);
  };

  return (
    <Wrap as="form" id="search-form" sx={sx} spacing="2" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <WrapItem key={`filter_${field.id}`}>
          {field.id === 'sex' ? (
            <FilterGroupGender
              control={control}
              icon={field.icon}
              name={field.id}
              label={field.label}
            />
          ) : (
            <FilterGroupItem
              control={control}
              icon={field.icon}
              name={field.id}
              label={field.label}
            />
          )}
        </WrapItem>
      ))}

      <WrapItem>
        <Tooltip label="Lọc">
          <Button type="submit" form="search-form" size="sm">
            <AppIcon icon="manifying-glass" />
          </Button>
        </Tooltip>
      </WrapItem>

      {children && <WrapItem>{children(reset)}</WrapItem>}
    </Wrap>
  );
}

export default FilterGroup;
