/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

import AppIcon from './AppIcon';

const BrandingIcon = chakra(AppIcon, {
  baseStyle: {
    w: '2rem',
    h: 'auto',
    p: 1,
    borderRadius: '40%',
  },
});

function AppTopbar({ routes, ...rest }) {
  const location = useLocation();
  const colorModeIcon = useColorModeValue('sun', 'moon');
  const { toggleColorMode } = useColorMode();
  const [namePage, setNamePage] = useState('Trang chủ');
  const [iconPage, setIconPage] = useState('house');

  useEffect(() => {
    const matchedRoute = routes.find((route) => route.path === location.pathname);
    if (matchedRoute) {
      setNamePage(matchedRoute.name);
      setIconPage(matchedRoute.icon);
    }
  }, [location]);

  return (
    <Box {...rest}>
      <Flex sx={{ alignItems: 'center', px: 2 }} gap={2}>
        <BrandingIcon icon={iconPage} />
        <Text as="h1" size="3xl" fontWeight="bold">
          {namePage}
        </Text>
      </Flex>

      <Flex>
        <HStack sx={{ py: 2 }} spacing={2}>
          <Tooltip label="Chuyển đổi chế độ sáng/tối" fontSize="md" placement="bottom">
            <Button type="button" variant="ghost" size="sm" onClick={toggleColorMode}>
              <AppIcon weight="bold" icon={colorModeIcon} />
            </Button>
          </Tooltip>
          <Tooltip label="Trợ giúp" fontSize="md" placement="bottom">
            <Button type="button" variant="ghost" size="sm">
              <AppIcon weight="bold" icon="question" />
            </Button>
          </Tooltip>
          <Menu>
            <MenuButton as={Avatar} variant="outline" size="sm" />
            <MenuList>
              <MenuItem icon={<AppIcon icon="user-list" size={24} />}>Thông tin cá nhân</MenuItem>
              <MenuItem icon={<AppIcon icon="sign-out" size={24} />}>Đăng xuất</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}

export default AppTopbar;
