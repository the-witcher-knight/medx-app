/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import AppIcon from 'icon/AppIcon';

const BrandingIcon = chakra(Image, {
  baseStyle: {
    w: 'auto',
    h: '3rem',
  },
});

function AppTopbar({ ...rest }) {
  const colorModeIcon = useColorModeValue('sun', 'moon');
  const { toggleColorMode } = useColorMode();

  return (
    <Box
      sx={{
        display: 'flex',
        px: 8,
        justifyContent: 'space-between',
      }}
      {...rest}
    >
      <Flex alignItems="center" px={2} gap={2}>
        <BrandingIcon src="/logo192.png" alt="logo" />
        <Text as="h1" size="3xl" fontWeight="bold">
          med-X
        </Text>
      </Flex>

      <HStack py={2} spacing={2}>
        <Button type="button" variant="ghost" size="sm" onClick={toggleColorMode}>
          <AppIcon weight="bold" icon={colorModeIcon} />
        </Button>
        <Menu>
          <MenuButton
            as={Avatar}
            variant="outline"
            size="sm"
            rightIcon={<AppIcon icon="caret-down" />}
          />
          <MenuList>
            <MenuItem icon={<AppIcon icon="user-list" size={24} />}>Thông tin cá nhân</MenuItem>
            <MenuItem icon={<AppIcon icon="sign-out" size={24} />}>Đăng xuất</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
}

export default AppTopbar;
