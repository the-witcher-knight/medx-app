import React from 'react';
import {
  Box,
  Button,
  Text,
  chakra,
  List,
  ListItem,
  useColorModeValue,
  DrawerContent,
  Drawer,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useResolvedPath, useMatch, NavLink } from 'react-router-dom';

const BrandIcon = chakra('img', {
  baseStyle: {
    width: '2rem',
    height: 'auto',
  },
});

function CustomNavLink({ name, path, icon, open }) {
  const resolved = useResolvedPath(path);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <ListItem
      sx={{
        justifyContent: 'center',
        px: 2.5,
        m: 1,
        borderRadius: 2,
      }}
    >
      <Button as={NavLink} to={path} w="full" variant="solid" colorScheme={match && 'yellow'}>
        <FontAwesomeIcon icon={icon} color="inherit" />
        {open && <Text ml={1}>{name}</Text>}
      </Button>
    </ListItem>
  );
}

function SidebarContent({ open, title, brandIcon, items, toggleVisibility, ...rest }) {
  const bgColor = useColorModeValue('gray.200', 'gray.900');

  return (
    <Box
      as="aside"
      flexDirection="column"
      transition="2s ease"
      bg={bgColor}
      h="full"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <Box px={3} my={3} display="flex" flexDirection="row" justifyContent="space-between">
        <Button type="button" onClick={toggleVisibility} w="full" maxW={20}>
          <FontAwesomeIcon icon={open ? 'times' : 'bars'} />
        </Button>

        <Box display={{ base: 'flex', md: 'none' }} alignItems="center">
          <BrandIcon src={brandIcon} alt="logo" />
        </Box>
      </Box>

      <List>
        {items.map((item) => (
          <CustomNavLink
            key={item.title}
            open={open}
            name={item.title}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </List>
    </Box>
  );
}

export default function AppSidebar({ title, brandIcon, items, ...rest }) {
  const { openSidebar } = false;

  const toggleVisibility = () => {};

  const drawerSize = useBreakpointValue({ base: 'full', md: 'xs' });

  return (
    <>
      <SidebarContent
        title={title}
        brandIcon={brandIcon}
        items={items}
        open={openSidebar}
        toggleVisibility={toggleVisibility}
        display={{ base: 'none', md: 'block' }}
        w={20}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      <Drawer
        autoFocus={false}
        isOpen={openSidebar}
        placement="left"
        onClose={toggleVisibility}
        returnFocusOnClose={false}
        onOverlayClick={toggleVisibility}
        size={drawerSize}
      >
        <DrawerContent>
          <SidebarContent
            title={title}
            brandIcon={brandIcon}
            items={items}
            open={openSidebar}
            toggleVisibility={toggleVisibility}
            w="full"
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
