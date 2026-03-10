import { GoUnverified } from "react-icons/go"; 
import React, { useState, useEffect } from 'react';
import { TbFaceId } from "react-icons/tb"; 
import { FiMapPin, FiCheckCircle, FiX, FiNavigation, FiTarget, FiActivity } from 'react-icons/fi';
import { MdFingerprint } from 'react-icons/md'; 
import { motion, AnimatePresence } from 'framer-motion';
import useOngoingExam from '../../../../context/ongoingExam';
import axios from 'axios'
import useToast from '../../../../context/toast'
import FaceVerify from "./verifyFace";
import useProfile from '../../../../context/profile'

const getDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371e3; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
};

const VerificationModal = ({ onClose }) => {

  const setToast = useToast((state) => state.setToast)

  const ongoingExam = useOngoingExam((state) => state.exam)

  const student = { name: "", matric: "" };

  
  const exam = { 
    code: ongoingExam.code, 
    venue: ongoingExam.venue, 
    coords: { 
      lat: ongoingExam.lat || 10.564891 , 
      lng: ongoingExam.lng || 7.470829
    } 
  };
  const examId = ongoingExam._id

  

  const [step, setStep] = useState('location');
  const [faceActive, setFaceActive] = useState(false);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        console.log('lg:',pos.coords.longitude, ' ', 'lt:',pos.coords.latitude);
        
        const d = getDistance(pos.coords.latitude, pos.coords.longitude, exam.coords.lat, exam.coords.lng);
        setDistance(Math.round(d));
        setIsWithinRange(d < 50); 
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);





  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* Top Status Bar */}
        <div className="px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Active</span>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600"><FiX /></button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'location' && (
              <motion.div key="loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* MODERN RADAR UI */}
                <div className="relative w-48 h-48 mx-auto mb-8 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden">
                   {/* Scanning Beam */}
                   <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-500/10" 
                   />
                   
                   {/* Hall Target */}
                   <div className="relative z-10 p-4 bg-white rounded-2xl shadow-lg border border-slate-50">
                      <FiTarget size={32} className={isWithinRange ? "text-green-600" : "text-green-500"} />
                   </div>

                   {/* Distance Rings */}
                   <div className="absolute w-32 h-32 border border-slate-200/50 rounded-full" />
                   <div className="absolute w-20 h-20 border border-slate-200/50 rounded-full" />
                </div>

                <div className="space-y-1 mb-8">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Geofence Check</h3>
                    <p className="text-xs text-slate-400 font-medium">Distance to Hall: 
                        <span className="text-green-500 ml-1 font-bold">{distance !== null ? `${distance}m` : 'Scanning...'}</span>
                    </p>
                </div>

                {/* PROXIMITY BAR */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isWithinRange ? '100%' : '15%' }}
                        className={`h-full transition-all ${isWithinRange ? 'bg-green-500' : 'bg-green-500'}`}
                    />
                </div>

                <button 
                  disabled={ongoingExam.status !== 'ongoing' || !isWithinRange}
                  onClick={() => setStep('scan')}
                  className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all
                  ${isWithinRange ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-slate-100 text-slate-300'}`}
                >
                  {ongoingExam.status !== 'ongoing'? 'No Ongoing Exam ' : isWithinRange ? 'Unlock FaceId' : 'Enter Exam Hall Area'}
                </button>
              </motion.div>
            )}

            {step === 'scan' && (
            
              <motion.div key="scan" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                {
                  faceActive? <FaceVerify setStep={setStep} setFaceActive={setFaceActive} examId={examId} /> : ''
                }
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-green-400 mx-auto mb-6 relative overflow-hidden">
                    <TbFaceId size={48} />
                    <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }} 
                        transition={{ repeat: Infinity, duration: 2 }} 
                        className="absolute w-full h-1 bg-green-400/50 blur-[2px] left-0" 
                    />
                </div>
                <h3 className="text-xl font-black text-slate-800">Verify Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 mb-10 tracking-widest">{student.name}</p>
                <button 
                    onClick={() => setFaceActive(!faceActive)}
                    className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-600/20"
                >
                  Verify
                </button>
              </motion.div>
            )}

            {step === 'success' && (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Granted</h3>
                    <p className="text-xs text-slate-400 mt-2 mb-8">Identity and Location Verified</p>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Open Examination</button>
                </div>
            )}

            {step === 'failed' && (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GoUnverified size={32}/>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Denied</h3>
                    <p className="text-xs text-slate-400 mt-2 mb-8">Identity Unverified</p>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Retry</button>
                </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationModal;
