import React from 'react';
import { Box } from '@chakra-ui/react';

import withSuspense from 'components/withSuspense';

function CreateTest() {
  return <Box>Create test</Box>;
}

export default withSuspense(CreateTest, 'Tạo một xét nghiệm mới');
