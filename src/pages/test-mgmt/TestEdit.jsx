import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { fetchDoctors } from 'store/doctorSlice';
import { fetchIndications } from 'store/indicationSlice';
import { fetchPatientByPersonalID } from 'store/patientSlice';
import {
  createTest,
  editIndication,
  fetchTest,
  getIndications as fetchTestIndications,
  updateTest,
} from 'store/testManageSlice';
import * as yup from 'yup';

import { AppIcon, ValidatedCheck, ValidatedInput, ValidatedSelect, withSuspense } from 'components';
import AppPagination from 'components/AppPagination';

function TestEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    personalId: yup.string().required('Vui lòng nhập mã CCCD/CMND bệnh nhân'),
    phoneNumber: yup.string().required('Vui lòng nhập số điện thoại người khám'),
    doctorId: yup.string().required('Vui lòng chọn một bác sĩ'),
  });
  const {
    setValue,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientName: '',
      personalId: '',
      doctorId: '',
      diagnose: '',
      phoneNumber: '',
      dayOfTest: '',
      testIndications: {},
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, testIndications, loading, error } = useSelector((state) => state.testManage);

  const doctorState = useSelector((state) => state.doctor);

  const patientState = useSelector((state) => state.patient);
  const patientPersonalIDRef = useRef();

  const indicationState = useSelector((state) => state.indication);
  const [indicationPgn, setIndicationPgn] = useState({ pageIndex: 1, pageSize: 30 });

  useEffect(() => {
    if (id) {
      dispatch(fetchTest(id));
      dispatch(fetchTestIndications());
    }
  }, [id]);

  useEffect(() => {
    dispatch(
      fetchDoctors({ sortBy: { fieldName: 'id', accending: true }, pageIndex: 1, pageSize: 10000 })
    );
  }, []);

  useEffect(() => {
    dispatch(
      fetchIndications({
        filters: [],
        sortBy: { fieldName: 'id', accending: true },
        pageIndex: indicationPgn.pageIndex,
        pageSize: indicationPgn.pageSize,
      })
    );
  }, [indicationPgn.pageIndex, indicationPgn.pageSize]);

  useEffect(() => {
    if (patientState.entity?.id) {
      const { code, fullName, personalId, phoneNo } = patientState.entity;
      setValue('code', code);
      setValue('patientName', fullName);
      setValue('personalId', personalId);
      setValue('phoneNumber', phoneNo);
    }
  }, [patientState.entity]);

  useEffect(() => {
    if (entity) {
      Object.keys(entity).forEach((key) => {
        if (key === 'id') {
          return;
        }
        if (key === 'dayOfTest') {
          setValue('dayOfTest', dayjs(entity.dayOfTest).format('YYYY-MM-DD'));
          return;
        }
        setValue(key, entity[key]);
      });
    }
  }, [entity]);

  useEffect(() => {
    if (testIndications) {
      // eslint-disable-next-line no-console
      console.log(testIndications);
    }
  }, [testIndications]);

  useEffect(() => {
    if (entity?.id) {
      dispatch(fetchTestIndications());
    }
  }, [entity]);

  const onSubmitGenericDetail = () => {
    const { patientName, personalId, doctorId, diagnose, phoneNumber, dayOfTest } = getValues();
    const saveData = { patientName, personalId, doctorId, diagnose, phoneNumber, dayOfTest };
    if (id) {
      dispatch(updateTest({ id, ...saveData }));
    } else {
      dispatch(createTest(saveData));
    }
  };

  const onSubmitTestIndication = () => {
    const values = getValues();
    const testInds = Object.keys(values.testIndications)
      .filter((k) => values.testIndications[k] === true)
      .map((k) => ({ indicationId: k }));

    const saveData = { testId: entity.id, testIndications: testInds };
    dispatch(editIndication(saveData));
  };

  const handleClose = () => {
    reset();
    onClose();
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

  const getPatient = () => {
    if (patientPersonalIDRef.current.value !== '') {
      dispatch(fetchPatientByPersonalID(patientPersonalIDRef.current.value));
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="xl" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {id ? (
            <>
              Cập nhật xét nghiệm&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo cuộc xét nghiệm mới'
          )}
        </DrawerHeader>

        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab>
                <AppIcon icon="gear-six" weight="bold" size={24} />
                &nbsp;Thông tin chung
              </Tab>
              <Tab>
                <AppIcon icon="sticker" weight="bold" size={24} />
                &nbsp;Chỉ định xét nghiệm
              </Tab>
            </TabList>

            <TabPanels as="form" id="update-form">
              <TabPanel>
                {id && (
                  <ValidatedInput
                    control={control}
                    name="code"
                    type="text"
                    label="Mã bệnh nhân"
                    isDisabled
                  />
                )}
                <FormControl isInvalid={!!errors.code}>
                  <FormLabel>CCCD bệnh nhân</FormLabel>
                  <Input
                    type="text"
                    ref={patientPersonalIDRef}
                    onBlur={getPatient}
                    defaultValue=""
                  />
                  {errors && <FormErrorMessage>{errors.personalId?.message}</FormErrorMessage>}
                </FormControl>
                <ValidatedInput control={control} name="patientName" type="text" label="Họ & tên" />
                <ValidatedSelect control={control} name="doctorId" label="Mã bác sĩ">
                  <option key="doctor_none" value="">
                    none
                  </option>
                  {doctorState.entities.map((doctor) => (
                    <option key={`doctor_${doctor.id}`} value={doctor.id}>
                      {doctor.fullName}
                    </option>
                  ))}
                </ValidatedSelect>
                <ValidatedInput
                  control={control}
                  name="phoneNumber"
                  type="text"
                  label="Số điện thoại"
                />
                <ValidatedInput control={control} name="diagnose" type="text" label="Chuẩn đoán" />
                <ValidatedInput
                  control={control}
                  name="dayOfTest"
                  type="date"
                  label="Ngày xét nghiệm"
                />

                <Flex py={5} justifyContent="left">
                  <Button
                    type="button"
                    isLoading={loading}
                    colorScheme="telegram"
                    onClick={onSubmitGenericDetail}
                  >
                    <AppIcon icon="floppy-disk" weight="fill" size={24} />
                    &nbsp;Lưu
                  </Button>
                </Flex>
              </TabPanel>

              <TabPanel>
                <Text fontWeight="medium">
                  Mã xét nghiệm: &nbsp;
                  {entity?.id ? (
                    <Text fontWeight="light" as="i">
                      {entity.id}
                    </Text>
                  ) : (
                    <Text fontWeight="light" as="i">
                      Chưa có mã xét nghiệm
                    </Text>
                  )}
                </Text>

                <Text fontWeight="medium" mt={3}>
                  Chỉ định xét nghiệm:
                </Text>
                {indicationState?.entities.length > 0 ? (
                  <Wrap spacing={2}>
                    {indicationState.entities.map((indication) => (
                      <WrapItem key={`indication_${indication.id}`}>
                        <Center w="180px" h="80px">
                          <ValidatedCheck
                            control={control}
                            name={`testIndications.${indication.id}`}
                            label={indication.name}
                          />
                        </Center>
                      </WrapItem>
                    ))}
                  </Wrap>
                ) : (
                  <Text>Không có chỉ định xét nghiệm nào</Text>
                )}

                <Flex mt={5} flex={3} justifyContent="center">
                  <AppPagination
                    loading={loading}
                    pagination={indicationPgn}
                    setPagination={setIndicationPgn}
                    sx={{
                      flexBasis: '33.33%',
                    }}
                  />
                </Flex>

                <Flex py={5} justifyContent="left">
                  <Button
                    type="button"
                    isLoading={loading}
                    colorScheme="telegram"
                    onClick={onSubmitTestIndication}
                    isDisabled={!entity?.id}
                  >
                    <AppIcon icon="floppy-disk" weight="fill" size={24} />
                    &nbsp;Lưu
                  </Button>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>

        <DrawerFooter justifyContent="left">
          <Button type="button" isLoading={loading} colorScheme="teal" onClick={handleClose}>
            <AppIcon icon="check" weight="fill" size={24} />
            &nbsp;Hoàn thành
          </Button>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            <AppIcon icon="x" weight="fill" size={24} />
            &nbsp;Hủy
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default withSuspense(TestEdit, 'Chỉnh sửa thông tin xét nghiệm');
