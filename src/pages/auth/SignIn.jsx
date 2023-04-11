import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Highlight,
  IconButton,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { authAPI } from 'apis';
import StorageAPI from 'common/storageAPI';
import { toastify } from 'common/toastify';
import AuthLoginKey from 'constants/auth';
import { Eye, EyeSlash } from 'phosphor-react';

const PasswordInput = React.forwardRef(({ onChange, onBlur, value }, ref) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Flex>
      <Input
        pr="3rem"
        type={show ? 'text' : 'password'}
        placeholder="Nhập mật khẩu"
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        ref={ref}
      />
      <Box pos="relative">
        <IconButton
          variant="ghost"
          aria-label="Search database"
          icon={show ? <EyeSlash /> : <Eye />}
          onClick={handleClick}
          pos="absolute"
          right="0"
        />
      </Box>
    </Flex>
  );
});

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    if (error) {
      toastify({ title: 'Lỗi', status: 'error', description: error?.message });
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (loginSuccess || StorageAPI.local.get(AuthLoginKey)) {
      navigate('/');
    }
  }, [loginSuccess]);

  const onSubmit = (values) => {
    authAPI.login(values).then(
      (resp) => {
        StorageAPI.local.set(AuthLoginKey, resp.data);
        setLoginSuccess(true);
      },
      (err) => {
        setError(err);
      }
    );
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

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
              <Image
                boxSize="82px"
                src="https://i.pinimg.com/564x/e5/6b/84/e56b841924ac729935e858cb59535fb7.jpg"
                alt=""
              />
              <Box fontSize="2xl">Đăng nhập</Box>
            </Flex>
            <Flex as="form" flexDir="column" gap="1rem" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="userName"
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    ref={ref}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <PasswordInput onChange={onChange} onBlur={onBlur} value={value} ref={ref} />
                )}
              />

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
