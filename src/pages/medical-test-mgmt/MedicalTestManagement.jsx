import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Split from 'react-split';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useCheckboxGroup,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import reportAPI from 'apis/report';
import CurrencyFormatter from 'common/money-formatter';
import { toastify } from 'common/toastify';
import { GenderConstant } from 'constants';
import TestStatus from 'constants/test-status';
import dayjs from 'dayjs';
import { fetchDoctors } from 'store/doctorSlice';
import { fetchIndications } from 'store/indicationSlice';
import { fetchPatientByCode, fetchPatientByPersonalID } from 'store/patientSlice';
import {
  createTest,
  fetchTest,
  fetchTestDetails,
  fetchTestIndications,
  fetchTests,
  updateTest,
  updateTestDetail,
  updateTestIndication,
} from 'store/testManageSlice';

import { AppIcon, DataGrid, withFormController, withSuspense } from 'components';
import { FilterGroupGender, FilterGroupItem, FilterGroupSelect } from 'components/FilterGroup';
import LinearPagination from 'components/LinearPagination';

import './MedicalTestManagement.css';

const initTestFilter = (doctors) => [
  {
    id: 'fullName',
    icon: 'address-book',
    label: 'Tên bệnh nhân',
  },
  {
    id: 'phoneNo',
    icon: 'phone',
    label: 'Số điện thoại',
  },
  {
    id: 'code',
    icon: 'smiley-nervous',
    label: 'Mã bệnh nhân',
    hasSearch: true,
  },
  {
    id: 'personalId',
    icon: 'identification-card',
    label: 'CCCD',
    hasSearch: true,
  },
  {
    id: 'address',
    icon: 'map-pin',
    label: 'Địa chỉ',
  },
  {
    id: 'birthday',
    icon: 'calendar',
    label: 'Ngày sinh',
    render: (control) => (
      <FilterGroupItem
        control={control}
        icon="calendar"
        name="birthdayy"
        label="Ngày sinh"
        type="date"
      />
    ),
  },
  {
    id: 'email',
    icon: 'envelope',
    label: 'Email',
  },
  {
    id: 'sex',
    icon: 'gender-intersex',
    label: 'Giới tính',
    render: (control) => (
      <FilterGroupGender control={control} name="sex" icon="gender-intersex" label="Giới tính" />
    ),
  },
  {
    id: 'diagnose',
    icon: 'first-aid-kit',
    label: 'Chuẩn đoán',
  },
  {
    id: 'testStatus',
    icon: 'check-square-offset',
    label: 'Tình trạng xét nghiệm',
    render: (control) => (
      <FilterGroupSelect
        control={control}
        name="testStatus"
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
    id: 'doctorId',
    icon: 'first-aid-kit',
    label: 'Bác sĩ',
    render: (control) => (
      <FilterGroupSelect control={control} name="doctorId" icon="first-aid-kit" label="Bác sĩ">
        {doctors.map((doctor) => (
          <option key={`doctor_${doctor.id}`} value={doctor.id}>
            {doctor.fullName}
          </option>
        ))}
      </FilterGroupSelect>
    ),
  },
];

const FormInput = React.forwardRef(
  ({ icon, label, name, value, onSearch, hasSearch, ...props }, ref) => (
    <InputGroup size="sm" borderRadius="md" maxWidth="max-content">
      <InputLeftElement pointerEvents="none">
        <AppIcon icon={icon} />
      </InputLeftElement>

      <Input
        type="text"
        variant="flushed"
        w="max-content"
        placeholder={label}
        ref={ref}
        value={value}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />

      {hasSearch && (
        <InputRightElement>
          <Button
            size="sm"
            h="1.5rem"
            colorScheme="gray"
            onClick={() => {
              onSearch(name)(value);
            }}
          >
            <AppIcon icon="manifying-glass" weight="bold" />
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  )
);

function MixtureForm({ fields, onSearch, onFilter, children, sx }) {
  const { handleSubmit, control, reset } = useFormContext();

  const ControlledFormInput = withFormController(FormInput, control);

  if (fields.lenght === 0) {
    return null;
  }

  const onSubmit = (values) => {
    const filters = Object.keys(values)
      .map((k) => ({ fieldName: k, value: values[k] }))
      .filter((f) => f.value !== '');

    onFilter(filters);
  };

  return (
    <Wrap as="form" id="test-form" sx={sx} spacing="2" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <WrapItem key={`filter_${field.id}`}>
          {field.render ? (
            field.render(control)
          ) : (
            <ControlledFormInput
              icon={field.icon}
              name={field.id}
              label={field.label}
              hasSearch={field.hasSearch}
              onSearch={onSearch}
            />
          )}
        </WrapItem>
      ))}

      {children && <WrapItem>{children(reset)}</WrapItem>}
    </Wrap>
  );
}

