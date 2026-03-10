import React from 'react'
import { FaUserGraduate } from "react-icons/fa";
import { HiLockOpen } from 'react-icons/hi';

const SignupInput = ({ matric, setMatric, password, setPassword }) => {

  return (
    <div className={`flex flex-col gap-4 `}>
        
        <div className="flex items-center">
            <FaUserGraduate />
            <input 
                className="px-1.5 py-2.5 outline-none border-b-1 border-b-gray-900 w-full"
                type="text" 
                placeholder='matric'
                value={matric}
                onChange={(e) => setMatric(e.target.value)}
            />
        </div>
        
        <div className="flex items-center">
            <HiLockOpen />
            <input 
                className="px-1.5 py-2.5 outline-none border-b-1 border-b-gray-900 w-full"
                type="password" 
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        
    
    </div>
  )
}

export default SignupInput
