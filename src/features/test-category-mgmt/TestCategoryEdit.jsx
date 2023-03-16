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
import { fetchAll as fetchTestGroups } from 'features/test-group-mgmt/testGroupSlice';
import { fetchAll as fetchUnits } from 'features/unit-mgmt/unitSlice';
import AppIcon from 'icon/AppIcon';
import * as yup from 'yup';

import { ValidatedInput, ValidatedSelect, withSuspense } from 'components';

import { createOne, fetchOne, updateOne } from './testCategorySlice';

function TestCategoryEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().required('Vui lòng nhập mã loại xét nghiệm'),
    name: yup.string().required('Vui lòng nhập tên loại xét nghiệm'),
    lowerBound: yup.number().required('Vui lòng nhập ngưỡng thấp'),
    upperBound: yup.string().required('Vui lòng nhập ngưỡng cao'),
    unitId: yup.string().required('Vui lòng chọn một loại đơn vị'),
    groupId: yup.string().required('Vui lòng chọn một nhóm xét nghiệm'),
    price: yup.string().required('Vui lòng nhập giá tiền').min(0, 'Hãy nhập số tiền hợp lệ'),
  });
  const { handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      code: '',
      name: '',
      lowerBound: 0,
      upperBound: 0,
      unitId: '',
      groupId: '',
      price: 0,
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, loading, error } = useSelector((state) => state.testCategory);
  const testGroupSelector = useSelector((state) => state.testGroup);
  const unitSelector = useSelector((state) => state.unit);

  useEffect(() => {
    if (id) {
      dispatch(fetchOne(id));
    }

    dispatch(
      fetchUnits({
        sortBy: { fieldName: 'name', accending: true },
        pageIndex: 1,
        pageSize: 10000,
      })
    );
    dispatch(
      fetchTestGroups({
        sortBy: { fieldName: 'name', accending: true },
        pageIndex: 1,
        pageSize: 10000,
      })
    );
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
    const unit = testGroupSelector.entites.find((u) => u.id === values.unitId);
    const group = unitSelector.entites.find((gr) => gr.id === values.groupId);
    const saveData = { ...values, unitName: unit.name, groupName: group.name };

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
              Cập nhật loại xét nghiệm&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo loại xét nghiệm mới'
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
            <ValidatedInput control={control} name="code" type="text" label="Mã loại xét nghiệm" />
            <ValidatedInput control={control} name="name" type="text" label="Đơn vị" />
            <ValidatedInput control={control} name="lowerBound" type="number" label="Ngưỡng thấp" />
            <ValidatedInput control={control} name="upperBound" type="number" label="Ngưỡng cao" />
            <ValidatedSelect control={control} name="unitId" label="Đơn vị">
              {unitSelector.entities.map((unit) => (
                <option key={`unit_${unit.id}`} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </ValidatedSelect>
            <ValidatedSelect control={control} name="groupId" label="Nhóm xét nghiệm">
              {testGroupSelector.entities.map((gr) => (
                <option key={`group_${gr.id}`} value={gr.id}>
                  {gr.name}
                </option>
              ))}
            </ValidatedSelect>
            <ValidatedInput control={control} name="price" type="number" label="Giá tiền" />
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

export default withSuspense(TestCategoryEdit, 'Chỉnh sửa thông tin loại xét nghiệm');
