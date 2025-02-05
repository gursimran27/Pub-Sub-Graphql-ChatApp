import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import ChatElement from "./ChatElement";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCurrentChatUser,
  setIsLoggedIn,
  setLoggedInUser,
  setMessages,
} from "../Store/Slices/dataSlice";
import { GET_USERS } from "../graphql/query";
import { useQuery } from "@apollo/client";

const UserCards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useQuery, which automatically fetches data
  const { loading, error, data } = useQuery(GET_USERS, {
    // variables: { id: userId },
    pollInterval: 5000,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      null;
    },
  });
  return (
    <Box
      display={"flex"}
      alignContent={"center"}
      justifyContent={"space-between"}
      flexDirection={"column"}
      height="100vh"
      width={"20%"}
      borderRadius={"10px"}
      padding={"10px"}
      border={"1px solid black"}
      sx={{ backgroundColor: "#c9f1f5" }}
    >
      <Typography alignSelf={"center"} variant="h4">
        Chats
      </Typography>
      <Divider
        sx={{ marginTop: "-30px", marginBottom: "-30px" }}
        color="blue"
      />
      <Box
        height={"80%"}
        borderRadius={"10px"}
        border={"1px solid green"}
        padding={"10px"}
        display={"flex"}
        flexDirection={"column"}
        alignContent={"center"}
        gap={"10px"}
        overflow={"auto"}
      >
        {!loading &&
          data?.users.map((el, ind) => {
            return <ChatElement el={el} key={ind} />;
          })}
      </Box>

      <Box
        display={"flex"}
        justifyContent={"start"}
        alignItems={"center"}
        gap={"10px"}
      >
        <LogoutIcon
          sx={{
            fontSize: "30px",
            cursor: "pointer",
            transition: "all",
            transitionDuration: "300ms",
            "&:hover": {
              color: "red",
            },
          }}
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            dispatch(setIsLoggedIn({ isLoggedIn: false }));
            dispatch(setCurrentChatUser({}));
            dispatch(setMessages([]));
            dispatch(setLoggedInUser({ loggedInUser: {} }));
            navigate("/auth");
          }}
        />
        <Typography variant="caption">Logout</Typography>
      </Box>
    </Box>
  );
};

export default UserCards;
