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
import { createUnit, fetchUnit, updateUnit } from 'store/unitSlice';
import * as yup from 'yup';

import { AppIcon, ValidatedInput, withSuspense } from 'components';

function UnitEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập thông tin đơn vị'),
  });
  const { handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, loading, error } = useSelector((state) => state.unit);

  useEffect(() => {
    if (id) {
      dispatch(fetchUnit(id));
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
      dispatch(updateUnit({ id, ...values }));
    } else {
      dispatch(createUnit(values));
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
              Cập nhật đơn vị&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo đơn vị mới'
          )}
        </DrawerHeader>

        <DrawerBody>
          <Flex as="form" id="update-form" onSubmit={handleSubmit(onSubmit)} flexDir="column" gap={2}>
            <ValidatedInput control={control} name="name" type="text" label="Đơn vị" />
          </Flex>
        </DrawerBody>

        <DrawerFooter justifyContent="left">
          <Button type="submit" form="update-form" isLoading={loading} colorScheme="teal">
            <AppIcon icon="floppy-disk" weight="fill" size={24} />
            &nbsp;Lưu
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

export default withSuspense(UnitEdit, 'Chỉnh sửa thông tin đơn vị');
