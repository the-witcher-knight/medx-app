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
import { GenderConstant } from 'constants';
import { createPatient, fetchPatient, updatePatient } from 'store/patientSlice';
import * as yup from 'yup';

import { AppIcon } from 'components';
import ValidatedInput from 'components/ValidatedInput';
import ValidatedSelect from 'components/ValidatedSelect';
import withSuspense from 'components/withSuspense';

function PatientEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    fullName: yup.string().required('Vui lòng nhập họ tên'),
    personalId: yup.string().required('Vui lòng nhập căn cước công dân'),
    phoneNo: yup
      .string()
      .required('Vui lòng nhập số điện thoại')
      .length(10, 'Số điện thoại không hợp lệ'),
    address: yup.string().required('Vui lòng nhập địa chỉ'),
    email: yup.string().email().notRequired(),
    sex: yup.number().required('Vui lòng chọn giới tính'),
  });
  const { handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      fullName: '',
      personalId: '',
      code: '',
      phoneNo: '',
      birthday: '',
      address: '',
      email: '',
      sex: 0,
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { entity, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id));
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
      dispatch(updatePatient({ id, ...values }));
    } else {
      dispatch(createPatient(values));
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
              Cập nhật bệnh nhân&nbsp;
              <Text as="sub">{id}</Text>
            </>
          ) : (
            'Tạo bệnh nhân mới'
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
            <ValidatedInput control={control} name="fullName" type="text" label="Họ & tên" />
            <ValidatedInput control={control} name="personalId" type="text" label="CCCD" />
            <ValidatedInput control={control} name="phoneNo" type="text" label="Số điện thoại" />
            <ValidatedInput control={control} name="birthday" type="date" label="Ngày sinh" />
            <ValidatedInput control={control} name="address" type="text" label="Địa chỉ" />
            <ValidatedInput control={control} name="email" type="text" label="Email" />
            <ValidatedSelect control={control} name="sex" label="Giới tính">
              {Object.keys(GenderConstant).map((gender) => (
                <option key={`gender_${gender}`} value={GenderConstant[gender]}>
                  {gender}
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

export default withSuspense(PatientEdit, 'Chỉnh sửa thông tin bệnh nhân');
