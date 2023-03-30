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

import { GenderConstant } from '../constants';

import AppIcon from './AppIcon';

export function FilterGroupItem({ control, icon, name, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <InputGroup size="sm" borderRadius="md" maxWidth="max-content">
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
            width="12rem"
          />
        </InputGroup>
      )}
    />
  );
}

export function FilterGroupSelect({ control, icon, name, label, children }) {
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
            as={Select}
            placeholder={label}
            onChange={onChange}
            onBlur={onBlur}
            variant="flushed"
            value={value}
            ref={ref}
            size="sm"
            width="12rem"
          >
            {children}
          </Input>
        </InputGroup>
      )}
    />
  );
}

export function FilterGroupGender({ control, icon, name, label }) {
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
            width="12rem"
          >
            <option key="sex_unidentify" value={GenderConstant['Khác']}>
              Không xác định
            </option>
            <option key="sex_male" value={GenderConstant.Nam}>
              Nam
            </option>
            <option key="sex_female" value={GenderConstant['Nữ']}>
              Nữ
            </option>
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
          {field.render ? (
            field.render(control)
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
