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
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { createIndication, fetchIndication, updateIndication } from 'store/indicationSlice';
import { fetchTestCategories } from 'store/testCategorySlice';
import * as yup from 'yup';

import { AppIcon, ValidatedCheck, ValidatedInput, withSuspense } from 'components';

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
      tests: [],
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, loading, error } = useSelector((state) => state.indication);
  const testCategoryState = useSelector((state) => state.testCategory);

  useEffect(() => {
    dispatch(
      fetchTestCategories({
        filters: [],
        sortBy: { fieldName: 'name', accending: true },
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

  const onSubmit = (values) => {
    const tests = Object.keys(values)
      .filter((k) => k !== 'name' && values[k] === true)
      .map((k) => ({ testCategoryId: k }));

    if (id) {
      dispatch(updateIndication({ id, name: values.name, tests }));
    } else {
      dispatch(createIndication({ name: values.name, tests }));
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
              Cập nhật chỉ mục xét nghiệm mới&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo chỉ mục xét nghiệm mới'
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

              <Stack
                sx={{
                  overflowY: 'auto',
                  height: '40rem',
                }}
                spacing={2}
              >
                {testCategoryState.entities.map((category) => (
                  <ValidatedCheck
                    key={`test_category_${category.id}`}
                    control={control}
                    name={category.id}
                    label={category.name}
                  />
                ))}
              </Stack>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default withSuspense(IndicationEdit, 'Chỉnh sửa thông tin đơn vị');
