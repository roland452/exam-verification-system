import { FiWifiOff } from "react-icons/fi"; 
import React from 'react'

const ErrorMessage = () => {
  return (
    <div class="fixed top-[50%] left-[50%] translate-[-50%]">
      <FiWifiOff className="text-[120px] text-[#d4cece] dark:text-[#1c1b1b] animate-pulse"/>
    </div>
  )
}

export default ErrorMessage
