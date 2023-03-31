import { createStandaloneToast } from '@chakra-ui/react';

const { ToastContainer, toast } = createStandaloneToast();

export const toastify = ({
  title,
  description,
  status,
  duration = 2000,
  isClosable = true,
  position = 'top-right',
}) =>
  toast({
    title,
    description,
    status,
    duration,
    isClosable,
    position,
  });

export default ToastContainer;
