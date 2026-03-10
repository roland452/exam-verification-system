import React from 'react'
import { useEffect } from 'react'
import useToast from '../../public/context/toast'

const Toast = () => {
  const toastValue = useToast((state) => state.toast)
  const setToast = useToast((state) => state.setToast)

  useEffect(() => {
    setTimeout(() => { setToast('') },2000)
  },[toastValue])
  return (
     <div className={`fixed flex
         items-center
         gap-3.5 
         place-content-center 
         left-[50%] right-[50%] translate-x-[-50%] bottom-8 px-2 py-3
         ${toastValue === 'login successful' || toastValue === 'signup successful' ? 'text-[#1dd81d]' : ''}
    
        bg-[#cac1c1e2]
        dark:bg-[#181717e7] 
        dark:text-[#7a7474]
        text-[#3e3a3a]
         rounded-2xl z-10 p-3.5 
    
    
         w-3xs
         transition-all
         duration-[.5s]
         text-[14px]
         
    
         ${toastValue === '' ? ' translate-y-30.5' : ' translate-y-0'}
    
         
        `}>
          {/* <BsFillExclamationCircleFill /> */}
          <> {toastValue}</>
          {/* <div 
            className="absolute right-5 top-2 text-2xl cursor-pointer text-[black]"
            onClick={() => setToast('')}
          ><HiXCircle /></div> */}
        </div>
  )
}

export default Toast
