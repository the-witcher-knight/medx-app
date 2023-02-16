import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import AppIcon from 'icon/AppIcon';
import * as yup from 'yup';

import ValidatedInput from 'components/ValidatedInput';
import ValidatedSelect from 'components/ValidatedSelect';
import withSuspense from 'components/withSuspense';

import { getPatient } from './patientSlice';

function PatientEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { selectedPatient } = useSelector((state) => state.patient);

  const schema = useMemo(
    () =>
      yup.object().shape({
        fullname: yup.string().required('Vui lòng nhập họ tên'),
        code: yup.string().required('Vui lòng nhập mã bệnh nhân'),
        personalID: yup.string().required('Vui lòng nhập CCCD').length(12, 'CCCD phải có 12 ký tự'),
        phone: yup
          .string()
          .required('Vui lòng nhập số điện thoại')
          .length(10, 'Số điện thoại không hợp lệ'),
        birthday: yup.string().required('Vui lòng nhập ngày sinh'),
        sex: yup.number().required('Vui lòng chọn giới tính'),
        address: yup.string().required('Vui lòng nhập địa chỉ'),
      }),
    []
  );

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      fullname: '',
      code: '',
      personalID: '',
      phone: '',
      birthday: '2000-12-31',
      sex: 0,
      address: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(getPatient(id));
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setValue('id', selectedPatient.id);
      setValue('fullname', selectedPatient.fullname);
      setValue('code', selectedPatient.code);
      setValue('personalID', selectedPatient.personalID);
      setValue('phone', selectedPatient.phone);
      setValue('birthday', dayjs(selectedPatient.birthday).format('YYYY-MM-DD'));
      setValue('sex', selectedPatient.sex);
      setValue('address', selectedPatient.address);
    }
  }, [selectedPatient]);

  const onSubmit = (values) => {
    // eslint-disable-next-line no-console
    console.log(values);
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
        <DrawerHeader>
          Cập nhật thông tin bệnh nhân
          <Text fontSize="md" fontStyle="italic" fontWeight="medium">
            Mã bệnh nhân: {id}
          </Text>
        </DrawerHeader>

        <DrawerBody>
          <Flex
            as="form"
            id="update-form"
            onSubmit={handleSubmit(onSubmit)}
            flexDir="column"
            gap={2}
          >
            <ValidatedInput control={control} name="fullname" type="text" label="Họ & tên" />
            <ValidatedInput control={control} name="personalID" type="text" label="CCCD" />
            <ValidatedInput control={control} name="code" type="text" label="Mã bệnh nhân" />
            <ValidatedInput control={control} name="phone" type="text" label="Số điện thoại" />
            <ValidatedSelect control={control} name="sex" label="Giới tính">
              <option value="0">Nam</option>
              <option value="1">Nữ</option>
              <option value="2">Khác</option>
            </ValidatedSelect>
            <ValidatedInput control={control} name="birthday" type="date" label="Ngày sinh" />
            <ValidatedInput control={control} name="address" type="text" label="Địa chỉ" />
          </Flex>
        </DrawerBody>

        <DrawerFooter justifyContent="left">
          <Button variant="outline" mr={3} onClick={handleClose}>
            <AppIcon icon="x" weight="fill" size={24} />
            &nbsp; Hủy
          </Button>
          <Button type="submit" form="update-form" colorScheme="teal">
            <AppIcon icon="floppy-disk" weight="fill" size={24} />
            &nbsp; Lưu
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default withSuspense(PatientEdit, 'Cập nhật thông tin bệnh nhân');
