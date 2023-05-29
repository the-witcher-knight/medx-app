import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
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
import { deletePatient, fetchPatient } from 'store/patientSlice';

import { AppIcon } from 'components';
import withSuspense from 'components/withSuspense';

function PatientDeleteDialog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { loading, entity, updateSuccess } = useSelector((state) => state.patient);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id));
    }
  }, [id]);

  const handleDelete = () => {
    dispatch(deletePatient(id));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      navigate(location.state?.background?.pathname || -1);
    }, 500);
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Xóa thông tin bệnh nhân</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text as="h4" fontSize="lg">
            Bạn có chắc chắn muốn xóa bệnh nhân &quot;{entity?.fullName}&quot;?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button isLoading={loading} colorScheme="red" onClick={handleDelete}>
            <AppIcon icon="trash" />
            &nbsp;Xóa
          </Button>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            <AppIcon icon="x" />
            &nbsp;Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default withSuspense(PatientDeleteDialog, 'Xóa thông tin bệnh nhân');
