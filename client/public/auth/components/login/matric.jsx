import React from 'react'
import { useState } from 'react';
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
    if (!matric) return setToast('Matric cannot be empty')
    setSubmitting(true)
    setTimeout(() => {
      setLoginActiveSection('')
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4">

      <p className="text-center text-sm text-gray-400 ark:text-gray-500">
        Enter your matric number to open facial verification
      </p>

      <label className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl
                         bg-gray-50 ark:bg-white/[0.04]
                         border border-gray-200/70 ark:border-white/10
                         focus-within:border-green-900/40 ark:focus-within:border-emerald-400/40
                         focus-within:ring-4 focus-within:ring-green-900/10 ark:focus-within:ring-emerald-400/10
                         transition-all">
        <FaUserGraduate className="text-gray-400 ark:text-gray-500 group-focus-within:text-green-900 ark:group-focus-within:text-emerald-400 transition-colors shrink-0" />
        <input
          className="bg-transparent outline-none w-full text-[15px] ark:text-white placeholder:text-gray-400 ark:placeholder:text-gray-500"
          type="text"
          placeholder="Matric number"
          value={matric}
          onChange={(e) => setMatric(e.target.value)}
        />
      </label>

      <button
        className="w-full py-3.5 bg-green-900 rounded-full cursor-pointer text-white font-semibold
                   shadow-lg shadow-green-900/25 hover:shadow-xl hover:shadow-green-900/30
                   transition-all active:scale-95 disabled:opacity-60
                   flex items-center justify-center gap-2"
        onClick={() => submitMatric()}
        disabled={submitting}
      >
        {submitting ? 'Loading...' : <><TbFaceId size={20} /> Continue to Face ID</>}
      </button>

      <button
        className="font-semibold text-sm text-gray-500 ark:text-gray-400 hover:text-green-900 ark:hover:text-emerald-400 transition-colors underline decoration-1 underline-offset-2"
        onClick={() => setLoginActiveSection('login')}
      >
        Login with password instead
      </button>
    </div>
  )
}

export default Matric
