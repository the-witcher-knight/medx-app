/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
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

import ValidatedCheck from 'components/ValidatedCheck';
import ValidatedInput from 'components/ValidatedInput';
import withSuspense from 'components/withSuspense';

function PatientEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const schema = yup.object().shape({
    fullname: yup.string().required('Vui lòng nhập họ tên'),
    birthday: yup.string().required('Vui lòng nhập ngày sinh'),
    gender: yup.boolean().required('Vui lòng chọn giới tính'),
    address: yup.string().required('Vui lòng nhập địa chỉ'),
  });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      fullname: '',
      birthday: '',
      gender: false,
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
        <DrawerHeader>Create patient</DrawerHeader>

        <DrawerBody>
          <Flex
            as="form"
            id="update-form"
            onSubmit={handleSubmit(onSubmit)}
            flexDir="column"
            gap={2}
          >
            <ValidatedInput control={control} name="fullname" type="text" label="Họ & tên" />
            <ValidatedInput control={control} name="birthday" type="date" label="Ngày sinh" />
            <ValidatedCheck control={control} name="gender" label="Nam" />
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
