import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {children ? (
            <span onClick={onOpen}>{children}</span>
            ) : (
            <IconButton
                display={{ base: "flex" }}
                icon={<ViewIcon />}
                onClick={onOpen}
            />
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center"
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex" flexDir="column" alignItems="center" justifyContent="space-between"
                    >
                        <Image borderRadius="full"
  boxSize="150px"
  objectFit="cover" src={user.pic || "https://thf.bing.com/th/id/OIP.wYb_ZL5QQSPeM3BpoAHMsAHaHa?w=197&h=198&c=7&r=0&o=7&cb=thfc1falcon2&dpr=1.3&pid=1.7&rm=3"} alt={user.name} />

  {/* <Avatar
  size="2xl"
  name={user.name}
  src={
    user.pic ||
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  }
/> */}

                        <Text fontSize={{ base:"28px", md:"30px" }} fontFamily="Work sans" >
                            Name :{ user.name }
                        </Text>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
        </>
    );
}

export default ProfileModal
