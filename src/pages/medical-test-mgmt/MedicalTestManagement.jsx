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
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
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
  useColorModeValue,
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
  updateTestDetail,
  updateTestIndication,
} from 'store/testManageSlice';

import { AppIcon, DataGrid, withFormController, withSuspense } from 'components';
import { FilterGroupGender, FilterGroupSelect } from 'components/FilterGroup';

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
    icon: 'envelope',
    label: 'Địa chỉ',
  },
  {
    id: 'birthday',
    icon: 'envelope',
    label: 'Ngày sinh',
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
      cell: (info) => (
        <HStack>
          <Tooltip label="Xem chi tiết">
            <Button
              type="button"
              colorScheme="gray"
              onClick={() => handleClickView(info.getValue())}
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
      ),
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

  const handleFilterTest = () => {};

  const handleCreateTest = () => {};

  const handleClickView = (testID) => {
    setSelectedTestID(testID);
    dispatch(fetchTest(testID));
    dispatch(fetchTestDetails(testID));
    dispatch(fetchTestIndications(testID));
  };

  const handleClickPrint = (type) => (testID) => {
    // eslint-disable-next-line no-console
    console.log(reportAPI.get({ type, testID }).then((res) => res.data));
  };

  const handleClickDuplicate = () => {
    // const { doctorId, diagnose, dayOfTest, personalId, patientName, phoneNumber } =
    //   formMethods.getValues();

    // TODO: Validate for all field

    // eslint-disable-next-line no-console
    console.log(mixtureFormMethods.getValues());
    // console.log({ doctorId, diagnose, dayOfTest, personalId, patientName, phoneNumber });
    // dispatch(createTest({ doctorId, diagnose, dayOfTest, personalId, patientName, phoneNumber }));
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
  const [sorting, setSorting] = useState([{ id: 'CreatedOn', desc: true }]);
  const [filters, setFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 30,
  });

  const tableDef = useReactTable({
    columns,
    data: testManageState.entities,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
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

  const handleSaveDetail = (data) => {
    const { id, result, resultText } = data;
    dispatch(updateTestDetail({ id, result, resultText }));
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
    const inds = testManageState.testIndications || [];
    indicationsMethods.setValue(inds);
  }, [testManageState.testIndications]);

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
      <Heading flex={3} as="h2" size="md" p={2} color={useColorModeValue('teal.500', 'teal.300')}>
        Quản lý xét nghiệm
      </Heading>

      <Flex direction="column" alignItems="start" justifyContent="space-between" p={2}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...mixtureFormMethods}>
          <MixtureForm
            fields={filterFields}
            onSearch={handleSearchPatient}
            onFilter={(values) => {
              // eslint-disable-next-line no-console
              console.log(values);
            }}
            sx={{ p: 2 }}
          />
        </FormProvider>

        <HStack p={2} spacing={2} alignItems="end">
          <Button size="sm" variant="solid" colorScheme="gray" onClick={handleFilterTest}>
            <AppIcon icon="manifying-glass" size={16} weight="bold" />
            &nbsp;Tìm xét nghiệm
          </Button>

          <Button size="sm" variant="solid" colorScheme="teal" onClick={handleCreateTest}>
            <AppIcon icon="floppy-disk" size={16} weight="bold" />
          </Button>

          <Button size="sm" variant="solid" colorScheme="messenger" onClick={handleClickDuplicate}>
            <AppIcon icon="copy" size={16} weight="bold" />
          </Button>

          <Button
            size="sm"
            variant="solid"
            colorScheme="telegram"
            onClick={handleRefresh}
            isLoading={testManageState.loading}
          >
            <AppIcon icon="arrow-counter-clockwise" size={16} weight="bold" />
          </Button>
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
                  <Th>Mã xét nghiệm</Th>
                  <Th>Tên xét nghiệm</Th>
                  <Th>Kết quả</Th>
                  <Th>Giá tiền</Th>
                </Tr>
              </Thead>
              <Tbody>
                {testManageState.testDetails && testManageState.testDetails.length > 0 ? (
                  testManageState.testDetails.map((tdetail) => (
                    <Tr key={`test_detail_${tdetail.id}`}>
                      <Td textOverflow="ellipsis">
                        <Tooltip label={tdetail.id}>
                          <Text width="5rem" overflow="hidden">
                            {tdetail.testCategoryId}
                          </Text>
                        </Tooltip>
                      </Td>
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
