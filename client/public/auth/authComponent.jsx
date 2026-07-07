import { FaUserShield } from "react-icons/fa"; 
import { FaUserGraduate } from "react-icons/fa"; 
import { TbFaceId } from "react-icons/tb";
import { FaGraduationCap, FaHome } from "react-icons/fa";
import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import InputComponent from "./inputComponent";
import AuthButtons from "./buttons/authButtons";
import useLoginContext from "./components/login/context";
import KasuIcon from '../../src/assets/kasu_icon.png'

const AuthComponent = () => {

  const [authSection, setAuthSection] = useState('login')
  const setLoginActiveSection = useLoginContext((state) => state.setLoginSection)
  const matric = useLoginContext((state) => state.matric)

  useEffect(() => {
    if(!matric) return setLoginActiveSection('login')
  },[])

  return (
    <>
    {/* top nav – glass pill */}
    <div className="flex items-center gap-1 absolute right-4 top-4 md:right-8 md:top-8 z-20 bg-white/70 ark:bg-white/[0.06] backdrop-blur-xl border border-black/5 ark:border-white/10 rounded-full p-1 shadow-lg shadow-black/5">
      <Link
        to={'/admin'}
        className={`flex items-center gap-1.5 font-semibold text-sm px-4 py-2 rounded-full ${authSection === 'admin'? 'bg-green-400  text-white  shadow-lg shadow-green-500/25' : 'text-black'} transition-colors`}
      >
        <FaUserShield size={16}/> 
      </Link>
      <Link
        to={'/dashboard'}
        className={`flex items-center gap-1.5 font-semibold text-sm px-4 py-2 rounded-full ${authSection !== 'admin'? 'bg-green-900  text-white  shadow-lg shadow-green-900/25' : 'text-black'}  ark:text-gray-300 hover:bg-black/5 ark:hover:bg-white/10 hover:text-green-900 ark:hover:text-emerald-400 transition-colors`}
      >
        <FaUserGraduate size={14}/> 
      </Link>
    </div>

    {/* page backdrop */}
    <div className='h-screen bg-gradient-to-b from-gray-50 to-gray-100 ark:from-[#030813] ark:to-[#04150f] ark:text-white relative overflow-hidden'>

      {/* ambient glow accents, kept subtle */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-900/10 ark:bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-green-900/10 ark:bg-emerald-500/5 blur-3xl" />

      <div className='fixed left-0 right-0 top-17 bottom-0 md:top-10 bg-white/5'>

        {/* welcome header for auth */}
        <div className='place-self-center flex flex-col items-center pt-8 relative'>
            {/* soft pulse ring behind the crest – a quiet nod to biometric scanning */}
            <span className="absolute top-8 w-24 h-24 rounded-2xl bg-green-900/20 ark:bg-emerald-400/20 blur-xl animate-pulse" />
            <div className="relative bg-white p-3.5 rounded-2xl shadow-xl shadow-green-900/10 ring-1 ring-black/5 mb-3">
              <img
                  className='w-16 h-16 object-contain'
                  src={KasuIcon}
                  alt="KASU Logo"
                />
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-gray-400 ark:text-gray-500 mb-2">
              <FaGraduationCap size={12} className="text-green-900 ark:text-emerald-400"/>
              Exam Verification Portal
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
