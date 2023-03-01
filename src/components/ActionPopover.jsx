import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react';
import AppIcon from 'icon/AppIcon';

function ActionPopover({ path, id }) {
  const location = useLocation();

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" type="button" size="sm">
          <AppIcon icon="dots-three-outline-vertical" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Hành động</PopoverHeader>
        <PopoverBody>
          <VStack spacing={2} m={2} align="stretch">
            <Link
              as={NavLink}
              to={`${path}/${id}/edit`}
              state={{ background: location }}
              sx={{ _hover: {} }}
            >
              <Flex gap={3} alignItems="center">
                <Box
                  sx={{ w: 6, h: 'auto', p: 1, borderRadius: 'md', shadow: 'sm' }}
                  as={AppIcon}
                  icon="pen"
                />
                <Text>Chỉnh sửa</Text>
              </Flex>
            </Link>

            <Link
              as={NavLink}
              to={`${path}/${id}/delete`}
              state={{ background: location }}
              sx={{ _hover: {} }}
            >
              <Flex gap={3} alignItems="center">
                <Box
                  sx={{ w: 6, h: 'auto', p: 1, borderRadius: 'md', shadow: 'sm' }}
                  as={AppIcon}
                  icon="trash"
                />
                <Text>Xóa</Text>
              </Flex>
            </Link>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default ActionPopover;
