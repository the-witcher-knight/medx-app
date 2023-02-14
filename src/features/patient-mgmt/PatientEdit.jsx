/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
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
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import AppIcon from 'icon/AppIcon';
import * as yup from 'yup';

import ValidatedInput from 'components/ValidatedInput';
import ValidatedSelect from 'components/ValidatedSelect';
import withSuspense from 'components/withSuspense';

function PatientEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const schema = yup.object().shape({
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
  });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      fullname: '',
      code: '',
      personalID: '',
      birthday: '',
      sex: 0,
      address: '',
    },
    resolver: yupResolver(schema),
  });

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
        <DrawerHeader>Tạo bệnh nhân mới</DrawerHeader>

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
