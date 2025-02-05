import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_USERS_MESSAGES } from "../graphql/query";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../Store/Slices/dataSlice";

const Conversation = () => {
  //   const { id: receiverID } = useParams();
  const receiverID = useSelector((state) => state?.chat?.currentChatUser?.id);

  const dispatch = useDispatch();

  const { messages = [] } = useSelector((state) => state.chat);
  const { loading, data, error } = useQuery(GET_USERS_MESSAGES, {
    variables: {
      input: {
        receiverId: receiverID,
      },
    },
    fetchPolicy: "no-cache",
    skip: !receiverID, // Skip the query if receiverID is not available
    onCompleted: (data) => {
      const msgs = data.chatMessages.map((el, idx) => {
        return {
          content: el.content,
          id: el.id,
          senderName: el.sender.name,
          receiverName: el.receiver.name,
          senderId: el.sender.id,
          receiverId: el.receiver.id,
          createdAt: el.createdAt,
        };
      });
      dispatch(setMessages({ messages: msgs }));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Box
      display={"flex"}
      gap={"10px"}
      flexDirection={"column"}
      bgcolor={"#d9f2f5"}
      height={"100%"}
      overflow={"auto"}
      padding={"10px"}
    >
      {!loading &&
        Array.isArray(messages) &&
        messages.length > 0 &&
        messages.map((el, ind) => {
          return <Message el={el} key={ind} />;
        })}
    </Box>
  );
};

export default Conversation;
