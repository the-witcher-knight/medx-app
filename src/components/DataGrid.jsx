import React from 'react';
import { Flex, Progress, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';

import AppIcon from './AppIcon';

/**
 * DataGrid component
 * @param {Object} props - props of DataGrid component
 * @returns React component
 */
function DataGrid({ tableDef, variant = 'striped', onSelectRow, sx }) {
  const handleSelectRow = (row) => {
    tableDef.toggleAllRowsSelected(false);
    if (onSelectRow != null) {
      onSelectRow(row.original);
    }
    row.toggleSelected(true);
  };

  return (
    <TableContainer sx={sx}>
      <Table position="relative" variant={variant}>
        <Thead position="sticky" top={0}>
          {tableDef.getHeaderGroups().map((headerGroup) => (
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
                          icon={header.column.getIsSorted() === 'desc' ? 'caret-down' : 'caret-up'}
                        />
                      )}
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          ))}

          {tableDef.getState().loading && (
            <Tr>
              <Td colSpan={10}>
                <Progress size="xs" isIndeterminate />
              </Td>
            </Tr>
          )}
        </Thead>
        <Tbody>
          {tableDef.getRowModel().rows?.length > 0 &&
            tableDef.getRowModel().rows.map((row) => (
              <Tr key={row.id} sx={row.getIsSelected() && { backgroundColor: 'blue.100' }}>
                {row.getVisibleCells().map((cell) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const { meta } = cell.column.columnDef;
                  return (
                    <Td
                      key={cell.id}
                      isNumeric={meta?.isNumeric}
                      onClick={() => handleSelectRow(row)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  );
                })}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default DataGrid;
