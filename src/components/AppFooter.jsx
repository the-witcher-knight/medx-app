/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Box, Link, Text } from '@chakra-ui/react';

function AppFooter({ ...rest }) {
  return (
    <Box as="footer" sx={{ mt: '100vh', textAlign: 'center' }} {...rest}>
      <Text>
        &copy;2023{' '}
        <Link color="teal.300" href="http://github.com/virsavik">
          Virsavik
        </Link>
        . All rights reserved.
      </Text>
    </Box>
  );
}

export default AppFooter;
