import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { setCurrentChatUser, setMessages } from "../Store/Slices/dataSlice";

const Header = () => {
  const { name } = useParams();
  const navigate = useNavigate ();
  const dispatch = useDispatch()
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ borderRadius: "10px" }}>
          <Toolbar>
            <Avatar
              sx={{ mr: 2 }}
              alt="name"
              src={`https://api.dicebear.com/5.x/initials/svg?seed=${name}`}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {name}
            </Typography>
            <Box
              padding={"3px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              borderRadius={"100%"}
              bgcolor={"white"}
              sx={{
                cursor: "pointer",
              }}
              onClick={()=>{dispatch(setCurrentChatUser({})); dispatch(setMessages([])); navigate("/")}}
            >
              <CloseIcon sx={{ color: "black" }} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;
