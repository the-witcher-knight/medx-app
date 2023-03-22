import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button, Stack, Tooltip } from '@chakra-ui/react';

import AppIcon from './AppIcon';

export function ActionButton({ location, colorScheme, path, label, icon }) {
  return (
    <Tooltip label={label}>
      <Button as={NavLink} to={path} colorScheme={colorScheme} state={{ background: location }}>
        <AppIcon icon={icon} />
      </Button>
    </Tooltip>
  );
}

function ActionButtonGroup({ path, id, children }) {
  const location = useLocation();

  const render = typeof children === 'function' ? children : null;

  return (
    <Stack direction="row" spacing={2}>
      <ActionButton
        location={location}
        path={`${path}/${id}/edit`}
        colorScheme="teal"
        label="Chỉnh sửa"
        icon="pen"
      />

      <ActionButton
        location={location}
        path={`${path}/${id}/delete`}
        colorScheme="red"
        label="Xóa"
        icon="trash"
      />

      {render && render(location)}
    </Stack>
  );
}

export default ActionButtonGroup;
