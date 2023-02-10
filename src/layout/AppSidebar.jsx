/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';
import { Box, chakra, Flex, Link, Text, VStack } from '@chakra-ui/react';
import AppIcon from 'icon/AppIcon';

const SideIcon = chakra(AppIcon, {
  baseStyle: {
    w: 6,
    h: 'auto',
    p: 1,
    borderRadius: 'md',
    shadow: 'sm',
  },
});

function SidebarItem({ name, icon, path }) {
  const resolved = useResolvedPath(path);
  const match = useMatch({ path: resolved.pathname, end: true });

  const activeStyle = {
    color: 'teal.500',
  };

  const activeIconStyle = {
    bg: 'teal.500',
    color: 'white',
  };

  return (
    <Link as={NavLink} to={path} sx={{ _hover: {} }}>
      <Flex gap={3} alignItems="center">
        <SideIcon icon={icon} sx={match && activeIconStyle} weight="bold" />
        <Text sx={match && activeStyle}>{name}</Text>
      </Flex>
    </Link>
  );
}

function AppSidebar({ routes, ...rest }) {
  return (
    <Box
      as="aside"
      sx={{
        h: 'full',
        shadow: 'md',
      }}
      {...rest}
    >
      <VStack spacing={2} m={2} align="stretch">
        {routes.map((r) => (
          <SidebarItem key={r.name} name={r.name} icon={r.icon} path={r.path} />
        ))}
      </VStack>
    </Box>
  );
}

export default AppSidebar;
