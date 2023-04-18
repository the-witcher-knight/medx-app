import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useCheckboxGroup,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { createIndication, fetchIndication, updateIndication } from 'store/indicationSlice';
import { fetchTestCategories } from 'store/testCategorySlice';
import * as yup from 'yup';

import { AppIcon, ValidatedInput, withSuspense } from 'components';

function IndicationEdit() {
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
  const { entity, loading } = useSelector((state) => state.indication);
  const testCategoryState = useSelector((state) => state.testCategory);

  const checkBoxMethods = useCheckboxGroup();

  useEffect(() => {
    dispatch(
      fetchTestCategories({
        filters: [],
        sortBy: { fieldName: 'createdOn', accending: false },
        pageIndex: 1,
        pageSize: 10000,
      })
    );
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchIndication(id));
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

  useEffect(() => {
    const indicationTests = entity?.tests.map((test) => test.testCategoryId);
    const values = testCategoryState.entities
      .filter((cate) => indicationTests?.includes(cate.id))
      .map((cate) => cate.id);

    checkBoxMethods.setValue(values);
  }, [testCategoryState.entities, entity]);

  const onSubmit = (values) => {
    const tests = checkBoxMethods.value.map((cateID) => ({
      testCategoryId: cateID,
      indicationId: id,
    }));

    if (id) {
      dispatch(updateIndication({ id, name: values.name, tests }));
    } else {
      dispatch(createIndication({ name: values.name, tests }));
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

  const onNextIndication = () => {
    reset();
    checkBoxMethods.setValue([]);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="xl" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {id ? 'Cập nhật chỉ định xét nghiệm' : 'Tạo chỉ mục xét nghiệm mới'}
        </DrawerHeader>

        <DrawerBody>
          <Flex
            as="form"
            id="update-form"
            onSubmit={handleSubmit(onSubmit)}
            flexDir="column"
            gap={2}
          >
            <ValidatedInput
              control={control}
              name="name"
              type="text"
              label="Tên chỉ mục xét nghiệm"
            />

            <Flex direction="column">
              <Text as="h2" fontSize="md" fontWeight="medium">
                Các loại xét nghiệm:
              </Text>

              {testCategoryState.entities.length > 0 ? (
                <Stack
                  sx={{
                    overflowY: 'auto',
                    height: '40rem',
                  }}
                  spacing={2}
                >
                  {testCategoryState.entities.map((cate) => (
                    <Checkbox
                      key={`test_category_${cate.id}`}
                      value={cate.id}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...checkBoxMethods.getCheckboxProps({ value: cate.id })}
                    >
                      {cate.name}
                    </Checkbox>
                  ))}
                </Stack>
              ) : (
                <Alert status="warning">
                  <AlertIcon />
                  <AlertTitle>Hiện không có dữ liệu loại xét nghiệm!</AlertTitle>
                  <AlertDescription>Vui lòng tải lại trang.</AlertDescription>
                </Alert>
              )}
            </Flex>
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
          <Button type="button" colorScheme="yellow" onClick={onNextIndication} hidden={!!id}>
            <AppIcon icon="skip-forward" weight="fill" size={24} />
            &nbsp;Tiếp tục
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default withSuspense(IndicationEdit, 'Chỉnh sửa thông tin đơn vị');
