import React, { useEffect } from 'react'
import { Box, Container, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import Login from '../Components/Authentication/Login';
import SignUpp from '../Components/Authentication/Signup';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Home = () => {

    const history = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if(user) history.push("/chats");
    }, [history]);

  return <Container maxW='xl' centerContent>
    <Box
      display='flex'
      justifyContent='center'
      p={3}
      bg='white'
      w='100%'
      m='40px 0 15px 0'
      borderRadius='lg'
      borderWidth='1px'
    >
        <Text fontFamily='Work sans' fontSize='5xl' color='black' fontWeight='bold'>
            Chat-App
        </Text>
    </Box>
    <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs variant='unstyled' colorScheme='blue'>
            <TabList mb='1em'>
                <Tab width='50%'>Login</Tab>
                <Tab width='50%'>Sign Up</Tab>
            </TabList>
            <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px' />
            <TabPanels>
                <TabPanel> <Login/> </TabPanel>
                <TabPanel> <SignUpp/> </TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
    </Container>
}

export default Home
