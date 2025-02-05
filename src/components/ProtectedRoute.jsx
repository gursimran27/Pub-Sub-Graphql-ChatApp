import React from 'react'
import { useSelector } from 'react-redux'

const ProtectedRoute = (childern) => {
    const { isLoggedIn} = useSelector((state)=>state.chat)
    if (!isLoggedIn) {
        <Navigate to='/auth' />;
    }else{
        <Navigate to='/' />;
    }
}

export default ProtectedRoute