import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, } from 'framer-motion';
import { FiUsers, FiX, FiCheckCircle } from 'react-icons/fi';
import { TbFaceId } from "react-icons/tb"; 
import { GoUnverified } from "react-icons/go"; 
import StudentFaceVerify from './studentFaceVerify';
import useToast from '../../../../context/toast'
import { FaGraduationCap } from 'react-icons/fa';

const StudentList = ({isStudentModalOpen, selectedCourseStudents, setIsStudentModalOpen }) => {
    const setToast = useToast((state) => state.setToast)

    const [matric, setMatric] = useState('')
    const [step, setStep] = useState('')
    const [isCamOpen, setIsCamOpen] = useState(false)
    const [verifiedProfile, setIsVerifiedProfile] = useState([1,2])

    const setVerify = (studentMatric) => {
        setStep('verify')
        setMatric(studentMatric)
    }

    const handleOpenCam = () => {
        if(!matric) return setToast('matric number is required')
        setIsCamOpen(true)
    }

    const handleViewProfile = () => {
        if(verifiedProfile.length === 0) return setToast('something went wrong profile not found')
        setStep('profile')
    }

  return (
    <div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-md">
            
            {step === '' && (
                <AnimatePresence>
                {isStudentModalOpen && selectedCourseStudents && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsStudentModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/20 overflow-hidden max-h-[85vh] flex flex-col"
                    >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                        <h2 className="text-xl font-black text-slate-900">Verified Students</h2>
                        <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">
                            {selectedCourseStudents.code} • {selectedCourseStudents.verifiedStudents?.length || 0} Total
                        </p>
                        </div>
                        <button type="button" onClick={() => setIsStudentModalOpen(false)} className="p-2 bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"><FiX /></button>
                    </div>

                    <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 pr-2">
                        {selectedCourseStudents.verifiedStudents && selectedCourseStudents.verifiedStudents.length > 0 ? (
                        selectedCourseStudents.verifiedStudents.map((matric, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-green-500/30 transition-all">
                            <div className="flex items-center gap-3" onClick={() => setVerify(matric)}>
                                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-green-500">
                                {index + 1}
                                </div>
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{matric}</span>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            </div>
                        ))
                        ) : (
                        <div className="text-center py-10">
                            <FiUsers size={30} className="mx-auto text-slate-200 mb-2" />
                            <p className="text-[10px] font-black text-slate-400 uppercase">No students verified yet</p>
                        </div>
                        )}
                    </div>

                    <button onClick={() => setIsStudentModalOpen(false)} className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 transition-all">
                        Close Registry
                    </button>
                    </motion.div>
                </div>
                )}
                </AnimatePresence>
            )}

            {step === 'verify' && (
                
                <motion.div key="scan" className='p-5' initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    {
                    isCamOpen? 
                    <StudentFaceVerify 
                        setIsCamOpen={setIsCamOpen} 
                        setStep={setStep} 
                        matric={matric} 
                        setMatric={setMatric} 
                        setIsVerifiedProfile={setIsVerifiedProfile}
                    /> : ''
                    }
                    <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-green-400 mx-auto mb-6 relative overflow-hidden">
                        <TbFaceId size={48} />
                        <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }} 
                            transition={{ repeat: Infinity, duration: 2 }} 
                            className="absolute w-full h-1 bg-green-400/50 blur-[2px] left-0" 
                        />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Verify Student</h3>
                    <p className="text-xs text-slate-400 mt-2 mb-8">Verify Student Identity</p>
                    <button 
                        onClick={() => handleOpenCam()}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-600/20"
                    >
                        Open Camera
                    </button>
                </motion.div>
            )}



            {step === 'success' && (
                <div className="text-center p-5">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Granted</h3>
                    <p className="text-xs text-slate-400 mt-2 mb-8">Identity and Location Verified</p>
                    {
                      verifiedProfile.length === 0?  
                      <button 
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest"
                        onClick={() => handleViewProfile()}
                      >View Student Profile</button>: 
                      ''
                    }
                </div>
            )}



            {step === 'profile' && verifiedProfile.length !== 0 && (
                <div className="text-center p-5">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaGraduationCap size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Granted</h3>
                    <div className='flex flex-col gap-4 mt-5'>
                        <div className='flex justify-between align-center'> <strong>FullName:</strong> <span className=''> {verifiedProfile.fullname} </span>  </div>
                        <div className='flex justify-between align-center'> <strong>Matric:</strong> <span className=''> {verifiedProfile.matric} </span>  </div>
                        <div className='flex justify-between align-center'> <strong>Department:</strong> <span className=''> {verifiedProfile.department} </span>  </div>
                        <div className='flex justify-between align-center'> <strong>Level:</strong> <span className=''> {verifiedProfile.level}L </span>  </div>
                    </div>
                   <p className="text-xs text-slate-400 mt-2 mb-8">Identity and Location Verified</p>
                </div>
            )}


           

            {step === 'failed' && (
                <div className="text-center p-5">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GoUnverified size={32}/>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Denied</h3>
                    <p className="text-xs text-slate-400 mt-2 mb-8">Identity Unverified</p>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Retry</button>
                </div>
            )}
            
        </motion.div>
      
    </div>
  )
}

export default StudentList
