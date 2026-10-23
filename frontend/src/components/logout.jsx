import React from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import { toast } from 'react-hot-toast'
import server from '../environment.js'
import axios from 'axios'
import { useEffect } from 'react'

function Logout() {

  const { authUser, setAuthUser } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await axios.post(`${server}/user/logout`, {}, { withCredentials: true });
        localStorage.removeItem('authUserData');
        setAuthUser(null);
        toast.success("Logged Out!"); 
      } catch (err) {
        console.log(err);
        toast.error("Fail to Logout!");
      }
    }
    handleLogout();
  }, [setAuthUser]);


  return null;
}

export default Logout;

















