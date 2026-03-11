import { MdOutlineEditNote } from "react-icons/md"; 
import { FaGraduationCap } from "react-icons/fa"; 
import React from 'react'
import { FaUserShield, FaFingerprint, FaArrowLeft, FaBell } from 'react-icons/fa'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import { VscHistory } from 'react-icons/vsc'
import useAdminContext from '../adminContext'
import axios from 'axios'
import useRefresh from "../../../context/refresh";
import useToast from "../../../context/toast";
import KasuIcon from '../../../../src/assets/kasu_icon.png'

const NavBtn = () => {

 
  const buttons = [
    { section: 'course', icon: <FaGraduationCap />, label: 'Course/Exam' },
    { section: 'notice', icon: <FaBell />, label: 'Create Notice' },

  ]

  const navActive = useAdminContext((state) => state.navActive)
   const setNavActive = useAdminContext((state) => state.setNavActive)
  const section = useAdminContext((state) => state.adminSection)
  const setSection = useAdminContext((state) => state.setAdminSection)
  const setToast = useToast((state) => state.setToast)
  const refresh = useRefresh((state) => state.refresh)
  const setRefresh = useRefresh((state) => state.setRefresh)
    
   
  
    async function logOut() {
      setToast('logging out....')
      const res = await axios.post('/api/admin/logout',
      { },
      {
        withCredentials: true
      })
      
      setTimeout(() => { setRefresh(!refresh) },2000)

      setToast(res.data.message)
    }
  

  return (
    <div 
        className={`
            bg-[#063b21] text-white
            flex flex-col gap-2 p-6 fixed top-0 bottom-0 w-[280px]
            ${navActive ? 'left-0' : 'left-[-300px]'} 
            md:relative md:left-0 z-50 
            transition-all duration-500 ease-in-out border-r border-white/10
        `}
    >
      <FaArrowLeft className='absolute top-5 left-3 cursor-pointer md:hidden' onClick={() => setNavActive(!navActive)}/>
      {/* KASU Logo & Brand */}
      <div className='flex flex-col items-center mb-10 mt-4'>
        <div className="bg-white p-3 rounded-2xl shadow-xl mb-4">
            <img 
                className='w-16 h-16 object-contain'
                src={KasuIcon}
                alt="KASU Logo" 
            />
        </div>
        <p className='font-black text-sm uppercase tracking-widest text-green-400'>ADMIN DASHBOARD</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3">
        {buttons.map((x, i) => {
            const isActive = section === x.section;
            return (
                <div 
                    key={i}
                    onClick={() => setSection(x.section)}
                    className={`
                        flex gap-4 items-center h-14 px-5 rounded-2xl cursor-pointer 
                        transition-all duration-300 group
                        ${isActive 
                            ? 'bg-white text-green-900 shadow-lg shadow-black/20 scale-[1.02]' 
                            : 'hover:bg-white/10 text-green-100'}
                    `}
                >
                    <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`}>
                        {x.icon}
                    </span>
                    <span className={`capitalize font-semibold tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                        {x.label || x.section}
                    </span>

                    {/* Active Indicator Dot */}
                    {isActive && <div className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse" />}
                </div>
            )
        })}
      </nav>

      {/* Footer Decoration */}
      <div className="mt-auto pb-4">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-[10px] text-green-400 uppercase font-bold mb-1">Session</p>
            <p className="text-xs font-medium">2025/2026 Academic</p>
        </div>
         <p className="text-[10px] text-center cursor-pointer text-green-400 uppercase font-bold m-3" onClick={() => logOut()}>Log Out</p>
      </div>
    </div>
  )
}

export default NavBtn
