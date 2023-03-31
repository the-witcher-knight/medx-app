import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';

import { AppIcon, withSuspense } from 'components';

function TestDetail() {
  const { testID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const loading = false;

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
        <DrawerHeader>Chi tiết xét nghiệm</DrawerHeader>

        <Flex gap={2} m={5}>
          <Button>
            <AppIcon icon="printer" size={24} weight="duotone" />
            &nbsp;In phiếu thu
          </Button>
          <Button>
            <AppIcon icon="printer" size={22} weight="duotone" />
            &nbsp;In kết quả
          </Button>
        </Flex>

        <DrawerBody>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Mã xét nghiệm</Th>
                  <Th>Tên xét nghiệm</Th>
                  <Th>Kết quả</Th>
                  <Th>Chỉ số bình thường</Th>
                  <Th>Đơn vị</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>xxx</Td>
                  <Td>Xét tùm lum</Td>
                  <Td>
                    <Input />
                  </Td>
                  <Td>Chỉ số bình dương</Td>
                  <Td>Đơn vị</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </DrawerBody>

        <DrawerFooter justifyContent="left">
          <Button
            type="submit"
            form="update-form"
            isLoading={loading}
            colorScheme="teal"
            onClick={handleClose}
          >
            <AppIcon icon="check" weight="fill" size={24} />
            &nbsp;Hoàn thành
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

export default withSuspense(TestDetail, 'Cập nhật chi tiết xét nghiệm');
