import { useNavigate } from "react-router-dom";
import React from 'react'
import { useState } from "react";
import axios from 'axios'
import useRefresh from "../../context/refresh";
import LoginContent from "../components/login/login";
import Matric from "../components/login/matric";
import FaceVerification from "../components/login/faceVerification";
import useLoginContext from "../components/login/context";
import useToast from '../../context/toast'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = ({authSection, setPopup, submitting, setSubmitting}) => {

  const navigate = useNavigate()

  const setRefresh = useRefresh((state) => state.setRefresh)
  const refresh = useRefresh((state) => state.refresh)
  const setToast = useToast((state) => state.setToast);

  const [matric, setMatric] = useState('')
  const [password, setPassword] = useState('')
  const matricRegex = /^kasu\/[a-z]{3}\/[a-z]{3}\/\d{2}\/\d{4}$/i;

  async function apiRequest() {
    setSubmitting(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/login/password`,
        { matric, password },
        {withCredentials: true}
      )

      const data = res.data
      console.log(data)
      setSubmitting(false)
      setToast('Logged in successfully')
      setPopup(data.message)
      setRefresh(!refresh)
      setTimeout(() => {
        navigate('/dashboard')
      },2000)
      
    } catch (error) {

      console.log(error);

      setSubmitting(false)
      setPopup(error.response.data.message)
    }
  }

  
  const handleSubmit = () => {
    if(!matric || !password) return setPopup('input cant be empty')
    if(!matricRegex.test(matric)) return setPopup('matric is not a valid type')
    if(password.length < 6) return setPopup('password must be atleast 6 characters')

    apiRequest()    
  }

  const loginActiveSection = useLoginContext((state) => state.loginSection)
  
  return (
    <div className={`${authSection === 'login'? 'flex flex-col gap-4' : 'hidden'}`}>
      {
        loginActiveSection === 'login'? (
          <LoginContent 
            matric={matric}
            setMatric={setMatric}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            submitting={submitting}
          />
        ) :

        loginActiveSection === 'matric'? (
          <Matric />
        ) :

        <FaceVerification />


        
      }
    </div>
  )
}

export default Login
