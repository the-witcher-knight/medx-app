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
import { fetchTestCategories } from 'store/testCategorySlice';
import { fetchTestGroups } from 'store/testGroupSlice';
import { fetchUnits } from 'store/unitSlice';

import { ActionButtonGroup, AppIcon, DataGrid, FilterGroup, withSuspense } from 'components';
import { FilterGroupSelect } from 'components/FilterGroup';

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
    columnHelper.accessor('displayLimit', {
      header: 'Chỉ số bình thường',
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
    columnHelper.accessor('isShowTrueFalseResult', {
      header: 'Chọn kết quả',
      cell: (info) =>
        info.getValue() ? (
          <AppIcon weight="bold" icon="check" />
        ) : (
          <AppIcon weight="bold" icon="x" />
        ),
    }),
    columnHelper.accessor('isPrintReceipt', {
      header: 'In hóa đơn',
      cell: (info) =>
        info.getValue() ? (
          <AppIcon weight="bold" icon="check" />
        ) : (
          <AppIcon weight="bold" icon="x" />
        ),
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => <ActionButtonGroup path="/test-category" id={info.getValue()} />,
    }),
  ];
};

const initFilterFields = (units, groups) => [
  {
    id: 'name',
    icon: 'address-book',
    label: 'Tên loại',
  },
  {
    id: 'code',
    icon: 'eyedropper-sample',
    label: 'Mã xét nghiệm',
  },
  {
    id: 'lowerBound',
    icon: 'caret-down',
    label: 'Ngưỡng thấp',
  },
  {
    id: 'upperBound',
    icon: 'caret-up',
    label: 'Ngưỡng cao',
  },
  {
    id: 'unitId',
    icon: 'percent',
    label: 'Mã đơn vị',
    render: (control) => (
      <FilterGroupSelect control={control} name="unitId" icon="percent" label="Mã đơn vị">
        {units.map((u) => (
          <option key={`unit_${u.id}`} value={u.id}>
            {u.name}
          </option>
        ))}
      </FilterGroupSelect>
    ),
  },
  {
    id: 'groupId',
    icon: 'bounding-box',
    label: 'Mã nhóm xét nghiệm',
    render: (control) => (
      <FilterGroupSelect
        control={control}
        name="groupId"
        icon="bounding-box"
        label="Mã nhóm xét nghiệm"
      >
        {groups.map((gr) => (
          <option key={`unit_${gr.id}`} value={gr.id}>
            {gr.name}
          </option>
        ))}
      </FilterGroupSelect>
    ),
  },
  {
    id: 'price',
    icon: 'currency-dollar',
    label: 'Giá tiền',
  },
];

function TestCategoryManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const columns = useMemo(() => initTestCategoryColumns(), []);
  const { entities, loading, updateSuccess, error } = useSelector((state) => state.testCategory);
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [filters, setFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 30,
  });

  const unitState = useSelector((state) => state.unit);
  const testGroupState = useSelector((state) => state.testGroup);
  const filterFields = useMemo(
    () => initFilterFields(unitState.entities, testGroupState.entities),
    [unitState.entities, testGroupState.entities]
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
      fetchUnits({
        sortBy: { fieldName: 'name', accending: true },
        pageIndex: 1,
        pageSize: 10000,
      })
    );
    dispatch(
      fetchTestGroups({
        sortBy: { fieldName: 'name', accending: true },
        pageIndex: 1,
        pageSize: 10000,
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      fetchTestCategories({
        filters,
        sortBy: { fieldName: sorting[0]?.id, accending: !sorting[0]?.desc },
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
    );
  }, [filters, sorting, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(
        fetchTestCategories({
          filters,
          sortBy: { fieldName: sorting[0]?.id, accending: !sorting[0]?.desc },
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        })
      );
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (error) {
      toastify({ title: 'Lỗi', description: error.message, status: 'error' });
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(
      fetchTestCategories({
        filters: [],
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
