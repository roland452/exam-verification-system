import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrash2, FiBookOpen, 
  FiUsers, FiMapPin, FiCalendar, 
  FiAlertCircle, 
} from 'react-icons/fi';

import LoaderAnimation from '../../../../../src/assets/loader';

const CourseGrid = ({loading, error, reload, filteredCourses, handleOpenStudentModal, handleDelete, handleOpenModal, submitting, }) => {
  return (
    <main className="flex-grow overflow-y-auto no-scrollbar p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-[3rem_2rem]">
          <AnimatePresence mode="popLayout">
            {loading ? <LoaderAnimation /> : error ? (
              <div className="flex flex-col place-self-center items-center justify-center h-64 mt-20 text-center absolute top-[30%]">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <FiAlertCircle size={30} />
                  </div>
                  <h3 className="font-bold text-slate-800">Connection Failed</h3>
                  <p className="text-xs text-slate-400 mb-6">We couldn't reach the exam servers.</p>
                  <button onClick={() => reload()} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl">Retry Connection</button>
              </div>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <motion.div key={course._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[1.5rem] p-5 hover:border-green-500/30 shadow-2xl hover:shadow-md transition-all relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter border ${course.status === 'ongoing' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {course.status}
                      </div>
                      <span className="text-[10px] font-black text-slate-300">#{course._id.slice(-4)}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-green-500 shrink-0">
                        <FiBookOpen size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-800 leading-none">{course.code}</h3>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{course.department}</p>
                      </div>
                    </div>
                    
                    <p className="text-[11px] font-bold text-slate-600 leading-snug mb-2">{course.title}</p>
                    <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-bold mb-4">
                      <div className="flex items-center gap-2"><FiMapPin size={10} className="text-green-500" /> {course.venue}</div>
                      <div className="flex items-center gap-2"><FiCalendar size={10} className="text-green-500" /> {course.examDate} at {course.examTime}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* VERIFIED STUDENTS TRIGGER */}
                    <div 
                      onClick={() => handleOpenStudentModal(course)}
                      className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 px-4 border border-slate-100 cursor-pointer hover:bg-green-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                          <FiUsers size={12} className="text-green-500 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-black text-slate-400 uppercase">View Verified</span>
                      </div>
                      <span className="text-sm font-black text-slate-800">{course.verifiedStudents?.length || 0}</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(course)} className="flex-grow py-2.5 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-sm">Configure</button>
                      <button onClick={() => handleDelete(course._id)} className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                        {submitting ? <AiOutlineLoading3Quarters className='animate-spin' size={14}/> : <FiTrash2 size={14} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center opacity-40">
                <FiBookOpen size={40} className="text-slate-300" />
                <h2 className="text-slate-500 font-black uppercase tracking-widest text-xs mt-4">No courses found</h2>
              </div>
            )}
          </AnimatePresence>
        </div>
    </main>
  )
}

export default CourseGrid
