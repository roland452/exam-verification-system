import React, { useRef, useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiChevronRight, FiChevronLeft, FiCheck, FiUser, FiAlertCircle, FiInbox } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AutoActivityFlipper from './autoActivityFlipper';
import axios from 'axios';
import useProfile from '../../../../context/profile';
import useOngoingExam from '../../../../context/ongoingExam';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PortalStatus = () => {

  const setOngoingExam = useOngoingExam((state) => state.setExam)
  const scrollRef = useRef(null);
  const user = useProfile((state) => state.profile);
  
  const [courses, setCourses] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const API_URL = `${BASE_URL}/api/student-courses`;

  async function fetchCourses() {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      setCourses(res.data || []);
      const exams = res.data || []

      const ongoingExams = exams.find((x) => x.status === 'ongoing')
      setOngoingExam(ongoingExams || {})      
      
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- PROGRESS LOGIC ---
  const journeyCourses = courses.filter(c => c.status === 'completed' || c.status === 'ongoing').slice(0, 3);
  const completedCount = journeyCourses.filter(c => c.status === 'completed').length;
  const progressPercentage = journeyCourses.length > 0 ? (completedCount / journeyCourses.length) * 100 : 0;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full bg-[#fdfdfd] flex flex-col overflow-hidden text-slate-900 font-sans">
      
      {/* 1. FIXED HEADER */}
      <header className="flex items-center gap-4 p-4 md:p-6 shrink-0 bg-[#fdfdfd] z-20 border-b border-slate-50">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-green-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20">
          <FiUser size={24} />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black tracking-tight">{user.fullName || "Student"}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {user.matric} <span className="mx-2 text-slate-200">|</span> {user.course} <span className="mx-2 text-slate-200">|</span> {user.level}L
          </p>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-10 no-scrollbar">
        
        {/* Loader State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 mt-20">
            <AiOutlineLoading3Quarters className="animate-spin text-green-500 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Synchronizing Portal...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center h-64 mt-20 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle size={30} />
            </div>
            <h3 className="font-bold text-slate-800">Connection Failed</h3>
            <p className="text-xs text-slate-400 mb-6">We couldn't reach the exam servers.</p>
            <button onClick={fetchCourses} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl">Retry Connection</button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <AutoActivityFlipper />
            </div>

            {/* DYNAMIC PROGRESS TRACKER */}
            <section className="mb-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Exam Journey</h2>
              <div className="relative bg-slate-50 h-24 rounded-[2rem] p-4 flex items-center justify-between border border-slate-100 shadow-inner">
                {/* Background Line */}
                <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full">
                   <div 
                    className="h-full bg-green-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    style={{ width: `${progressPercentage}%` }}
                   ></div>
                </div>
                
                {journeyCourses.length > 0 ? (
                  journeyCourses.map((course) => {
                    const isDone = course.status === 'completed';
                    const isLive = course.status === 'ongoing';
                    
                    return (
                      <div key={course._id} className="relative z-10 flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl
                          ${isDone ? 'bg-green-500 text-white' : isLive ? 'bg-white text-green-900 scale-110 ring-4 ring-green-500/10' : 'bg-slate-100 text-slate-400'}
                        `}>
                          {isDone ? <FiCheck size={18} /> : <span className="text-[10px] font-black">{course.code.split(' ')[1] || "..."}</span>}
                        </div>
                        <div className={`absolute -bottom-8 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-sm
                          ${isDone ? 'bg-green-100 text-green-700' : isLive ? 'bg-green-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {course.status}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">No active journey data</div>
                )}
              </div>
            </section>

            {/* EXAM GALLERY */}
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Available Courses</h2>
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"><FiChevronLeft /></button>
                <button onClick={() => scroll('right')} className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800"><FiChevronRight /></button>
              </div>
            </div>

            {/* Empty State Handler */}
            {courses.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                  <FiInbox size={30} />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Courses Registered</h3>
                <p className="text-[10px] text-slate-300 mt-1 uppercase font-black">Contact your department for course allocation</p>
              </div>
            ) : (
              <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x"
              >
                {courses.map((exam) => {
                    const statusColors = exam.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                    return (
                        <div key={exam._id} className="min-w-[320px] snap-start bg-white rounded-[1.5rem] p-5 shadow-xl border-[#f2eaea] border-1 flex flex-col justify-between group hover:border-[#e7e4e4] hover:border-green-100 transition-all duration-300 relative">
                            <span className="text-[10px] font-bold text-slate-300 absolute top-4 right-5">{exam.level}L</span>
                            <div>
                                <div className="flex justify-between items-center mb-5">
                                    <span className={`text-[9px] font-extrabold px-3 py-1.5 rounded-lg tracking-wider uppercase ${statusColors}`}>{exam.status}</span>
                                </div>
                                <div className="flex gap-3 items-center mb-6">
                                    <div className="w-12 h-12 bg-slate-900 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                                        <h4 className="">{exam.code.split(' ')[1]}</h4>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-green-900 transition-colors">{exam.title}</h3>
                                        <p className="text-[9px] font-black text-slate-400 mt-0.5 uppercase tracking-widest">{exam.code}</p>
                                    </div>
                                </div>
                                <div className="space-y-3.5 mb-6">
                                    <div className="flex items-center gap-3.5 text-xs text-slate-500 font-bold">
                                        <FiMapPin className="text-green-600 shrink-0" size={14} /> {exam.venue}
                                    </div>
                                    <div className="flex items-center gap-3.5 text-xs text-slate-500 font-bold">
                                        <FiClock className="text-green-600 shrink-0" size={14} /> {new Date(exam.examDate).toDateString()} at {exam.examTime}
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-sm hover:shadow-green-900/10 active:shadow-inner bg-green-500 text-white hover:bg-green-600">
                                VIEW DETAILS
                            </button>
                        </div>
                    )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PortalStatus;
