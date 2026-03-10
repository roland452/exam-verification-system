import { TbFaceId } from "react-icons/tb"; 
import { FcOpenedFolder } from "react-icons/fc"; 
import { FaGraduationCap, FaHome } from "react-icons/fa";
import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import InputComponent from "./inputComponent";
import AuthButtons from "./buttons/authButtons";

import useLoginContext from "./components/login/context";


const AuthComponent = () => {

  const [authSection, setAuthSection] = useState('login')
  const setLoginActiveSection = useLoginContext((state) => state.setLoginSection)
  const matric = useLoginContext((state) => state.matric)

  useEffect(() => {
    if(!matric) return setLoginActiveSection('login')
  },[])

  return (
    <>
    <div className="flex items-center gap-5 text-l absolute right-[8%] top-[2%] z-50"> 
      <Link to={'/admin'} className="font-bold decoration-1  underline cursor-pointer">Admin</Link> 
      <Link to={'/dashboard'} className="font-bold decoration-1 underline cursor-pointer">Dashboard</Link> 
    </div>

    <div className='h-screen ark:bg-[#030813] ark:text-white'>

      <div className='fixed left-5 right-5 top-11 bottom-11 shadow-xl shadow-gray-400 rounded-4xl p-0 md:right-11 md:left-11 ark:shadow-[#031e4b] overflow-hidden'> 


        {/* welcome header for auth */}
        <div className='place-self-center flex align pt-5'>
            {/* <h1 className='text-xl md:text-3xl my-5 font-bold'>Exam Verification</h1> */}
            <div className="bg-white p-3 rounded-2xl shadow-xl mb-4">
              <img 
                  className='w-16 h-16 object-contain'
                  src="../../src/assets/Kaduna State University Official_iddJOb3gD__0.png" 
                  alt="KASU Logo" 
                />
            </div>
        </div>

        {/* switch auth section button */}
        <AuthButtons 
            authSection={authSection}
            setAuthSection={setAuthSection}
        />
        {/* input for auth section */}
        <InputComponent 
            authSection={authSection}
        />
      </div>
    </div>
    </>
  )
}

export default AuthComponent
