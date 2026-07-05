import React from 'react'
import { FaUserAlt, FaUserLock } from "react-icons/fa";
import { BiLogInCircle } from "react-icons/bi";

const TABS = [
  { key: 'login', label: 'Login', icon: BiLogInCircle },
  { key: 'signup', label: 'Sign up', icon: FaUserAlt },
  { key: 'admin', label: 'Admin', icon: FaUserLock },
];

const AuthButtons = ({ authSection, setAuthSection }) => {
  return (
    <div className="place-self-center flex items-center gap-1 my-5
                     bg-gray-100 ark:bg-white/[0.05] rounded-full p-1
                     border border-gray-200/60 ark:border-white/10">
      {TABS.map(({ key, label, icon: Icon }) => {
        const active = authSection === key
        const isAdmin = key === 'admin'

        return (
          <button
            key={key}
            onClick={() => setAuthSection(key)}
            className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full
                        text-sm font-semibold cursor-pointer transition-all duration-300
                        ${active
                          ? isAdmin
                            ? 'bg-green-400 text-white shadow-lg shadow-green-500/25'
                            : 'bg-green-900 text-white shadow-lg shadow-green-900/25'
                          : 'text-gray-500 ark:text-gray-400 hover:text-gray-700 ark:hover:text-gray-200 hover:bg-white/60 ark:hover:bg-white/5'
                        }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default AuthButtons
