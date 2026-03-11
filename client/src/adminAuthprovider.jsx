import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import useProfile from '../public/context/profile'
import useRefresh from '../public/context/refresh'
import LoaderAnimation from './assets/loader'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminAuthprovider = ({ children }) => {
  const navigate = useNavigate()
  
  // State from your stores
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { setProfile, setProfileLoading, profileLoading } = useProfile()
  const refresh = useRefresh((state) => state.refresh)

  useEffect(() => {
    async function fetchAuth() {
      setProfileLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/api/admin-auth`, {
          withCredentials: true
        })
        
        const data = res.data
        
        // if (data.profile) {
        //   setProfile(data.profile)
        // }

        console.log(data,'from admin auth')
        
        setIsAuthenticated(data.authenticated || false)

        if (!data.authenticated) {
          navigate('/')
        }
      } catch (error) {
        console.error("Auth check failed", error)
        setIsAuthenticated(false)
        navigate('/')
      } finally {
        setProfileLoading(false)
      }
    }

    fetchAuth()
  }, [refresh, navigate, setIsAuthenticated, setProfile, setProfileLoading])

  
  if (profileLoading) {
    return <LoaderAnimation /> 
  }

  return isAuthenticated ? <> {children} </> : null
}

export default AdminAuthprovider
