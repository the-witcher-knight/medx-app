import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AppIcon from './AppIcon';
import ValidatedInput from './ValidatedInput';
import ValidatedSelect from './ValidatedSelect';

function FilterPopover({ fieldNames, onFilter }) {
  const schema = yup.object().shape({
    filters: yup.array().required('Vui lòng nhập bộ lọc'),
  });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      filters: [],
    },
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'filters',
  });

  const onSubmit = (values) => {
    onFilter(values.filters);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm">
          <AppIcon icon="funnel" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Lọc danh sách</PopoverHeader>
        <PopoverBody>
          <Box as="form" id="filter-form" overflow="auto" maxHeight="24rem" onSubmit={handleSubmit(onSubmit)}>
            {fields.map((item, index) => (
              <Box key={item.id} gap={2}>
                <Flex alignItems="end" gap={2}>
                  <ValidatedSelect size="sm" name={`filters[${index}].fieldName`} control={control}>
                    {fieldNames.map((fieldName) => (
                      <option key={`${item.id}_${fieldName.id}`} value={fieldName.id}>
                        {fieldName.columnDef.header}
                      </option>
                    ))}
                  </ValidatedSelect>

                  <Button type="button" size="sm" colorScheme="red" onClick={() => remove(index)}>
                    <AppIcon icon="x" />
                  </Button>
                </Flex>

                <Flex gap={2}>
                  <ValidatedInput sx={{ flex: 2 }} name={`filters[${index}].operation`} size="sm" control={control} />
                  <ValidatedInput sx={{ flex: 9 }} name={`filters[${index}].value`} size="sm" control={control} />
                </Flex>
              </Box>
            ))}

            <Flex mt={2} justifyContent="center">
              <Button type="button" size="sm" onClick={() => append({ fieldName: '', operation: '', value: '' })}>
                <AppIcon icon="plus" />
              </Button>
            </Flex>
          </Box>
        </PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <Button size="sm" colorScheme="teal" type="submit" form="filter-form">
            <AppIcon icon="check" />
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

export default FilterPopover;