function TestDetailResultForm({ data, onSave }) {
  const inputRef = useRef();

  const handleSaveDetail = () => {
    const newData = { ...data };
    if (typeof inputRef.current.value === 'number') {
      newData.result = inputRef.current.value;
    }

    if (typeof inputRef.current.value === 'string') {
      newData.resultText = inputRef.current.value;
    }

    onSave(newData);
  };

  return (
    <InputGroup size="md" width="15rem">
      <Input pr="4.5rem" defaultValue={data.resultText || data.result} ref={inputRef} />
      <InputRightElement width="3rem">
        <Button size="sm" type="button" onClick={handleSaveDetail}>
          <AppIcon icon="floppy-disk" weight="bold" />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

const initTestColumns = (handleClickView, handleClickPrint) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('id', {
      header: '',
      cell(info) {
        const onClickEye = () => {
          info.table.toggleAllRowsSelected(false);
          handleClickView(info.getValue());
          info.row.toggleSelected(true);
        };

        return (
          <HStack>
            <Tooltip label="Xem chi tiết">
              <Button
                type="button"
                colorScheme={info.row.getIsSelected() ? 'teal' : 'gray'}
                onClick={onClickEye}
              >
                <AppIcon icon="eye" />
              </Button>
            </Tooltip>

            <Tooltip label="In hóa đơn">
              <Button
                type="button"
                colorScheme="gray"
                onClick={() => handleClickPrint('TestReceipt')(info.getValue())}
              >
                <AppIcon icon="currency-dollar" />
              </Button>
            </Tooltip>

            <Tooltip label="In kết quả">
              <Button
                type="button"
                colorScheme="gray"
                onClick={() => handleClickPrint('TestResult')(info.getValue())}
              >
                <AppIcon icon="printer" />
              </Button>
            </Tooltip>
          </HStack>
        );
      },
    }),
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
    columnHelper.accessor('diagnose', {
      header: 'Chuẩn đoán',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('testStatus', {
      header: 'Tình trạng xét nghiệm',
      cell(info) {
        const status = Object.keys(TestStatus)
          .filter((k) => TestStatus[k].value === info.getValue())
          .map((k) => TestStatus[k]);

        return (
          <Badge sx={{ p: 1, borderRadius: '3rem' }} colorScheme={status[0].colorSchema}>
            {status[0].name}
          </Badge>
        );
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
    columnHelper.accessor('phoneNumber', {
      header: 'Số điện thoại',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
  ];
};

function MedicalTestManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Search + Input form state

  const mixtureFormMethods = useForm();

  const [selectedTestID, setSelectedTestID] = useState();

  // Test data

  const handleFilterTest = () => {
    const { doctorId, patientName, testStatus, phoneNo, personalId, code, email, sex } =
      mixtureFormMethods.getValues();

    const filterObj = { doctorId, patientName, testStatus, phoneNo, personalId, code, email, sex };

    const testFilters = Object.keys(filterObj)
      .filter((k) => filterObj[k] !== undefined && filterObj[k] !== '' && filterObj[k] !== null)
      .map((k) => ({ fieldName: k, value: filterObj[k] }));

    dispatch(
      fetchTests({
        filters: testFilters,
        sortBy: { fieldName: 'createdOn', accending: false },
        pageIndex: 1,
        pageSize: 50,
      })
    );
  };

  const handleSaveTest = () => {
    const values = mixtureFormMethods.getValues();

    dispatch(
      updateTest({
        id: selectedTestID,
        patientName: values.patientName,
        code: values.code,
        doctorId: values.doctorId,
        diagnose: values.diagnose,
        phoneNumber: values.phoneNumber,
        dayOfTest: values.dayOfTest,
        testStatus: Number(values.testStatus),
      })
    );
  };

  const handleClickView = (testID) => {
    setSelectedTestID(testID);
    dispatch(fetchTest(testID));
    dispatch(fetchTestDetails(testID));
    dispatch(fetchTestIndications(testID));
  };

  const handleClickPrint = (type) => (testID) => {
    reportAPI.get({ testName: type, testID }).then((res) => res.data);
  };

  const handleClickDuplicate = () => {
    const { patientName, personalId, doctorId, diagnose, phoneNumber, dayOfTest } =
      mixtureFormMethods.getValues();
    const saveData = { patientName, personalId, doctorId, diagnose, phoneNumber, dayOfTest };

    dispatch(createTest(saveData));
  };

  const handleSearchPatient = (type) => {
    switch (type) {
      case 'code':
        return (keyword) => {
          dispatch(fetchPatientByCode(keyword));
        };
      case 'personalId':
        return (keyword) => {
          dispatch(fetchPatientByPersonalID(keyword));
        };
      default:
        return null;
    }
  };

  const columns = useMemo(() => initTestColumns(handleClickView, handleClickPrint), []);
  const testManageState = useSelector((state) => state.testManage);
  const [sorting, setSorting] = useState([{ id: 'code', desc: true }]);
  const [filters, setFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20,
  });

  const tableDef = useReactTable({
    columns,
    data: testManageState.entities,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    state: {
      sorting,
      loading: testManageState.loading,
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
    if (testManageState.entity) {
      Object.keys(testManageState.entity).forEach((k) => {
        mixtureFormMethods.setValue(k, testManageState.entity[k]);
      });
    }
  }, [testManageState.entity]);

  useEffect(() => {
    if (testManageState.error) {
      toastify({
        title: 'Lỗi quản lý xét nghiệm',
        description: testManageState.error.message,
        status: 'error',
      });
    }
  }, [testManageState.error]);

  const handleSaveDetail = (data) => {
    const { id, result, resultText } = data;
    dispatch(updateTestDetail({ id, result, resultText }));
  };

  const handlePageChange = (pageNum) => {
    setPagination((pgn) => ({ pageIndex: pageNum, pageSize: pgn.pageSize }));
  };

  const handlePageSizeChange = (e) => {
    const { value } = e.target;
    setPagination((pgn) => ({ pageIndex: pgn.pageIndex, pageSize: value }));
  };

  const handleRefresh = () => {
    dispatch(
      fetchTests({
        filters: [],
        sortBy: { fieldName: 'CreatedOn', accending: false },
        pageIndex: 1,
        pageSize: 30,
      })
    );
  };

  // Indication state

  const indicationState = useSelector((state) => state.indication);
  const indicationsMethods = useCheckboxGroup({
    defaultValue: [''],
  });

  useEffect(() => {
    dispatch(
      fetchIndications({
        filters: [],
        sortBy: { fieldName: 'CreatedOn', accending: false },
        pageIndex: 1,
        pageSize: 1000,
      })
    );
  }, []);

  useEffect(() => {
    const inds = indicationState.entities
      .filter((indication) => testManageState.testIndications.includes(indication.id))
      .map((indication) => indication.id);

    indicationsMethods.setValue(inds);
  }, [indicationState.entities, testManageState.testIndications]);

  const handleSaveTestIndications = () => {
    dispatch(
      updateTestIndication({
        testId: selectedTestID,
        testIndications: indicationsMethods.value.map((v) => ({
          indicationId: v,
          testStatus: 1,
        })),
      })
    );
  };

  const handleRefreshIndications = () => {
    dispatch(
      fetchIndications({
        filters: [],
        sortBy: { fieldName: 'CreatedOn', accending: false },
        pageIndex: 1,
        pageSize: 1000,
      })
    );
  };

  // Doctor start

  const doctorState = useSelector((state) => state.doctor);

  const filterFields = useMemo(() => initTestFilter(doctorState.entities), [doctorState.entities]);

  useEffect(() => {
    dispatch(
      fetchDoctors({
        filters: [],
        sortBy: { fieldName: 'CreatedOn', accending: false },
        pageIndex: 1,
        pageSize: 1000,
      })
    );
  }, []);

  // Patient state

  const patientState = useSelector((state) => state.patient);

  useEffect(() => {
    if (patientState.entity) {
      Object.keys(patientState.entity).forEach((k) => {
        mixtureFormMethods.setValue(k, patientState.entity[k]);
      });
    }
  }, [patientState.entity]);

  return (
    <Box sx={{ display: 'flex', flexDir: 'column', gap: 3 }}>
      <Flex direction="column" alignItems="start" justifyContent="space-between" gap={3} p={2}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...mixtureFormMethods}>
          <MixtureForm
            fields={filterFields}
            onSearch={handleSearchPatient}
            onFilter={(values) => {
              // eslint-disable-next-line no-console
              console.log(values);
            }}
          />
        </FormProvider>

        <HStack spacing={2} alignItems="end">
          <Tooltip label="Tìm xét nghiệm">
            <Button variant="solid" colorScheme="gray" onClick={handleFilterTest}>
              <AppIcon icon="manifying-glass" />
            </Button>
          </Tooltip>

          <Tooltip label="Lưu xét nghiệm">
            <Button variant="solid" colorScheme="teal" onClick={handleSaveTest}>
              <AppIcon icon="floppy-disk" />
            </Button>
          </Tooltip>

          <Tooltip label="Tạo xét nghiệm từ bệnh nhân">
            <Button variant="solid" colorScheme="messenger" onClick={handleClickDuplicate}>
              <AppIcon icon="copy" />
            </Button>
          </Tooltip>

          <Button
            variant="solid"
            colorScheme="telegram"
            onClick={handleRefresh}
            isLoading={testManageState.loading}
          >
            <AppIcon icon="arrow-counter-clockwise" />
          </Button>

          <Input
            disabled
            w="10rem"
            value={CurrencyFormatter.format(testManageState.page?.totalPrice || 0)}
          />
        </HStack>

        <HStack spacing={2}>
          <LinearPagination
            onPageChange={handlePageChange}
            currentPage={pagination.pageIndex}
            pageSize={pagination.pageSize}
            totalPages={testManageState.page?.totalPages}
          />

          <Tooltip label="Số dòng mỗi trang">
            <Select onChange={handlePageSizeChange}>
              {[20, 50, 100].map((pSize) => (
                <option key={`pagination_${pSize}`} value={pSize}>
                  {pSize}
                </option>
              ))}
            </Select>
          </Tooltip>
        </HStack>
      </Flex>

      <Split className="split" minSize={100}>
        <DataGrid
          variant="striped"
          tableDef={tableDef}
          sx={{
            h: '27rem',
            minH: { base: '10rem', md: '27rem' },
            minW: '27rem',
            m: 2,
            shadow: 'md',
            overflow: 'auto',
            resize: 'vertical',
          }}
        />

        <Box>
          <TableContainer
            sx={{
              shadow: 'md',
              m: 2,
              h: '27rem',
              minH: { base: '10rem', md: '27rem' },
              resize: 'vertical',
            }}
          >
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Tên xét nghiệm</Th>
                  <Th>Kết quả</Th>
                  <Th>Giá tiền</Th>
                </Tr>
              </Thead>
              <Tbody>
                {testManageState.testDetails && testManageState.testDetails.length > 0 ? (
                  testManageState.testDetails.map((tdetail) => (
                    <Tr key={`test_detail_${tdetail.id}`}>
                      <Td>{tdetail.testCategoryName}</Td>
                      <Td>
                        <TestDetailResultForm data={tdetail} onSave={handleSaveDetail} />
                      </Td>
                      <Td>{CurrencyFormatter.format(tdetail.price)}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4}>Không có dữ liệu</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Split>

      <Box sx={{ shadow: 'md', m: 2, p: 2 }}>
        <Flex direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Flex gap={1}>
            <AppIcon icon="sticker" weight="bold" size={24} />
            <Text as="h5">Chỉ định xét nghiệm:</Text>
          </Flex>

          <HStack spacing={2}>
            <Tooltip label="Lưu">
              <Button
                colorScheme="teal"
                isLoading={indicationState.loading}
                size="sm"
                onClick={handleSaveTestIndications}
              >
                <AppIcon icon="floppy-disk" weight="bold" />
              </Button>
            </Tooltip>

            <Tooltip label="Tải lại chỉ định xét nghiệm">
              <Button
                colorScheme="telegram"
                isLoading={indicationState.loading}
                size="sm"
                onClick={handleRefreshIndications}
              >
                <AppIcon icon="arrow-counter-clockwise" weight="bold" />
              </Button>
            </Tooltip>
          </HStack>
        </Flex>

        {indicationState.entities.length > 0 ? (
          <Wrap sx={{ p: 2 }} spacing={2}>
            {indicationState.entities.map((idc) => (
              <WrapItem key={`indication_${idc.id}`}>
                <Checkbox
                  value={idc.id}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...indicationsMethods.getCheckboxProps({ value: idc.id })}
                >
                  {idc.name}
                </Checkbox>
              </WrapItem>
            ))}
          </Wrap>
        ) : (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Hiện không có dữ liệu chỉ định xét nghiệm!</AlertTitle>
            <AlertDescription>Vui lòng tải lại trang.</AlertDescription>
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default withSuspense(MedicalTestManagement, 'Quản lý xét nghiệm');
