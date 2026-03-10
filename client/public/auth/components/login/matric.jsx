import React from 'react'
import { useState } from 'react';
import { MdAttachEmail } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";
import { FaUserGraduate } from "react-icons/fa"; 
import { TbFaceId } from "react-icons/tb";
import useLoginContext from './context';
import useToast from '../../../context/toast';

const Matric = () => {


  const setToast = useToast((state) => state.setToast)
  const [submitting, setSubmitting] = useState(false)  
  const matric = useLoginContext((state) => state.matric)
  const setMatric = useLoginContext((state) => state.setMatric)
  const setLoginActiveSection = useLoginContext((state) => state.setLoginSection)

  const submitMatric = () => {
    if(!matric) return setToast('Matric cannot be empty empty')
    setSubmitting(true)
    setInterval(() => {
        setLoginActiveSection('')
    },1000)
    
  }

  return (
    <div className='flex flex-col gap-4'>

        <h1 className="py-2.5 text-center">
            {/* <span className='text-3xl'>Matric</span>  */}
            <span className='text-[15px] text-black/50'> enter Matric to open facial verification </span>  
        </h1>

        <div className="flex items-center">
            <FaUserGraduate />
            <input 
                className="px-1.5 py-2.5 outline-none border-b-1 border-b-gray-900 w-full"
                type="text" 
                placeholder='enter matric number...'
                value={matric}
                onChange={(e) => setMatric(e.target.value)}
            />
        </div>

        <button 
            className={`
                px-25.5 py-2.5  md:px-45.5 bg-green-500 rounded-4xl cursor-pointer text-[#ffffff] 
                flex-row items-center gap-2 shadow-[0px_0px_15px_3px] ark:shadow-[#1a1a1a] shadow-[#a6a3a3]
            `}
            onClick={() => submitMatric()}
        >{ submitting? 'loading...' : <TbFaceId className='text-2xl'/> }
        </button>

        <button 
            className='bold decoration-1 underline'
            onClick={() => setLoginActiveSection('login')}
        >login with password</button>
    </div>
  )
}

export default Matric
