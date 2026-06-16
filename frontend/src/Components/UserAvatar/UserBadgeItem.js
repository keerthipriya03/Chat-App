import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="full"
      m={1}
      fontSize={12}
      backgroundColor="blue.500"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display="inline-flex"
      alignItems="center"
      gap={2}
      maxW="fit-content"
    >
      {user.name}
      <CloseIcon boxSize={2} />
    </Box>
  );
};

export default UserBadgeItem;