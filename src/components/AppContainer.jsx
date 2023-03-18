import React from 'react';
import { Box } from '@chakra-ui/react';

function AppContainer({ children, ...rest }) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box as="div" p={5} {...rest}>
      {children}
    </Box>
  );
}

export default AppContainer;
