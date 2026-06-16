import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Text,
  IconButton,
  Spinner,
  Input,
  FormControl,
  useToast,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";

import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatmodal";
import ScrollableChat from "./UserAvatar/ScrollableChat";

import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
  selectedChat,
  setSelectedChat,
  user,
  notification,
  setNotification,
} = ChatState();
  
  const [selectedChatCompare, setSelectedChatCompare] = useState(null);

  const toast = useToast();
  // const { selectedChat, setSelectedChat, user } = ChatState();

  const [socketConnected, setSocketConnected] = useState(false);

  // Lottie config
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // FETCH MESSAGES
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // SEND MESSAGE
  const sendMessage = async (event) => {
    if (event.key !== "Enter" || !newMessage.trim()) return;

    socket.emit("stop typing", selectedChat._id);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const messageContent = newMessage;
      setNewMessage("");

      const { data } = await axios.post(
        "/api/message",
        {
          content: messageContent,
          chatId: selectedChat._id,
        },
        config
      );

      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // TYPING HANDLER
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = Date.now();
    const timerLength = 3000;

    setTimeout(() => {
      let timeNow = Date.now();
      if (timeNow - lastTypingTime >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // SOCKET SETUP
  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);

    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  }, []);

  // FETCH MESSAGES ON CHAT CHANGE
  useEffect(() => {
    fetchMessages();
    setSelectedChatCompare(selectedChat);
  }, [selectedChat]);

  // RECEIVE MESSAGES
  useEffect(() => {
    if (!socket) return;

    const handler = (newMessageReceived) => {
      console.log("MESSAGE RECEIVED:", newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.find((n) => n._id === newMessageReceived._id)) {
          console.log("ADDING NOTIFICATION");
          setNotification((prev) => [newMessageReceived, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.on("message received", handler);

    return () => {
      socket.off("message received", handler);
    };
  }, [selectedChatCompare, notification, fetchAgain]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            px={3}
            py={2}
            w="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              icon={<ArrowBackIcon />}
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner size="xl" />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <FormControl onKeyDown={sendMessage} mt={3}>
              {isTyping && (
                <Lottie options={defaultOptions} width={70} />
              )}

              <Input
                value={newMessage}
                onChange={typingHandler}
                placeholder="Enter message..."
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
          <Text fontSize="3xl">Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;