import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Highlight,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { toastify } from 'common/toastify';
import withFormController from 'hocs/withFormController';
import { login } from 'store/authSlice';
import * as yup from 'yup';

// eslint-disable-next-line react/jsx-props-no-spreading
const ReferInput = React.forwardRef((props, ref) => <Input ref={ref} {...props} />);

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loggedIn, loading, err, success } = useSelector((state) => state.auth);

  const schema = yup.object().shape({
    userName: yup.string().required('Vui lòng nhập tên tài khoản'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      userName: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    if (err) {
      toastify({ title: 'Lỗi', status: 'error', description: err?.message });
    }
  }, [err]);

  useEffect(() => {
    if (success || loggedIn) {
      navigate('/');
    }
  }, [success, loggedIn]);

  const onSubmit = (values) => {
    dispatch(login(values.userName, values.password));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

  const FormField = withFormController(ReferInput, control);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex
          bgColor="white"
          w="max-content"
          m="auto"
          p="1rem"
          justifyContent="center"
          gap="1rem"
          rounded="1rem"
          flexDir="column"
        >
          <Flex flexDir="column" gap="1rem" my={20}>
            <Flex
              flexDir="column"
              w="max-content"
              m="auto"
              textAlign="center"
              alignItems="center"
              mb="1rem"
            >
              {loading ? (
                <Spinner boxSize="82px" colorScheme="telegram" />
              ) : (
                <Image
                  boxSize="82px"
                  src="https://i.pinimg.com/564x/e5/6b/84/e56b841924ac729935e858cb59535fb7.jpg"
                  loading="lazy"
                  alt=""
                />
              )}
              <Box fontSize="2xl">Đăng nhập</Box>
            </Flex>
            <Flex as="form" flexDir="column" gap="1rem" onSubmit={handleSubmit(onSubmit)}>
              <FormField name="userName" type="text" placeholder="Nhập tên tài khoản" />

              <FormField name="password" type="password" placeholder="Nhập tên tài khoản" />

              <Button colorScheme="facebook" type="submit">
                Đăng nhập
              </Button>
            </Flex>
          </Flex>
          <Flex gap=".5rem" alignItems="center">
            <Highlight
              query="đăng ký"
              styles={{
                px: '2',
                py: '1',
                rounded: 'full',
                bg: 'blue.100',
              }}
            >
              Bạn chưa có tài khoản? đăng ký
            </Highlight>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}

export default SignIn;
