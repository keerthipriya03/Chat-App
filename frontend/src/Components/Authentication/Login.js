import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack
} from '@chakra-ui/react';
import React from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { ChatState } from "../../Context/ChatProvider";

const Login = () => {

  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const toast = useToast();
  const history = useHistory();
  const handleClick = () => setShow(!show);


  const { setUser } = ChatState();

  const postDetails = (pics) => {};

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try{
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post('/api/user/login', { email, password }, config);
      toast({
        title: "Login Successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      history.push('/chats');
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Login Error",
        description: error.response.data.message || "An error occurred during login.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
        value={email}
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputRightElement width='4.5rem'>
            <Button
              h='1.75rem'
              size='sm'
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

      </FormControl>

      

      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        >
        Login
      </Button>
      <Button
        variant='solid'
        colorScheme='red'
        width='100%'
        onClick={() => {
            setEmail("user@example.com");
            setPassword("password");
        }}
      >
        Use Guest Credentials
      </Button>

    </VStack>
  );
};

export default Login;