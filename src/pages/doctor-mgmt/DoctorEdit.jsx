import React, { useEffect } from 'react';
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
import { createDoctor, fetchDoctor, updateDoctor } from 'store/doctorSlice';
import * as yup from 'yup';

import { AppIcon, ValidatedInput, ValidatedSelect, withSuspense } from 'components';

function DoctorEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    fullName: yup.string().required('Vui lòng nhập họ tên'),
    phoneNo: yup.string().required('Vui lòng nhập số điện thoại').length(10, 'Số điện thoại không hợp lệ'),
    address: yup.string().required('Vui lòng nhập địa chỉ'),
    email: yup.string().email().required('Vui lòng nhập email'),
    title: yup.string().required('Vui lòng nhập tiêu đề'),
    sex: yup.number().required('Vui lòng chọn giới tính'),
  });
  const { handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      fullName: '',
      phoneNo: '',
      address: '',
      email: '',
      title: '',
      sex: 0,
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, loading, error } = useSelector((state) => state.doctor);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(id);
    if (id) {
      dispatch(fetchDoctor(id));
    }
  }, [id]);

  useEffect(() => {
    if (entity) {
      Object.keys(entity).forEach((key) => {
        if (key === 'id') {
          return;
        }
        setValue(key, entity[key]);
      });
    }
  }, [entity]);

  const onSubmit = (values) => {
    if (id) {
      dispatch(updateDoctor({ id, ...values }));
    } else {
      dispatch(createDoctor(values));
    }
    reset();
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
          {id ? (
            <>
              Cập nhật bác sĩ&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo bác sĩ mới'
          )}
        </DrawerHeader>

        <DrawerBody>
          <Flex as="form" id="update-form" onSubmit={handleSubmit(onSubmit)} flexDir="column" gap={2}>
            <ValidatedInput control={control} name="fullName" type="text" label="Họ & tên" />
            <ValidatedInput control={control} name="phoneNo" type="text" label="Số điện thoại" />
            <ValidatedInput control={control} name="address" type="text" label="Địa chỉ" />
            <ValidatedInput control={control} name="email" type="text" label="Email" />
            <ValidatedInput control={control} name="title" type="text" label="Chức danh" />
            <ValidatedSelect control={control} name="sex" label="Giới tính">
              <option value="0">Nữ</option>
              <option value="1">Nam</option>
              <option value="2">Khác</option>
            </ValidatedSelect>
          </Flex>
        </DrawerBody>

        <DrawerFooter justifyContent="left">
          <Button variant="ghost" mr={3} onClick={handleClose}>
            <AppIcon icon="x" weight="fill" size={24} />
            &nbsp; Hủy
          </Button>
          <Button type="submit" form="update-form" isLoading={loading} colorScheme="teal">
            <AppIcon icon="floppy-disk" weight="fill" size={24} />
            &nbsp; Lưu
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default withSuspense(DoctorEdit);
