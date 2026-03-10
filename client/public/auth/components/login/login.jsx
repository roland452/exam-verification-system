import React, { useState } from "react";
import { FaUserGraduate, FaSpinner } from "react-icons/fa";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbFaceId } from "react-icons/tb"; 
import { motion, AnimatePresence } from "framer-motion";
import useToast from "../../../context/toast";
import useLoginContext from "./context";

const LoginContent = ({ matric, setMatric, password, setPassword, handleSubmit, submitting }) => {
    const setToast = useToast((state) => state.setToast);
    const [loading, setLoading] = useState(false)
    const setLoginActiveSection = useLoginContext((state) => state.setLoginSection)


    return (
        <div className="flex flex-col gap-2">
            
            <div className="flex items-center">
                <FaUserGraduate className="text-slate-400" />
                <input className="px-1.5 py-2.5 outline-none border-b-1 border-b-gray-900 w-full" placeholder="Matric" value={matric} onChange={e => setMatric(e.target.value)} />
            </div>

            <div className="flex items-center">
                <RiLockPasswordFill className="text-slate-400" />
                <input className="px-1.5 py-2.5 outline-none border-b-1 border-b-gray-900 w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
        

            <button onClick={handleSubmit} className="w-full py-3 bg-green-500 text-white rounded-3xl font-bold shadow-lg shadow-green-100">
                {submitting ? <FaSpinner className="animate-spin mx-auto" /> : "Sign In"}
            </button>

            <div className="flex flex-col items-center gap-4 mt-6">
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">FaceId Access</span>
                
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="scanning"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="text-green-500 text-6xl"
                        >
                            <TbFaceId />
                        </motion.div>
                    ) : (
                        <motion.button
                            key="idle"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setLoginActiveSection('matric')}
                            className="text-slate-900 hover:text-green-500 transition-colors text-6xl"
                        >
                            <TbFaceId />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LoginContent;
