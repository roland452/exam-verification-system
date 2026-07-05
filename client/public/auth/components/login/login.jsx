import React, { useState } from "react";
import { FaUserGraduate, FaSpinner } from "react-icons/fa";
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
                    placeholder="Matric number"
                    value={matric}
                    onChange={e => setMatric(e.target.value)}
                />
            </label>

            <label className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl
                               bg-gray-50 ark:bg-white/[0.04]
                               border border-gray-200/70 ark:border-white/10
                               focus-within:border-green-900/40 ark:focus-within:border-emerald-400/40
                               focus-within:ring-4 focus-within:ring-green-900/10 ark:focus-within:ring-emerald-400/10
                               transition-all">
                <RiLockPasswordFill className="text-gray-400 ark:text-gray-500 group-focus-within:text-green-900 ark:group-focus-within:text-emerald-400 transition-colors shrink-0" />
                <input
                    className="bg-transparent outline-none w-full text-[15px] ark:text-white placeholder:text-gray-400 ark:placeholder:text-gray-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </label>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3.5 mt-1 bg-green-900 text-white rounded-full font-semibold
                           shadow-lg shadow-green-900/25 hover:shadow-xl hover:shadow-green-900/30
                           transition-all active:scale-95 disabled:opacity-60
                           flex items-center justify-center gap-2"
            >
                {submitting ? <FaSpinner className="animate-spin" /> : "Sign in"}
            </button>

            <div className="flex flex-col items-center gap-3 mt-5">
                <div className="flex items-center gap-3 w-full">
                    <div className="h-px flex-1 bg-gray-200 ark:bg-white/10" />
                    <span className="text-[10px] font-bold uppercase text-gray-400 ark:text-gray-500 tracking-widest">or use Face ID</span>
                    <div className="h-px flex-1 bg-gray-200 ark:bg-white/10" />
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="scanning"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="text-green-900 ark:text-emerald-400 text-5xl mt-1"
                        >
                            <TbFaceId />
                        </motion.div>
                    ) : (
                        <motion.button
                            key="idle"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setLoginActiveSection('matric')}
                            className="w-16 h-16 rounded-full flex items-center justify-center mt-1
                                       bg-green-900/5 ark:bg-emerald-400/10
                                       text-green-900 ark:text-emerald-400
                                       ring-1 ring-green-900/15 ark:ring-emerald-400/20
                                       hover:ring-green-900/30 ark:hover:ring-emerald-400/40
                                       transition-all text-3xl"
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
