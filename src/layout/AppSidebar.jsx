/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';
import { Box, chakra, Link, Tooltip, VStack } from '@chakra-ui/react';
import AppIcon from 'icon/AppIcon';

const SideIcon = chakra(AppIcon, {
  baseStyle: {
    w: '2rem',
    h: 'auto',
    p: 1,
    borderRadius: '40%',
  },
});

function SidebarItem({ name, icon, path }) {
  const resolved = useResolvedPath(path);
  const match = useMatch({ path: resolved.pathname, end: true });

  const activeIconStyle = {
    bg: 'teal.500',
    color: 'white',
  };

  return (
    <Tooltip placement="right" label={name}>
      <Link as={NavLink} to={path} sx={{ verticalAlign: 'middle', _hover: {} }}>
        <SideIcon icon={icon} sx={match && activeIconStyle} weight="thin" />
      </Link>
    </Tooltip>
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
