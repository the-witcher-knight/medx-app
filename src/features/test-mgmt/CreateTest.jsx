import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useCheckboxGroup,
  useDisclosure,
} from '@chakra-ui/react';
import AppIcon from 'icon/AppIcon';

import { withSuspense } from 'components';

import { fetchDoctors, fetchIndications } from './testSlice';

function CreateTest() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { loading, indications, doctors, error } = useSelector((state) => state.testManagement);

  const { value, getCheckboxProps } = useCheckboxGroup();
  const [indicationPagination, setIndicationPagination] = useState({
    pageIndex: 1,
    pageSize: 30,
  });
  const [selectedDoctorID, setSelectedDoctorID] = useState();

  useEffect(() => {
    dispatch(
      fetchDoctors({
        filters: [],
        sortBy: { fieldName: 'Id', ascending: true },
        pageIndex: 1,
        pageSize: 1000,
      })
    );
    dispatch(
      fetchIndications({
        filters: [],
        sortBy: { fieldName: 'Id', accending: true },
        pageIndex: indicationPagination.pageIndex,
        pageSize: indicationPagination.pageSize,
      })
    );
  }, []);

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log(selectedDoctorID, value);
  };

  const onSelectDoctor = (e) => {
    setSelectedDoctorID(e.target.value);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="xl" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          sx={{
            shadow: 'sm',
          }}
        >
          {id ? (
            <>
              Cập nhật thông tin xét nghiệm&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo xét nghiệm mới'
          )}
        </DrawerHeader>

        <DrawerBody>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Bệnh nhân</Tab>
              <Tab>Chỉ định bác sĩ</Tab>
              <Tab>Chỉ định xét nghiệm</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex direction="column" gap={2}>
                  <FormControl>
                    <FormLabel>Mã bệnh nhân</FormLabel>
                    <Input type="text" disabled value="BN-001" />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tên bệnh nhân</FormLabel>
                    <Input type="text" disabled value="BN-001" />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Số điện thoại</FormLabel>
                    <Input type="text" disabled value="0987654321" />
                  </FormControl>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction="column" gap={2}>
                  <FormControl>
                    <FormLabel>Chọn một bác sĩ</FormLabel>
                    <Select onChange={onSelectDoctor}>
                      {doctors.length > 0 &&
                        doctors.map((doctor) => (
                          <option key={`doctor_${doctor.id}`} value={doctor.id}>
                            {doctor.fullName}
                          </option>
                        ))}
                    </Select>
                  </FormControl>

                  <Box>
                    <Button type="button" form="update-form" colorScheme="teal" onClick={onSubmit}>
                      <AppIcon icon="floppy-disk" weight="fill" size={24} />
                      &nbsp;Lưu
                    </Button>
                  </Box>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction="column" gap={2}>
                  {indications.map((indication) => (
                    <Checkbox
                      key={`indication_${indication.id}`}
                      iconSize="1rem"
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...getCheckboxProps({ value: indication.id })}
                    >
                      {indication.name}
                    </Checkbox>
                  ))}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default withSuspense(CreateTest, 'Tạo một xét nghiệm mới');
