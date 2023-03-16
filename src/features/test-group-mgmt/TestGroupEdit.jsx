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
import AppIcon from 'icon/AppIcon';
import * as yup from 'yup';

import { ValidatedInput, ValidatedSelect, withSuspense } from 'components';

import { createOne, fetchOne, updateOne } from './testGroupSlice';

function TestGroupEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên nhóm xét nghiệm'),
    level: yup.number().required('Vui lòng nhập mực độ').min(0, 'mức độ phải lớn hơn 0'),
    parentGroupId: yup.string(),
  });
  const { handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      name: '',
      level: 0,
      parentGroupId: '',
      parentGroupName: '',
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entities, entity, loading, error } = useSelector((state) => state.testGroup);

  useEffect(() => {
    if (id) {
      dispatch(fetchOne(id));
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
    const parentGroup = entities.find((ent) => ent.id === values.parentGroupId);
    const saveData = { ...values, parentGroupName: parentGroup?.name };

    if (id) {
      dispatch(updateOne({ id, ...saveData }));
    } else {
      dispatch(createOne(saveData));
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
              Cập nhật nhóm xét nghiệm&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo nhóm xét nghiệm mới'
          )}
        </DrawerHeader>

        <DrawerBody>
          <Flex
            as="form"
            id="update-form"
            onSubmit={handleSubmit(onSubmit)}
            flexDir="column"
            gap={2}
          >
            <ValidatedInput control={control} name="name" type="text" label="Tên nhóm xét nghiệm" />
            <ValidatedInput control={control} name="level" type="number" label="Mức độ" />
            <ValidatedSelect control={control} name="parentGroupId" label="Thuộc nhóm xét nghiệm">
              <option key="none" value="">
                none
              </option>
              {entities.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.name}
                </option>
              ))}
            </ValidatedSelect>
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

export default withSuspense(TestGroupEdit, 'Chỉnh sửa thông tin nhóm xét nghiệm');
