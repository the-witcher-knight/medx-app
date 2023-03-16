import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toastify } from 'common/toastify';
import AppIcon from 'icon/AppIcon';

import { ActionPopover, DataGrid, FilterPopover, withSuspense } from 'components';

import { fetchAll } from './testCategorySlice';

const initTestCategoryColumns = () => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('name', {
      header: 'Tên loại xét nghiệm',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('lowerBound', {
      header: 'Chỉ số thấp',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('upperBound', {
      header: 'Chỉ số cao',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('unitName', {
      header: 'Đơn vị',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('groupName', {
      header: 'Nhóm xét nghiệm',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Giá',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => <ActionPopover path="/test-category" id={info.getValue()} />,
    }),
  ];
};

function TestCategoryManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const columns = useMemo(() => initTestCategoryColumns(), []);
  const { entities, loading, error } = useSelector((state) => state.testCategory);
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [filters, setFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 30,
  });

  const tableDef = useReactTable({
    columns,
    data: entities,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      loading,
    },
  });

  useEffect(() => {
    dispatch(
      fetchAll({
        filters,
        sortBy: { fieldName: sorting[0]?.id, accending: !sorting[0]?.desc },
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
    );
  }, [filters, sorting, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (error) {
      toastify({ title: 'Lỗi', description: error.message, status: 'error' });
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(
      fetchAll({
        filters,
        sortBy: { fieldName: 'name', accending: true },
        pageIndex: 1,
        pageSize: 30,
      })
    );
  };

  const handleCreate = () => {
    navigate('new', { state: { background: location } });
  };

  const handleFilter = (values) => {
    setFilters(values);
  };

  return (
    <Box sx={{ display: 'flex', flexDir: 'column', gap: 3 }}>
      <Flex alignItems="center" p={2}>
        <Heading flex={3} as="h2" size="md" color={useColorModeValue('teal.500', 'teal.300')}>
          Quản lý loại xét nghiệm
        </Heading>

        <Flex flex={1} gap={2}>
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
      </Flex>

      <Flex alignItems="center" justifyContent="space-between" p={2}>
        <Flex gap={2}>
          <InputGroup size="sm" borderRadius="md">
            <InputLeftElement pointerEvents="none">
              <AppIcon icon="manifying-glass" />
            </InputLeftElement>

            <Input
              min={1}
              type="number"
              variant="filled"
              w="max-content"
              placeholder='Tìm kiếm theo "ID"'
              disabled
            />
          </InputGroup>

          <FilterPopover fieldNames={tableDef.getAllColumns()} onFilter={handleFilter} />

          <Button size="sm" variant="solid" colorScheme="blue" onClick={() => handleRefresh()}>
            <AppIcon icon="arrow-counter-clockwise" weight="bold" />
          </Button>
        </Flex>

        <HStack>
          <Button size="sm" variant="solid" colorScheme="teal" onClick={handleCreate}>
            <AppIcon icon="plus" size={16} weight="bold" />
            &nbsp;Thêm loại xét nghiệm
          </Button>
        </HStack>
      </Flex>

      <DataGrid
        variant="striped"
        tableDef={tableDef}
        sx={{
          h: '27rem',
          minH: { base: '10rem', md: '27rem' },
          m: 2,
          shadow: 'md',
          overflow: 'auto',
          resize: 'vertical',
        }}
      />
    </Box>
  );
}

export default withSuspense(TestCategoryManagement, 'Quản lý loại xét nghiệm');
