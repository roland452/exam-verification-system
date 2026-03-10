import React from 'react'
import { FaUserAlt } from "react-icons/fa"; 
import { FaUserLock } from "react-icons/fa"; 
import { FaUserAltSlash } from "react-icons/fa"; 
import { BiLogInCircle } from "react-icons/bi"; 


const AuthButtons = ({authSection, setAuthSection}) => {
  return (
        <div className="place-self-center flex gap-10 my-5.5 ark:text-[#d5cece]">
            <button 
                className={`w-12 h-12 text-xl place-items-center rounded-full cursor-pointer bg-gray-100 
                ${
                    authSection === 'login'? 'bg-green-500 text-white shadow-xl shadow-gray-400 transition-all animate-bounce' 
                    : 'bg-gray-100'
                }`
                }
                onClick={() => setAuthSection('login')}
            ><BiLogInCircle /></button>

            <button 
                className={`w-12 h-12 text-xl place-items-center rounded-full cursor-pointer 
                ${
                    authSection === 'signup'? ' bg-green-900 text-white shadow-xl shadow-gray-400 transition-all animate-bounce' 
                    : 'bg-gray-100'
                }`
                }
                value={'signup'}
                onClick={() => setAuthSection('signup')}
            ><FaUserAlt /></button>

            <button 
                className={`w-12 h-12 text-xl place-items-center rounded-full cursor-pointer bg-gray-100 
                ${
                    authSection === 'admin'? 'bg-red-500 text-white shadow-xl shadow-gray-400 transition-all animate-bounce' 
                    : 'bg-gray-100'
                }`
                }
                value={'admin'}
                onClick={() => setAuthSection('admin')}
            ><FaUserLock /></button>
        </div>
  )
}

export default AuthButtons
