import React from 'react'
import { useState } from "react";
import FaceEnroll from '../components/admin/faceEnroll';

const Admin = ({ authSection }) => {

 const [faceEnrollActive, setFaceEnrollActive] = useState(false)

  
    
  return (
    <div className={`${authSection === 'admin'? 'flex flex-col gap-4' : 'hidden'}`}>


      <FaceEnroll faceEnrollActive={faceEnrollActive} setFaceEnrollActive={setFaceEnrollActive} />

      <h1 className="py-2.5 text-center">
        <span className='text-[15px] text-black/50'> click to open facial verification </span>  
      </h1>
      
      <button 
        className="px-25.5 py-2.5 md:px-45.5 bg-red-500 rounded-4xl cursor-pointer text-[#ffffff] shadow-[0px_0px_15px_3px] ark:shadow-[#1a1a1a] shadow-[#a6a3a3]"
        onClick={() => setFaceEnrollActive(!faceEnrollActive)}
      > Verify faceId </button>
    </div>
  )
}

export default Admin
