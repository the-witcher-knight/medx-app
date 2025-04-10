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
  Select,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toastify } from 'common/toastify';
import { fetchTestGroups } from 'store/testGroupSlice';

import { ActionButtonGroup, AppIcon, DataGrid, FilterGroup, withSuspense } from 'components';
import { FilterGroupSelect } from 'components/FilterGroup';

const initTestGroupColumns = () => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('name', {
      header: 'Tên nhóm xét nghiệm',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('level', {
      header: 'Mức độ',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('parentGroupName', {
      header: 'Thuộc nhóm',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => <ActionButtonGroup path="/test-group-mgmt" id={info.getValue()} />,
    }),
  ];
};

function TestGroupManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const columns = useMemo(() => initTestGroupColumns(), []);
  const { entities, loading, error } = useSelector((state) => state.testGroup);
  const [sorting, setSorting] = useState([{ id: 'CreatedOn', desc: true }]);
  const [filters, setFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 30,
  });

  const filterFields = useMemo(
    () => [
      {
        id: 'name',
        icon: 'address-book',
        label: 'Tên nhóm xét nghiệm',
      },
      {
        id: 'parrentGroupId',
        icon: 'bounding-box',
        label: 'ID nhóm cha',
        render: (control) => (
          <FilterGroupSelect
            control={control}
            name="parentGroupId"
            label="ID nhóm cha"
            icon="bounding-box"
          >
            {entities.map((entity) => (
              <option key={`test_group_${entity.id}`} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </FilterGroupSelect>
        ),
      },
    ],
    []
  );

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
      fetchTestGroups({
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
      fetchTestGroups({
        filters: [],
        sortBy: { fieldName: 'CreatedOn', accending: false },
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
          Quản lý nhóm xét nghiệm
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
          <FilterGroup
            fields={filterFields}
            onFilter={handleFilter}
            sx={{
              p: 2,
            }}
          >
            {(reset) => (
              <Tooltip label="Tải lại">
                <Button
                  size="sm"
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => {
                    handleRefresh();
                    reset();
                  }}
                >
                  <AppIcon icon="arrow-counter-clockwise" weight="bold" />
                </Button>
              </Tooltip>
            )}
          </FilterGroup>
        </Flex>

        <HStack>
          <Button size="sm" variant="solid" colorScheme="teal" onClick={handleCreate}>
            <AppIcon icon="plus" size={16} weight="bold" />
            &nbsp;Thêm nhóm xét nghiệm
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

export default withSuspense(TestGroupManagement, 'Quản lý nhóm xét nghiệm');
