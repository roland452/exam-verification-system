import { AiOutlineLoading3Quarters } from "react-icons/ai"; 
import { RiLoader2Fill } from "react-icons/ri"; 
import React from 'react'

const LoaderAnimation = () => {
  return (

      <div className="fixed top-[50%] left-[50%] translate-[-50%]">
        <div className="animate-spin text-[40px] duration-[1s] delay-50"> <AiOutlineLoading3Quarters className="text-green-500"/> </div>
      </div>  
  )
}

export default LoaderAnimation
