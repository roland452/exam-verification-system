import React from 'react'
import Setup from './setUp'

const EditProfile = ({ section }) => {
  return (
    <div className={`absolute w-full min-h-screen transition-all duration-[.2s] ease ${section === 'edit'? 'translate-x-[0]' : 'translate-x-[120%]'} flex items-center justify-center p-0 font-sans`}>
      <Setup />
    </div>
  )
}

export default EditProfile
