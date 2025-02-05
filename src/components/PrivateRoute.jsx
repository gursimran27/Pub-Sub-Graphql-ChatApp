import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {

    const { isLoggedIn } = useSelector((state) => state.chat)

    if(isLoggedIn){
        return children
    }
    else{
      return  <Navigate to={"/auth"} />
    }
}

export default PrivateRoute