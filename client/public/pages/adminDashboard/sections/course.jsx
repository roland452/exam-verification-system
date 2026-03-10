import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiBookOpen, FiUsers, FiActivity, FiX, FiMapPin, FiCalendar, FiAlertCircle, FiClock } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useToast from '../../../context/toast.js';
import LoaderAnimation from '../../../../src/assets/loader.jsx';
import ErrorMessage from '../../../../src/assets/error.jsx';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Courses = ({ section }) => {
  const setToast = useToast((state) => state.setToast);
  const [refresh, setRefresh] = useState(false)
  const [loading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeDept, setActiveDept] = useState("All"); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    _id: null, code: "", title: "", level: "100", status: "pending", 
    venue: "", lat: "", lng: "", department: "Computer Science", examDate: "", examTime: "" 
  });

  const [courses, setCourses] = useState([]);
  const API_URL = `${BASE_URL}/api/courses`;

  // List of departments for consistency between filters and the dropdown
  const departments = ["Computer Science", "Mathematics", "Cyber Security", "Software Engineering"];

  async function fetchCourses() {
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      setCourses(res.data || []);
      setIsLoading(false)
      setError(false)
    } catch (error) {
      console.error(error);
      setIsLoading(false)
      setError(true)
      setToast('failed to fetch courses');
    }
  }

  useEffect(() => {
    fetchCourses();
  },[refresh]);

  const handleOpenModal = (course = null) => {
    if (course) {
      setFormData({ ...course });
    } else {
      setFormData({ 
        _id: null, code: "", title: "", level: "100", status: "pending", 
        venue: "", lat: "", lng: "", department: "Computer Science", examDate: "", examTime: "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    try {
      if (formData._id) {
        await axios.put(`${API_URL}/${formData._id}`, formData, { withCredentials: true });
        setToast('Course updated successfully');
      } else {
        await axios.post(API_URL, formData, { withCredentials: true });
        setToast('Course established successfully');
      }
      setRefresh(!refresh);
      setIsModalOpen(false);
    } catch (err) {
      setToast('Error processing request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this course?")) {
      setSubmitting(true)
      try {
        await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
        setToast('Course deleted');
        setRefresh(!refresh)
      } catch (err) {
        setToast('Delete failed');
      } finally {
        setSubmitting(false)
      }
    }
  };

  const reload = () => {
    setIsLoading(true)
    setRefresh(!refresh)
  }

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = activeLevel === "All" || c.level === activeLevel;
    const matchesDept = activeDept === "All" || c.department === activeDept; 
    return matchesSearch && matchesLevel && matchesDept; 
  });

  return (
    <div className={`absolute w-full min-h-screen transition-all duration-[.2s] ease-in-out ${section === 'course'? 'translate-x-[0]' : 'translate-x-[120%]'} h-screen w-full bg-[#f4f7f5] flex flex-col overflow-hidden font-sans `}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      <header className="flex-none bg-white border-b-2 border-green-500 px-6 py-4 shadow-sm z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                <FiActivity size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Exam Portal</h1>
              <p className="text-green-600 text-[9px] font-black uppercase tracking-widest">Admin Command</p>
            </div>
          </div>
          
          <div className="flex gap-2">
             <motion.div animate={{ width: searchActive ? 240 : 40 }} className="h-10 bg-slate-100 rounded-xl flex items-center overflow-hidden">
                <button onClick={() => setSearchActive(!searchActive)} className="w-10 h-10 flex-none flex items-center justify-center text-slate-500">
                    <FiSearch size={16} />
                </button>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent outline-none text-xs font-bold w-full pr-4 text-slate-800"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </motion.div>
             <button onClick={() => handleOpenModal()} className="h-10 px-4 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2">
                <FiPlus size={14} /> Add Course
             </button>
          </div>
        </div>
      </header>

      {/* FILTER NAVS */}
      <nav className="flex-none bg-slate-900 px-6 py-4 flex flex-col gap-3 border-b border-slate-800">
         <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {["All", "100", "200", "300", "400"].map(lvl => (
                <button key={lvl} onClick={() => setActiveLevel(lvl)} className={`px-5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeLevel === lvl ? 'bg-green-500 text-white' : 'text-slate-500 hover:text-white'}`}>
                    {lvl === "All" ? "All Levels" : `${lvl}L`}
                </button>
            ))}
         </div>
         <div className="flex gap-1 overflow-x-auto no-scrollbar border-t border-slate-800 pt-3">
            {["All", ...departments].map(dept => (
                <button key={dept} onClick={() => setActiveDept(dept)} className={`px-5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeDept === dept ? 'bg-green-500 text-white' : 'text-slate-500 hover:text-white'}`}>
                    {dept}
                </button>
            ))}
         </div>
      </nav>

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
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 px-4 border border-slate-100">
                      <div className="flex items-center gap-2">
                          <FiUsers size={12} className="text-green-500" />
                          <span className="text-[9px] font-black text-slate-400 uppercase">Verified</span>
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

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-white/20 overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900">{formData._id ? "Edit Course" : "New Course"}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"><FiX /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Code</label>
                  <input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} type="text" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500 uppercase" placeholder="CSC 305" required />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Level</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none focus:border-green-500">
                      {["100", "200", "300", "400"].map(l => <option key={l} value={l}>{l} Level</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" placeholder="Course Title" required />
                </div>

                {/* DEPARTMENT DROP DOWN */}
                <div className="col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Department</label>
                  <select 
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})} 
                    className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none focus:border-green-500"
                    required
                  >
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Exam Date</label>
                  <input value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} type="date" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" required />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Exam Time</label>
                  <input value={formData.examTime} onChange={e => setFormData({...formData, examTime: e.target.value})} type="time" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" required />
                </div>
                <div className="col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Venue Name</label>
                  <input value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} type="text" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" placeholder="Main Hall" required />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Latitude</label>
                  <input value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} type="number" step="any" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" placeholder="10.56" required />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Longitude</label>
                  <input value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} type="number" step="any" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" placeholder="7.47" required />
                </div>
                <div className="col-span-2 mb-4">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 text-green-600">Session Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full mt-1.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none focus:border-green-500 text-green-700">
                      <option value="pending">Pending</option>
                      <option value="ongoing">Ongoing (Live)</option>
                      <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:bg-slate-900 transition-all">
                { submitting ? <AiOutlineLoading3Quarters className='animate-spin' size={14}/> : formData._id ? "Save Configuration" : "Establish Course"}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;
