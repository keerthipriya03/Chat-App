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

const cloudName = process.env.cloudinary;

const Signup = () => {

  const [show, setShow] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [pic, setPic] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);


  const { setUser } = ChatState();

  const postDetails = (pics) => {
    setLoading(true);
    // Implementation for posting details
    if (pics === undefined) {
      // setLoading(false);
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpg" || pics.type === "image/png" || pics.type === "image/jpeg") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "cloudName");
      fetch("https://api.cloudinary.com/v1_1/cloudName/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // setPic(data.url.toString());
          setPic(data.secure_url);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Upload error:",err);
          setLoading(false);
        });
    } else {
      // setLoading(false);
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async() => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setLoading(false);
      return;
    }
    try{
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post('/api/user', { name, email, password, pic }, config);
      toast({
        title: "Registration Successful!",
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
      console.error("Error during signup:", error);
      toast({
        title: "Signup Error",
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

      <FormControl id='first-name' isRequired>
        <FormLabel>Your Name</FormLabel>
        <Input
          placeholder='Name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
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

      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input
            type='password'
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
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

      <FormControl id='pic'>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
            type='file'
            p={1.5}
            accept='image/*'
            onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        >
        Sign Up
      </Button>

    </VStack>
  );
};

export default Signup;