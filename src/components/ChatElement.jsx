import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCurrentChatUser } from '../Store/Slices/dataSlice'

const ChatElement = ({el}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
  return (
    <>
        <Box padding={'8px'} borderRadius={'10px'} border={"1px solid black"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}
        sx={{backgroundColor: 'lightgray', transitionDuration:'300ms',
        '&:hover':{
            backgroundColor:'gray'
        }
        }}
            onClick={()=>{ dispatch(setCurrentChatUser({currentChatUser:el})); navigate(`/app/receiverId/${el.id}/name/${el.name}`)}}
        >
            <Avatar alt="name" src={`https://api.dicebear.com/5.x/initials/svg?seed=${el.name}`} />
            <Typography variant='body1'>{el.name}</Typography>
        </Box>
    </>
  )
}

export default ChatElement