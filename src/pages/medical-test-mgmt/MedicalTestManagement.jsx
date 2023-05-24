import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
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
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Spinner,
  Switch,
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
  updateTestStatus,
} from 'store/testManageSlice';

import { AppIcon, DataGrid, withFormController, withSuspense } from 'components';
import { FilterGroupItem, FilterGroupSelect } from 'components/FilterGroup';
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
        name="birthday"
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
      <Controller
        name="sex"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <FormControl display="flex" alignItems="center" sx={{ mt: 1, alignItems: 'center' }}>
            <FormLabel htmlFor="sex_type" mb="0">
              Là nữ:
            </FormLabel>
            <Switch
              id="sex_type"
              size="sm"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              ref={ref}
            />
          </FormControl>
        )}
      />
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

const FormField = React.forwardRef(
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

  const ControlledFormInput = withFormController(FormField, control);

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

const TestDetailResultForm = React.forwardRef(
  ({ idx, data, onSave, onMoveNext, isLoading }, ref) => {
    const handlePressEnter = (e) => {
      if (e.keyCode === 13) {
        onSave(data.id, idx);

        onMoveNext(idx);
      }
    };

    return (
      <InputGroup size="md" width="15rem" onKeyDown={handlePressEnter}>
        <Input pr="4.5rem" defaultValue={data.result} ref={ref} />
        <InputRightElement>
          {isLoading ? (
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
          ) : (
            <AppIcon icon="floppy-disk" weight="bold" />
          )}
        </InputRightElement>
      </InputGroup>
    );
  }
);

const initTestColumns = (onClickView, onClickPrint, onChangeStatus) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('id', {
      header: '',
      cell(info) {
        const onClickEye = () => {
          info.table.toggleAllRowsSelected(false);
          onClickView(info.getValue());
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
                onClick={() => onClickPrint('TestReceipt')(info.getValue())}
              >
                <AppIcon icon="currency-dollar" />
              </Button>
            </Tooltip>

            <Tooltip label="In kết quả">
              <Button
                type="button"
                colorScheme="gray"
                onClick={() => onClickPrint('TestResult')(info.getValue())}
              >
                <AppIcon icon="printer" />
              </Button>
            </Tooltip>
          </HStack>
        );
      },
    }),
    columnHelper.accessor('testStatus', {
      header: 'Tình trạng',
      cell(info) {
        const status = Object.keys(TestStatus)
          .filter((k) => TestStatus[k].value === info.getValue())
          .map((k) => TestStatus[k]);

        return (
          <Select
            sx={{ p: 1 }}
            value={status[0]?.value}
            background={status[0]?.colorSchema || 'gray'}
            variant="flushed"
            size="sm"
            width="10rem"
            onChange={(e) =>
              onChangeStatus({
                testId: info.row.original.id,
                status: e.target.value,
              })
            }
          >
            {Object.keys(TestStatus).map((k) => (
              <option key={`test_status_${k}`} value={TestStatus[k].value}>
                {TestStatus[k].name}
              </option>
            ))}
          </Select>
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

const SelectRefered = React.forwardRef(({ children, ...props }, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Select ref={ref} {...props}>
    {children}
  </Select>
));

const InputRefered = React.forwardRef((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Input ref={ref} {...props} />
));

// ===========================================================================
// ============================== Main Component =============================
// ===========================================================================
function MedicalTestManagement() {
  const dispatch = useDispatch();

  const [selectedTestID, setSelectedTestID] = useState(null);
  const [updateStatusSuccess, setUpdateStatusSuccess] = useState(null);

  // Form methods
  const mixtureFormMethods = useForm({
    defaultValues: {
      fullName: '',
      phoneNo: '',
      code: '',
      personalId: '',
      address: '',
      birthday: '',
      email: '',
      sex: 0,
      diagnose: 'KTSK',
      testStatus: TestStatus.Pennding.value,
      doctorId: '',
      searchType: 'day',
      searchDate: dayjs().format('YYYY-MM-DD'),
    },
  });

  const handleClickView = (testID) => {
    setSelectedTestID(testID);
    dispatch(fetchTest(testID));
    dispatch(fetchTestDetails(testID));
    dispatch(fetchTestIndications(testID));
  };

  const handleClickPrint = (type) => (testID) => {
    reportAPI.get({ testName: type, testID }).then((res) => {
      const newTab = window.open();
      newTab.document.write(res.data.data);
      newTab.window.print();
    });
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

  const handleChangeStatus = ({ testId, status }) => {
    dispatch(updateTestStatus({ testId, status }));
    setUpdateStatusSuccess(true);
  };

  const columns = useMemo(
    () => initTestColumns(handleClickView, handleClickPrint, handleChangeStatus),
    []
  );
  const testManageState = useSelector((state) => state.testManage);
  const [sorting, setSorting] = useState([{ id: 'code', desc: true }]);
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
        filters: [],
        sortBy: { fieldName: sorting[0]?.id, accending: !sorting[0]?.desc },
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
    );
  }, [sorting, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (testManageState.entity) {
      const values = {
        fullName: testManageState.entity.patientName,
        address: testManageState.entity.address,
        birthday: dayjs(testManageState.entity.birthDay).format('YYYY-MM-DD'),
        code: testManageState.entity.code,
        diagnose: testManageState.entity.diagnose,
        doctorId: testManageState.entity.doctorId,
        doctorName: testManageState.entity.doctorName,
        email: testManageState.entity.email,
        phoneNo: testManageState.entity.phoneNumber,
        sex: Number(testManageState.entity.sex) > 0,
        testStatus: testManageState.entity.testStatus,
        personalId: testManageState.entity.personalId,
      };

      Object.keys(values).forEach((k) => {
        mixtureFormMethods.setValue(k, values[k]);
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

  const [theUploadDetail, setTheUploadDetail] = useState(null); // For show loading button in test detail

  const detailInputRefs = useRef([]);

  useEffect(() => {
    detailInputRefs.current = detailInputRefs.current.slice(0, testManageState.testDetails.length);
  }, [testManageState.testDetails]);

  const handleSaveDetail = (id, inputIdx) => {
    dispatch(updateTestDetail({ id, result: detailInputRefs.current[inputIdx].value }));
    setTheUploadDetail(id);
  };

  const handleUpdateTrueFalseTestDetail = (detailData, checked) => {
    dispatch(updateTestDetail({ ...detailData, trueFalseResult: checked }));
    setTheUploadDetail(detailData.id);
  };

  const handleMoveNextInputDetail = (curr) => {
    const nextIdx = curr + 1;
    const nextInput = detailInputRefs.current[nextIdx];

    nextInput.focus();
  };

  const handlePageChange = (pageNum) => {
    setPagination((pgn) => ({ pageIndex: pageNum, pageSize: pgn.pageSize }));
  };

  const handlePageSizeChange = (e) => {
    setPagination((pgn) => ({ pageSize: e.target.value, pageIndex: pgn.pageIndex }));
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
    const values = indicationState.entities
      .filter((indication) => testManageState.testIndications.includes(indication.id))
      .map((indication) => indication.id);

    indicationsMethods.setValue(values);
  }, [indicationState.entities, testManageState.testIndications]);

  useEffect(() => {
    if (selectedTestID) {
      dispatch(fetchTestDetails(selectedTestID));
    }
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

  // Doctor state
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
        if (k === 'sex') {
          mixtureFormMethods.setValue(k, Number(patientState.entity[k]) > 0);
          return;
        }
        mixtureFormMethods.setValue(k, patientState.entity[k]);
      });
    }
  }, [patientState.entity]);

  const handleFilterTest = () => {
    const values = mixtureFormMethods.getValues();

    const filterObj = {
      doctorId: values.doctorId,
      patientName: values.patientName,
      testStatus: values.testStatus,
      phoneNo: values.phoneNo,
      personalId: values.personalId,
      code: values.code,
      email: values.email,
      sex: Number(values.sex),
      timeType: values.searchType,
      day: values.searchDate,
    };

    // Transfer to filters array
    const testFilters = Object.keys(filterObj)
      .filter((k) => filterObj[k] !== undefined && filterObj[k] !== '' && filterObj[k] !== null)
      .map((k) => ({ fieldName: k, value: String(filterObj[k]) }));

    dispatch(
      fetchTests({
        filters: testFilters,
        sortBy: { fieldName: 'createdOn', accending: false },
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      })
    );
  };

  useEffect(() => {
    if (updateStatusSuccess) {
      handleFilterTest();
      setUpdateStatusSuccess(null);
    }
  }, [updateStatusSuccess]);

  const handleSaveTest = () => {
    const values = mixtureFormMethods.getValues();

    if (values.doctorId === null || values.doctorId === undefined || values.doctorId === '') {
      mixtureFormMethods.setError('doctorId', { message: 'Vui lòng chọn lại bác sĩ' });
      return;
    }

    if (values.testStatus === null || values.testStatus === undefined || values.testStatus === '') {
      mixtureFormMethods.setError('testStatus', {
        message: 'Vui lòng chọn lại tình trạng',
      });
      return;
    }

    if (values.diagnose === null || values.diagnose === undefined || values.diagnose === '') {
      mixtureFormMethods.setError('diagnose', { message: 'vui lòng nhập chuẩn đoán' });
      return;
    }

    mixtureFormMethods.clearErrors();

    if (selectedTestID !== null) {
      dispatch(
        updateTest({
          id: selectedTestID,
          patientName: values.fullName,
          code: values.code,
          doctorId: values.doctorId,
          diagnose: values.diagnose,
          phoneNumber: values.phoneNo,
          birthDay: values.birthday,
          testStatus: Number(values.testStatus),
          address: values.address,
          email: values.email,
          personalId: values.personalId,
          sex: Number(values.sex),
        })
      );
    } else {
      dispatch(
        createTest({
          patientName: values.fullName,
          code: values.code,
          doctorId: values.doctorId,
          diagnose: values.diagnose,
          phoneNumber: values.phoneNo,
          birthDay: values.birthday,
          testStatus: Number(values.testStatus),
          address: values.address,
          email: values.email,
          personalId: values.personalId,
          sex: Number(values.sex),
        })
      );
    }
  };

  const handleCreateTest = () => {
    const values = mixtureFormMethods.getValues();

    if (values.doctorId === null || values.doctorId === undefined || values.doctorId === '') {
      mixtureFormMethods.setError('doctorId', { message: 'Vui lòng chọn lại bác sĩ' });
      return;
    }

    if (values.testStatus === null || values.testStatus === undefined || values.testStatus === '') {
      mixtureFormMethods.setError('testStatus', {
        message: 'Vui lòng chọn lại tình trạng',
      });
      return;
    }

    if (values.diagnose === null || values.diagnose === undefined || values.diagnose === '') {
      mixtureFormMethods.setError('diagnose', { message: 'vui lòng nhập chuẩn đoán' });
      return;
    }

    dispatch(
      createTest({
        patientName: values.fullName,
        doctorId: values.doctorId,
        diagnose: values.diagnose,
        phoneNumber: values.phoneNo,
        birthday: values.birthday,
        testStatus: Number(values.testStatus),
        code: values.code !== '' ? values.code : null,
        address: values.address,
        email: values.email,
        personalId: values.personalId,
        sex: Number(values.sex),
      })
    );
  };

  const handleRefresh = () => {
    dispatch(
      fetchTests({
        filters: [],
        sortBy: { fieldName: 'CreatedOn', accending: false },
        pageIndex: 1,
        pageSize: 20,
      })
    );

    mixtureFormMethods.reset();
    indicationsMethods.setValue([]);
    setPagination({ pageIndex: 1, pageSize: 20 });
    setSelectedTestID(null);
    tableDef.toggleAllRowsSelected(false);
  };

  // Helper components

  const ControlledSelect = withFormController(SelectRefered, mixtureFormMethods.control);

  const ControlledInput = withFormController(InputRefered, mixtureFormMethods.control);

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
          <ControlledSelect name="searchType" width="max-content">
            <option value="day">Tìm theo ngày</option>
            <option value="month">Tìm theo tháng</option>
            <option value="year">Tìm theo năm</option>
          </ControlledSelect>

          <ControlledInput name="searchDate" type="date" width="max-content" />

          <Tooltip label="Tìm xét nghiệm">
            <Button variant="solid" colorScheme="gray" onClick={handleFilterTest}>
              <AppIcon icon="manifying-glass" />
            </Button>
          </Tooltip>

          <Tooltip label="Tạo xét nghiệm mới">
            <Button variant="solid" colorScheme="messenger" onClick={handleCreateTest}>
              <AppIcon icon="plus" />
            </Button>
          </Tooltip>

          <Tooltip label="Lưu xét nghiệm">
            <Button variant="solid" colorScheme="teal" onClick={handleSaveTest}>
              <AppIcon icon="floppy-disk" />
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
              overflow: 'auto',
              resize: 'vertical',
            }}
          >
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Tên xét nghiệm</Th>
                  <Th>Kết quả</Th>
                  <Th>Dương tính</Th>
                  <Th>Giá tiền</Th>
                </Tr>
              </Thead>
              <Tbody className="test-detail-container">
                {testManageState.testDetails && testManageState.testDetails.length > 0 ? (
                  testManageState.testDetails.map((tdetail, idx) => (
                    <Tr key={`test_detail_${tdetail.id}`}>
                      <Td>{tdetail.testCategoryName}</Td>
                      <Td>
                        <TestDetailResultForm
                          data={tdetail}
                          ref={(elem) => {
                            detailInputRefs.current[idx] = elem;
                          }}
                          idx={idx}
                          onSave={handleSaveDetail}
                          onMoveNext={handleMoveNextInputDetail}
                          isLoading={
                            tdetail.id === theUploadDetail && testManageState.testDetailUploading
                          }
                        />
                      </Td>
                      <Td>
                        {tdetail.isShowTrueFalseResult && (
                          <Switch
                            onChange={(e) =>
                              handleUpdateTrueFalseTestDetail(tdetail, e.target.checked)
                            }
                          />
                        )}
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
                <Flex sx={{ w: '18rem', h: '4rem' }}>
                  <Checkbox
                    value={idc.id}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...indicationsMethods.getCheckboxProps({ value: idc.id })}
                  >
                    {idc.name}
                  </Checkbox>
                </Flex>
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
