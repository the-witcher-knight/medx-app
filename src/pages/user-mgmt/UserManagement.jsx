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
  Stack,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { userAPI } from 'apis';
import { toastify } from 'common/toastify';
import { fetchUsers } from 'store/userSlice';

import { AppIcon, DataGrid, FilterGroup, withSuspense } from 'components';
import { ActionButton } from 'components/ActionButtonGroup';

const initUserColumns = (location) => {
  const columnHelper = createColumnHelper();

  const handleResetPassword = (id) => {
    userAPI.resetByID(id).then(
      (resp) => {
        // eslint-disable-next-line no-console
        console.log(resp);
        toastify({
          title: 'Reset mật khẩu',
          description: 'Reset mật khẩu cho user thành công',
          status: 'success',
        });
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        toastify({
          title: 'Reset mật khẩu',
          description: 'Reset mật khẩu cho user thất bại',
          status: 'error',
        });
      }
    );
  };

  return [
    columnHelper.accessor('userName', {
      header: 'tên tài khoản',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => (
        <Stack direction="row" spacing={2}>
          <Button colorScheme="teal" size="sm" onClick={() => handleResetPassword(info.getValue())}>
            <AppIcon icon="pen" />
          </Button>

          <ActionButton
            location={location}
            path={`/user/${info.getValue()}/delete`}
            colorScheme="red"
            label="Xóa"
            icon="trash"
          />
        </Stack>
      ),
    }),
  ];
};

const filterFields = [
  {
    id: 'userName',
    icon: 'identification-card',
    label: 'Tên tài khoản',
  },
];

function UserManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const columns = useMemo(() => initUserColumns(location), []);
  const { entities, loading, error } = useSelector((state) => state.user);
  const [sorting, setSorting] = useState([{ id: 'email', desc: false }]);
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
      fetchUsers({
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
      fetchUsers({
        filters: [],
        sortBy: { fieldName: 'fullName', accending: true },
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
          Quản lý người dùng
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
            &nbsp;Thêm người dùng
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

export default withSuspense(UserManagement, 'Quản lý người dùng');
