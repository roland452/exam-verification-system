import React from 'react'
import VerificationModal from './verificationModal'

const Verification = ({ section }) => {
  return (
    <div className={`absolute w-full min-h-screen transition-all duration-[.2s] ease ${section === 'verification card'? 'translate-x-[0]' : 'translate-x-[120%]'} flex items-center justify-center p-0 font-sans`}>
      <VerificationModal />
    </div>
  )
}

export default Verification
