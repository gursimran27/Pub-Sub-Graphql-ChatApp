import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_MESSAGE } from "../graphql/mutation";
import toast from "react-hot-toast";

const Footer = () => {
  const [content, setContent] = useState("");

  const receiverId = useSelector((state) => state?.chat?.currentChatUser?.id);

  const [sendMsgFunc, { loading, data, error }] = useMutation(
    CREATE_NEW_MESSAGE,
    {
      onCompleted: (data) => {
        // console.log(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleChange = (e) => {
    setContent(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (content.trim() === "") {
      toast.error("enter message pls before sending");
      return;
    }
    sendMsgFunc({
      variables: {
        input: {
          receiverId: receiverId,
          content: content,
        },
      },
    });
    setContent("");
  };
  return (
    <Box
      display={"flex"}
      gap={"20px"}
      alignItems={"center"}
      bgcolor={"#1976d1"}
      color={"#fff"}
    >
      <TextField
        sx={{ width: "100%", border: "1px solid black" }}
        size="medium"
        placeholder="enter a message"
        variant="outlined"
        type="text"
        name="text"
        value={content}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <Box
        marginRight={"10px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <SendIcon
          sx={{ cursor: "pointer", fontSize: "30px" }}
          onClick={() => {
            handleSendMessage();
          }}
        />
      </Box>
    </Box>
  );
};

export default Footer;
