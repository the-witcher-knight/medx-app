/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import AppIcon from 'icon/AppIcon';

function AppTable({ data, columns, ...rest }) {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30,
  });
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <Box>
      <TableContainer {...rest}>
        <Table position="relative" variant="striped">
          <Thead position="sticky" top={0}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id} bgColor="chakra-body-bg">
                {headerGroup.headers.map((header) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const { meta } = header.column.columnDef;

                  return (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}
                    >
                      <Flex justifyContent="space-between">
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getIsSorted() && (
                          <AppIcon
                            weight="fill"
                            size={16}
                            icon={
                              header.column.getIsSorted() === 'desc' ? 'caret-down' : 'caret-up'
                            }
                          />
                        )}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const { meta } = cell.column.columnDef;
                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justifyContent="flex-end" justifyItems="center" gap={4} p={2}>
        <Flex gap={1}>
          <Button>
            <AppIcon icon="caret-double-left" weight="bold" />
          </Button>
          <Button>
            <AppIcon icon="caret-left" weight="bold" />
          </Button>
          <Button>
            <AppIcon icon="caret-right" weight="bold" />
          </Button>
          <Button>
            <AppIcon icon="caret-double-right" weight="bold" />
          </Button>
        </Flex>

        <Flex gap={2}>
          <Text>Đến trang</Text>

          <Input
            type="number"
            defaultValue={pagination.pageIndex + 1}
            w="max-content"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />

          <Select
            defaultValue={pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(e.target.value);
            }}
          >
            {[30, 50, 100].map((size) => (
              <option key={size} value={size}>
                Số trang {size}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>
    </Box>
  );
}

export default AppTable;
