import React from 'react';
import { Box, Button, Checkbox, Flex, IconButton, Image, Input } from '@chakra-ui/react';
import { Eye, EyeSlash } from 'phosphor-react';

function PasswordInput() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Flex>
      <Input pr="3rem" type={show ? 'text' : 'password'} placeholder="Enter password" />
      <Box pos="relative">
        <IconButton
          colorScheme="blue"
          aria-label="Search database"
          icon={show ? <EyeSlash /> : <Eye />}
          onClick={handleClick}
          pos="absolute"
          right="0"
        />
      </Box>
    </Flex>
  );
}

function SignIn() {
  return (
    <Box bgColor="rgba(0,0,0,0.3)" pos="fixed" w="100vw" h="100vh" p="5rem">
      <Flex
        bgColor="white"
        w="max-content"
        m="auto"
        p="1rem"
        justifyContent="center"
        gap="1rem"
        rounded="1rem"
      >
        <Box rounded="1rem" overflow="hidden" p="1rem">
          <img
            src="https://i.pinimg.com/564x/72/f3/88/72f38833235e1d9eb4bc9a5b96d637c4.jpg"
            alt=""
          />
        </Box>
        <Flex flexDir="column" gap="4rem" justifyContent="space-between">
          <Flex flexDir="column" gap="1rem" mt="1rem" p="1.5rem 1.5rem 1.5rem 0">
            <Flex flexDir="column" w="max-content" m="auto" textAlign="center" mb="1rem">
              <Image
                boxSize="82px"
                src="https://i.pinimg.com/564x/e5/6b/84/e56b841924ac729935e858cb59535fb7.jpg"
                alt=""
              />
              <Box fontSize="2xl">Login</Box>
            </Flex>
            <Flex flexDir="column" gap="1rem">
              <Input pr="4.5rem" type="text" placeholder="Enter username" />
              <PasswordInput />
              <Checkbox defaultChecked>remember me?</Checkbox>
              <Button colorScheme="facebook">Login</Button>
            </Flex>
          </Flex>
          <Flex gap=".5rem">
            <Box>Don&apos;t have an account?</Box>
            <Box fontWeight="bold" color="blue.500">
              register
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default SignIn;
