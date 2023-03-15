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
import AppIcon from 'icon/AppIcon';

import { withSuspense } from 'components';

import { deleteOne, fetchOne } from './testGroupSlice';

function TestGroupDeleteDialog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const { loading, entity } = useSelector((state) => state.testGroup);

  useEffect(() => {
    if (id) {
      dispatch(fetchOne(id));
    }
  }, [id]);

  const handleDelete = () => {
    dispatch(deleteOne(id));
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
        <ModalHeader>Xóa thông tin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text as="h4" fontSize="lg">
            Bạn có chắc chắn muốn xóa nhóm xét nghiệm &quot;{entity?.name}&quot;?
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

export default withSuspense(TestGroupDeleteDialog, 'Xóa thông tin đơn vị');
