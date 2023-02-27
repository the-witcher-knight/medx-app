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

import ActionPopover from 'components/ActionPopover';
import DataGrid from 'components/DataGrid';
import FilterPopover from 'components/FilterPopover';
import withSuspense from 'components/withSuspense';

import { fetchDoctors } from './doctorSlice';

const initDoctorColumns = () => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('fullName', {
      header: 'Họ & Tên',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phoneNo', {
      header: 'Số điện thoại',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('title', {
      header: 'Tiêu đề',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('sex', {
      header: 'Giới tính',
      cell(info) {
        const gender = ['Nữ', 'Nam', 'Khác'];
        return gender[info.getValue()];
      },
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => <ActionPopover path="/doctor" id={info.getValue} />,
    }),
  ];
};

function DoctorManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const columns = useMemo(() => initDoctorColumns(), []);
  const { entities, loading, error } = useSelector((state) => state.doctor);
  const [sorting, setSorting] = useState([{ id: 'fullName', desc: false }]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30,
  });
  const [filters, setFilters] = useState([]);

  const tableDef = useReactTable({
    columns,
    data: entities,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      loading,
    },
  });

  useEffect(() => {
    dispatch(
      fetchDoctors({
        filters,
        sortBy: { fieldName: sorting[0]?.id, accending: !sorting[0]?.desc },
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
    );
  }, [filters, sorting, pagination]);

  useEffect(() => {
    if (error) {
      toastify({ title: 'Lỗi', description: error.message, status: 'error' });
    }
  }, [error]);

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
          Quản lý bác sĩ
        </Heading>

        <Flex flex={1} gap={2}>
          <Button size="sm" flex={1}>
            <AppIcon icon="caret-left" weight="bold" />
          </Button>

          <Input
            size="sm"
            flex={1}
            min={0}
            type="number"
            variant="ghost"
            defaultValue={pagination.pageIndex + 1}
            w="max-content"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              tableDef.setPageIndex(page);
            }}
          />

          <Button size="sm" flex={1}>
            <AppIcon icon="caret-right" weight="bold" />
          </Button>

          <Select
            size="sm"
            variant="ghost"
            flex={8}
            defaultValue={pagination.pageSize}
            onChange={(e) => {
              tableDef.setPageSize(e.target.value);
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
              min={0}
              type="number"
              variant="filled"
              defaultValue={pagination.pageIndex + 1}
              w="max-content"
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                tableDef.setPageIndex(page);
              }}
            />
          </InputGroup>

          <FilterPopover fieldNames={tableDef.getAllColumns()} onFilter={handleFilter} />
        </Flex>

        <HStack>
          <Button size="sm" variant="solid" colorScheme="teal" onClick={handleCreate}>
            <AppIcon icon="plus" size={16} weight="bold" />
            &nbsp;Thêm bác sĩ
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

export default withSuspense(DoctorManagement, 'Quản lý bác sĩ');
