import React from 'react'
import { FaUserGraduate } from "react-icons/fa";
import { HiLockOpen } from 'react-icons/hi';

const SignupInput = ({ matric, setMatric, password, setPassword }) => {

  return (
    <div className="flex flex-col gap-3.5">

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

      <label className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl
                         bg-gray-50 ark:bg-white/[0.04]
                         border border-gray-200/70 ark:border-white/10
                         focus-within:border-green-900/40 ark:focus-within:border-emerald-400/40
                         focus-within:ring-4 focus-within:ring-green-900/10 ark:focus-within:ring-emerald-400/10
                         transition-all">
        <HiLockOpen className="text-gray-400 ark:text-gray-500 group-focus-within:text-green-900 ark:group-focus-within:text-emerald-400 transition-colors shrink-0" />
        <input
          className="bg-transparent outline-none w-full text-[15px] ark:text-white placeholder:text-gray-400 ark:placeholder:text-gray-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

    </div>
  )
}

export default SignupInput
