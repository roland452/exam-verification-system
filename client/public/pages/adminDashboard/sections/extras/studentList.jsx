import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiX, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { TbFaceId } from "react-icons/tb"; 
import { GoUnverified } from "react-icons/go"; 
import StudentFaceVerify from './studentFaceVerify';
import useToast from '../../../../context/toast';
import { FaGraduationCap } from 'react-icons/fa';

const StudentList = ({ isStudentModalOpen, selectedCourseStudents, setIsStudentModalOpen }) => {
    const setToast = useToast((state) => state.setToast);

    const [matric, setMatric] = useState('');
    // CHANGE 1: Set default step to 'list' so the matric numbers show up first
    const [step, setStep] = useState('list'); 
    const [isCamOpen, setIsCamOpen] = useState(false);
    const [verifiedProfile, setIsVerifiedProfile] = useState(null);

    // Reset state when modal closes/opens
    useEffect(() => {
        if (!isStudentModalOpen) {
            setStep('list');
            setMatric('');
            setIsCamOpen(false);
        }
    }, [isStudentModalOpen]);

    const setVerify = (studentMatric) => {
        setMatric(studentMatric);
        setStep('verify');
    };

    const handleOpenCam = () => {
        if (!matric) return setToast('Matric number is required');
        setIsCamOpen(true);
    };

    return (
        <AnimatePresence>
            {isStudentModalOpen && selectedCourseStudents && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setIsStudentModalOpen(false)} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/20 overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Header with Back Button logic */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                {step !== 'list' && (
                                    <button 
                                        onClick={() => setStep('list')}
                                        className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <FiArrowLeft />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">
                                        {step === 'list' ? "Verified Students" : "Verification"}
                                    </h2>
                                    {step === 'list' && (
                                        <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">
                                            {selectedCourseStudents.code} • {selectedCourseStudents.verifiedStudents?.length || 0} Total
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button type="button" onClick={() => setIsStudentModalOpen(false)} className="p-2 bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                <FiX />
                            </button>
                        </div>

                        {/* --- STEP 1: MATRIC LIST --- */}
                        {step === 'list' && (
                            <>
                                <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 pr-2">
                                    {selectedCourseStudents.verifiedStudents && selectedCourseStudents.verifiedStudents.length > 0 ? (
                                        selectedCourseStudents.verifiedStudents.map((m, index) => (
                                            <div 
                                                key={index} 
                                                onClick={() => setVerify(m)}
                                                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-green-500/30 cursor-pointer transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-green-500">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{m}</span>
                                                </div>
                                                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] group-hover:scale-150 transition-transform" />
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
                            </>
                        )}

                        {/* --- STEP 2: VERIFY/SCAN --- */}
                        {step === 'verify' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                {isCamOpen ? (
                                    <StudentFaceVerify 
                                        setIsCamOpen={setIsCamOpen} 
                                        setStep={setStep} 
                                        matric={matric} 
                                        setMatric={setMatric} 
                                        setIsVerifiedProfile={setIsVerifiedProfile}
                                    />
                                ) : (
                                    <div className="py-4">
                                        <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-green-400 mx-auto mb-6 relative overflow-hidden">
                                            <TbFaceId size={48} />
                                            <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-full h-1 bg-green-400/50 blur-[2px] left-0" />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Confirm Identity</h3>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest mb-8">Matric: {matric}</p>
                                        <button onClick={handleOpenCam} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-green-600/20">
                                            Start Face Scan
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* --- STEP 3: SUCCESS/PROFILE --- */}
                        {(step === 'success' || step === 'profile') && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Verified</h3>
                                
                                {verifiedProfile ? (
                                    <div className='flex flex-col gap-3 mt-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100'>
                                        <div className='flex justify-between items-center text-[10px]'> 
                                            <strong className="uppercase text-slate-400">FullName</strong> 
                                            <span className='font-black text-slate-800 uppercase'> {verifiedProfile.fullname} </span>  
                                        </div>
                                        <div className='flex justify-between items-center text-[10px]'> 
                                            <strong className="uppercase text-slate-400">Matric</strong> 
                                            <span className='font-black text-slate-800'> {verifiedProfile.matric} </span>  
                                        </div>
                                        <div className='flex justify-between items-center text-[10px]'> 
                                            <strong className="uppercase text-slate-400">Dept</strong> 
                                            <span className='font-black text-slate-800 uppercase'> {verifiedProfile.department} </span>  
                                        </div>
                                        <div className='flex justify-between items-center text-[10px]'> 
                                            <strong className="uppercase text-slate-400">Level</strong> 
                                            <span className='font-black text-slate-800'> {verifiedProfile.level}L </span>  
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-2 mb-8 uppercase font-bold tracking-widest">Processing Profile...</p>
                                )}
                                
                                <button onClick={() => setStep('list')} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">
                                    Return to Registry
                                </button>
                            </motion.div>
                        )}

                        {/* --- STEP 4: FAILED --- */}
                        {step === 'failed' && (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GoUnverified size={32}/>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Access Denied</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-2 mb-8 uppercase tracking-widest">Identity Unverified</p>
                                <button onClick={() => setStep('list')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">
                                    Retry Selection
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StudentList;
