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
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUser, fetchUser, updateUser } from 'store/userSlice';
import * as yup from 'yup';

import { AppIcon, ValidatedInput, withSuspense } from 'components';

function UserEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    email: yup.string().email().required('Vui lòng nhập email'),
  });
  const { handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchUser(id));
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
      dispatch(updateUser({ id, ...values }));
    } else {
      dispatch(createUser(values));
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
        <DrawerHeader>{id ? <>Cập nhật người dùng</> : 'Tạo người dùng mới'}</DrawerHeader>

        <DrawerBody>
          <Flex
            as="form"
            id="update-form"
            onSubmit={handleSubmit(onSubmit)}
            flexDir="column"
            gap={2}
          >
            <ValidatedInput control={control} name="email" type="text" label="Email" />
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

export default withSuspense(UserEdit, 'Chỉnh sửa người dùng');
