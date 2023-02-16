import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { toastify } from 'common/toastify';
import AppIcon from 'icon/AppIcon';

import withSuspense from 'components/withSuspense';

import { deletePatient } from './patientSlice';

function DeletePatient() {
  const { id } = useParams();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { error } = useSelector((state) => state.patient);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) {
      toastify({ title: 'Có lỗi xãy ra', description: 'Không thể xóa bệnh nhân', status: 'error' });
    }
  }, [error]);

  const onCancel = () => {
    onClose();
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

  const onDelete = () => {
    dispatch(deletePatient(id)).then(() => {
      onCancel();
    });
  };

  return (
    <Modal colorScheme="red" blockScrollOnMount={false} isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader display="flex" justifyContent="center">
          <Box>
            <AppIcon icon="trash" size={54} />
          </Box>
        </ModalHeader>
        <ModalBody>
          <Text mb="1rem">Bạn có chắc chắn muốn xóa bệnh nhân {id} không?</Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onCancel}>
            <AppIcon icon="x" />
            &nbsp;Close
          </Button>
          <Button colorScheme="red" onClick={onDelete}>
            <AppIcon icon="trash" />
            &nbsp;Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default withSuspense(DeletePatient, 'Xóa bệnh nhân');
