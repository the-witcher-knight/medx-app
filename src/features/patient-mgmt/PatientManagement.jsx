import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import AppIcon from 'icon/AppIcon';

import AppTable from 'components/AppTable';
import withSuspense from 'components/withSuspense';

import { fetchPatients } from './patientSlice';

function ActionGroup({ patientID }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`edit/${patientID}`, {
      state: { background: location },
    });
  };

  const handleDelete = () => {
    navigate(`delete/${patientID}`, {
      state: { background: location },
    });
  };

  return (
    <ButtonGroup gap={2}>
      <Button type="button" colorScheme="teal" onClick={handleEdit}>
        <AppIcon icon="pen" size={16} weight="bold" />
      </Button>
      <Button type="button" colorScheme="red" onClick={handleDelete}>
        <AppIcon icon="trash" size={16} weight="bold" />
      </Button>
    </ButtonGroup>
  );
}

function SearchBox({ onSearch, sx }) {
  const searchType = [
    {
      key: 'code',
      label: 'Mã bệnh nhân',
    },
    {
      key: 'fullname',
      label: 'Họ và tên',
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
    },
    {
      key: 'personalID',
      label: 'Số CCCD',
    },
  ];
  const { handleSubmit, control } = useForm({
    defaultValues: {
      searchKey: '',
      searchType: 'code',
    },
  });

  return (
    <InputGroup as="form" onSubmit={handleSubmit(onSearch)} sx={sx}>
      <InputLeftElement>
        <AppIcon icon="manifying-glass" weight="bold" />
      </InputLeftElement>

      <Controller
        name="searchKey"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input type="text" onChange={onChange} onBlur={onBlur} value={value} ref={ref} />
        )}
      />

      <InputRightAddon>
        <Controller
          name="searchType"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select border={0} onChange={onChange} onBlur={onBlur} value={value} ref={ref}>
              {searchType.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </Select>
          )}
        />
      </InputRightAddon>
    </InputGroup>
  );
}

function PatientManagement() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { patients, loading } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatients());
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('code', {
      cell: (info) => info.getValue(),
      header: 'Mã bệnh nhân',
    }),
    columnHelper.accessor('fullname', {
      cell: (info) => info.getValue(),
      header: 'Họ và tên',
    }),
    columnHelper.accessor('phone', {
      cell: (info) => info.getValue(),
      header: 'Số điện thoại',
    }),
    columnHelper.accessor('personalID', {
      cell: (info) => info.getValue(),
      header: 'Số CCCD',
    }),
    columnHelper.accessor('birthday', {
      cell: (info) => dayjs(info.getValue()).format('DD/MM/YYYY'),
      header: 'Ngày sinh',
    }),
    columnHelper.accessor('sex', {
      cell(info) {
        const gender = ['Nam', 'Nữ', 'Khác'];
        return gender[info.getValue()];
      },
      header: 'Giới tính',
    }),
    columnHelper.accessor('address', {
      cell: (info) => info.getValue(),
      header: 'Địa chỉ',
    }),
    columnHelper.accessor('id', {
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: (info) => <ActionGroup patientID={info.getValue()} />,
      header: '',
    }),
  ];

  const handleCreatePatient = () => {
    navigate('new', { state: { background: location } });
  };

  const handleSearch = (values) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <Box sx={{ display: 'flex', flexDir: 'column', gap: 3 }}>
      <Heading as="h2" size="md" color={useColorModeValue('teal.500', 'teal.300')}>
        Quản lý bệnh nhân
      </Heading>

      <SearchBox onSearch={handleSearch} sx={{ maxW: '30rem' }} />

      <Flex alignItems="center">
        <Text flex={2}>Bệnh nhân</Text>

        <HStack>
          <Button variant="solid" colorScheme="teal" onClick={handleCreatePatient}>
            <AppIcon icon="plus" size={16} weight="bold" />
          </Button>
        </HStack>
      </Flex>

      <AppTable
        variant="striped"
        loading={loading}
        data={patients}
        columns={columns}
        sx={{
          h: '27rem',
          minH: { base: '10rem', md: '27rem' },
          minW: '100%',
          m: 2,
          shadow: 'md',
          overflow: 'auto',
          resize: 'both',
        }}
      />
    </Box>
  );
}

export default withSuspense(PatientManagement, 'Quản lý bệnh nhân');
