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
import { GenderConstant } from 'constants';
import TestStatus from 'constants/test-status';
import dayjs from 'dayjs';
import { fetchDoctors } from 'store/doctorSlice';
import { fetchTests } from 'store/testManageSlice';

import { ActionButtonGroup, AppIcon, DataGrid, FilterGroup, withSuspense } from 'components';
import { ActionButton } from 'components/ActionButtonGroup';
import { FilterGroupGender, FilterGroupSelect } from 'components/FilterGroup';

const initTestColumns = () => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('code', {
      header: 'Mã bệnh nhân',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('patientName', {
      header: 'Tên bệnh nhân',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('personalId', {
      header: 'CCCD',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('testStatus', {
      header: 'Tình trạng xét nghiệm',
      cell(info) {
        const status = Object.keys(TestStatus)
          .filter((k) => TestStatus[k].value === info.getValue())
          .map((k) => TestStatus[k].name);

        return status;
      },
    }),
    columnHelper.accessor('dayOfTest', {
      header: 'Ngày xét nghiệm',
      cell: (info) => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm'),
    }),
    columnHelper.accessor('doctorName', {
      header: 'Tên bác sĩ',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('sex', {
      header: 'Giới tính',
      cell(info) {
        const gender = Object.keys(GenderConstant);
        return gender[info.getValue()];
      },
    }),
    columnHelper.accessor('phoneNo', {
      header: 'Số điện thoại',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => (
        <ActionButtonGroup path="/test-manage" id={info.getValue()}>
          {(location) => (
            <ActionButton
              location={location}
              path={`/test-manage/detail/${info.getValue()}`}
              colorScheme="orange"
              icon="note-pencil"
              label="Nhập thông tin xét nghiệm"
            />
          )}
        </ActionButtonGroup>
      ),
    }),
  ];
};

function TestManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const columns = useMemo(() => initTestColumns(), []);
  const { entities, loading, error } = useSelector((state) => state.testManage);
  const [sorting, setSorting] = useState([{ id: 'code', desc: false }]);
  const [filters, setFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 30,
  });

  const doctorState = useSelector((state) => state.doctor);

  const filterFields = useMemo(
    () => [
      {
        id: 'PersonalId',
        icon: 'identification-card',
        label: 'CCCD',
      },
      {
        id: 'PatientName',
        icon: 'address-book',
        label: 'Tên bệnh nhân',
      },
      {
        id: 'TestStatus',
        icon: 'check-square-offset',
        label: 'Tình trạng xét nghiệm',
        render: (control) => (
          <FilterGroupSelect
            control={control}
            name="TestStatus"
            icon="check-square-offset"
            label="Tình trạng"
          >
            {Object.keys(TestStatus).map((k) => (
              <option key={`test_status_${k}`} value={TestStatus[k].value}>
                {TestStatus[k].name}
              </option>
            ))}
          </FilterGroupSelect>
        ),
      },
      {
        id: 'PhoneNo',
        icon: 'phone',
        label: 'Số điện thoại',
      },
      {
        id: 'Code',
        icon: 'smiley-nervous',
        label: 'Mã bệnh nhân',
      },
      {
        id: 'Email',
        icon: 'envelope',
        label: 'Email',
      },
      {
        id: 'Sex',
        icon: 'gender-intersex',
        label: 'Giới tính',
        render: (control) => (
          <FilterGroupGender
            control={control}
            name="Sex"
            icon="gender-intersex"
            label="Giới tính"
          />
        ),
      },
      {
        id: 'DoctorId',
        icon: 'first-aid-kit',
        label: 'Bác sĩ',
        render: (control) => (
          <FilterGroupSelect control={control} name="DoctorId" icon="first-aid-kit" label="Bác sĩ">
            {doctorState.entities.map((doctor) => (
              <option key={`doctor_${doctor.id}`} value={doctor.id}>
                {doctor.fullName}
              </option>
            ))}
          </FilterGroupSelect>
        ),
      },
    ],
    [doctorState.entities]
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
      fetchTests({
        filters,
        sortBy: { fieldName: sorting[0]?.id, accending: !sorting[0]?.desc },
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
    );
  }, [filters, sorting, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    dispatch(
      fetchDoctors({
        filters,
        sortBy: { fieldName: 'fullName', accending: false },
        pageIndex: 1,
        pageSize: 30,
      })
    );
  }, []);

  useEffect(() => {
    if (error) {
      toastify({ title: 'Lỗi', description: error.message, status: 'error' });
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(
      fetchTests({
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
          Quản lý xét nghiệm
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

      <Flex alignItems="start" justifyContent="space-between" p={2}>
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

        <HStack p={2}>
          <Button size="sm" variant="solid" colorScheme="teal" onClick={handleCreate}>
            <AppIcon icon="plus" size={16} weight="bold" />
            &nbsp;Thêm xét nghiệm mới
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

export default withSuspense(TestManagement, 'Quản lý xét nghiệm');
