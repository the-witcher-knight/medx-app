import React from 'react';
import { Button, Flex, Input, Select } from '@chakra-ui/react';

import AppIcon from './AppIcon';

function AppPagination({ loading, pagination, setPagination, sx }) {
  return (
    <Flex gap={2} sx={sx} flexBasis="33.33%">
      <Button
        size="sm"
        flex={1}
        disabled={loading}
        onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
      >
        <AppIcon icon="caret-left" weight="bold" />
      </Button>

      <Input
        size="sm"
        flex={1}
        min={1}
        type="number"
        variant="ghost"
        w="max-content"
        disabled={loading}
        value={pagination.pageIndex}
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) : 1;
          setPagination({ ...pagination, pageIndex: Math.max(page, 1) });
        }}
      />

      <Button
        size="sm"
        flex={1}
        disabled={loading}
        onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
      >
        <AppIcon icon="caret-right" weight="bold" />
      </Button>

      <Select
        size="sm"
        variant="ghost"
        flex={8}
        defaultValue={pagination.pageSize}
        onChange={(e) => {
          const pageSize = e.target.value ? Number(e.target.value) : 30;
          setPagination({ ...pagination, pageSize });
        }}
      >
        {[30, 50, 100].map((size) => (
          <option key={size} value={size}>
            Số trang {size}
          </option>
        ))}
      </Select>
    </Flex>
  );
}

export default AppPagination;
