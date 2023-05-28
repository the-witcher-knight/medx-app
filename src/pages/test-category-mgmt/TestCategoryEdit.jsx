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
import {
  createCategory,
  fetchCategory,
  resetEntity,
  updateCategory,
} from 'store/testCategorySlice';
import { fetchTestGroups } from 'store/testGroupSlice';
import { fetchUnits } from 'store/unitSlice';
import * as yup from 'yup';

import { AppIcon, ValidatedCheck, ValidatedInput, ValidatedSelect, withSuspense } from 'components';

function TestCategoryEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().required('Vui lòng nhập mã loại xét nghiệm'),
    name: yup.string().required('Vui lòng nhập tên loại xét nghiệm'),
    lowerBound: yup.number(),
    upperBound: yup.number(),
    displayLimit: yup.string(),
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
      displayLimit: '',
      unitId: '',
      groupId: '',
      price: 0,
      isShowTrueFalseResult: false,
      isPrintReceipt: false,
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, loading } = useSelector((state) => state.testCategory);
  const testGroupSelector = useSelector((state) => state.testGroup);
  const unitSelector = useSelector((state) => state.unit);

  useEffect(() => {
    if (id) {
      dispatch(fetchCategory(id));
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
    if (id) {
      dispatch(updateCategory({ id, ...values }));
    } else {
      dispatch(createCategory(values));
    }
    reset();
  };

  const handleClose = () => {
    onClose();
    dispatch(resetEntity());
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="xl" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{id ? 'Cập nhật loại xét nghiệm' : 'Tạo loại xét nghiệm mới'}</DrawerHeader>

        <DrawerBody>
          <Flex
            as="form"
            id="update-form"
            onSubmit={handleSubmit(onSubmit)}
            flexDir="column"
            gap={2}
          >
            <ValidatedInput control={control} name="code" type="text" label="Mã xét nghiệm" />
            <ValidatedInput control={control} name="name" type="text" label="Tên loại xét nghiệm" />
            <ValidatedInput control={control} name="lowerBound" type="number" label="Ngưỡng thấp" />
            <ValidatedInput control={control} name="upperBound" type="number" label="Ngưỡng cao" />
            <ValidatedInput
              control={control}
              name="displayLimit"
              type="string"
              label="Trị số bình thường"
            />
            <ValidatedSelect control={control} name="unitId" label="Đơn vị">
              <option key="unit_none" value="">
                none
              </option>
              {unitSelector.entities.map((unit) => (
                <option key={`unit_${unit.id}`} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </ValidatedSelect>
            <ValidatedSelect control={control} name="groupId" label="Nhóm xét nghiệm">
              <option key="group_none" value="">
                none
              </option>
              {testGroupSelector.entities.map((gr) => (
                <option key={`group_${gr.id}`} value={gr.id}>
                  {gr.name}
                </option>
              ))}
            </ValidatedSelect>
            <ValidatedInput control={control} name="price" type="number" label="Giá tiền" />
            <ValidatedCheck
              control={control}
              name="isShowTrueFalseResult"
              label="Cho chọn âm/dương tính"
            />
            <ValidatedCheck control={control} name="isPrintReceipt" label="Có in hóa đơn" />
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
