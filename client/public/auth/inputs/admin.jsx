import React from 'react'
import { useState } from "react";
import { TbFaceId } from "react-icons/tb";
import FaceEnroll from '../components/admin/faceEnroll';

const Admin = ({ authSection }) => {

 const [faceEnrollActive, setFaceEnrollActive] = useState(false)

  return (
    <div className={`${authSection === 'admin'? 'flex flex-col items-center gap-4 w-full max-w-md mx-auto p-4' : 'hidden'}`}>

      <FaceEnroll faceEnrollActive={faceEnrollActive} setFaceEnrollActive={setFaceEnrollActive} />

      <p className="text-center text-sm text-gray-400 ark:text-gray-500">
        Tap below to open facial verification
      </p>

      <button
        className="w-full py-3.5 rounded-full cursor-pointer font-semibold
                  bg-green-400 text-white shadow-lg shadow-green-500/25
                   flex items-center justify-center gap-2
                   transition-all active:scale-95"
        onClick={() => setFaceEnrollActive(!faceEnrollActive)}
      >
      Get Access 
      </button>
    </div>
  )
}

export default Admin
