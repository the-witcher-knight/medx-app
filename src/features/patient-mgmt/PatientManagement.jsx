import React from 'react';
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  TableContainer,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import AppIcon from 'icon/AppIcon';

import AppTable from 'components/AppTable';
import withSuspense from 'components/withSuspense';

import patientList from './mocks/patients.json';

function ActionGroup({ patientID }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`edit/${patientID}}`, {
      state: { background: location },
    });
  };

  const handleDelete = () => {
    navigate(`delete/${patientID}}`, {
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

function PatientManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const patients = patientList;

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
    }),
    columnHelper.accessor('personalID', {
      cell: (info) => info.getValue(),
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
    columnHelper.accessor('action', {
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: (info) => <ActionGroup patientID={info.row.getAllCells().at(0).getValue()} />,
      header: '',
    }),
  ];

  const handleCreatePatient = () => {
    navigate('new', { state: { background: location } });
  };

  return (
    <Box sx={{ display: 'flex', flexDir: 'column', gap: 3 }}>
      <Heading as="h2" size="md" color={useColorModeValue('teal.500', 'teal.300')}>
        Quản lý bệnh nhân
      </Heading>

      <InputGroup as="form" maxW="24rem">
        <InputLeftElement>
          <AppIcon icon="manifying-glass" weight="bold" />
        </InputLeftElement>
        <Input type="text" placeholder="Tìm kiếm bệnh nhân" />
      </InputGroup>

      <Flex alignItems="center">
        <Text flex={2}>Bệnh nhân</Text>

        <HStack spacing={2}>
          <Popover>
            <PopoverTrigger>
              <Button>
                <AppIcon icon="funnel" size={16} weight="bold" />
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Header</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Button colorScheme="blue">Button</Button>
                </PopoverBody>
                <PopoverFooter>This is the footer</PopoverFooter>
              </PopoverContent>
            </Portal>
          </Popover>

          <Button variant="solid" colorScheme="teal" onClick={handleCreatePatient}>
            <AppIcon icon="plus" size={16} weight="bold" />
          </Button>
        </HStack>
      </Flex>

      <TableContainer
        sx={{
          h: '27rem',
          minH: 'full',
          minW: 'full',
          m: 2,
          shadow: 'md',
          overflow: 'auto',
          resize: 'both',
        }}
      >
        <AppTable variant="striped" data={patients} columns={columns} />
      </TableContainer>
    </Box>
  );
}

export default withSuspense(PatientManagement, 'Quản lý bệnh nhân');
