import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const NotFound = () => {
    const { isLoggedIn} = useSelector((state)=>state.chat)
  
    if(isLoggedIn) {
        return <Navigate to={"/"} />
    }else{
        return <Navigate to={"/auth"} />
    }
}

export default NotFound