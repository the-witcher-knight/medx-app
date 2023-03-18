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

import AppIcon from './AppIcon';

export function ActionItem({ location, path, label, icon }) {
  return (
    <Link as={NavLink} to={path} state={{ background: location }} sx={{ _hover: {} }}>
      <Flex gap={3} alignItems="center">
        <Box sx={{ w: 6, h: 'auto', p: 1 }} as={AppIcon} icon={icon} />
        <Text>{label}</Text>
      </Flex>
    </Link>
  );
}

function ActionPopover({ path, id, render }) {
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
            <ActionItem location={location} path={`${path}/${id}/edit`} label="Chỉnh sửa" icon="pen" />

            <ActionItem location={location} path={`${path}/${id}/delete`} label="Xóa" icon="trash" />

            {render && render(location)}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default ActionPopover;
