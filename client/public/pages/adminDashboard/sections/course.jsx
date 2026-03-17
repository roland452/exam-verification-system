import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiEdit2, FiTrash2, FiPlus, FiBookOpen, 
  FiUsers, FiActivity, FiX, FiMapPin, FiCalendar, 
  FiAlertCircle, FiClock, FiChevronDown 
} from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useToast from '../../../context/toast.js';
import LoaderAnimation from '../../../../src/assets/loader.jsx';
import ConfigModal from './extras/configModal.jsx';
import CourseGrid from './extras/courseGrid.jsx';
import StudentList from './extras/studentList.jsx';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Courses = ({ section }) => {
  const setToast = useToast((state) => state.setToast);
  
  // Logic States
  const [refresh, setRefresh] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // UI States
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeDept, setActiveDept] = useState("All"); 
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedCourseStudents, setSelectedCourseStudents] = useState(null);

  

  const [formData, setFormData] = useState({ 
    _id: null, code: "", title: "", level: "100", status: "pending", 
    venue: "", lat: "", lng: "", department: "Computer Science", examDate: "", examTime: "" 
  });

  const [courses, setCourses] = useState([]);
  const API_URL = `${BASE_URL}/api/courses`;

  const departments = ["Computer Science", "Mathematics", "Cyber Security", "Software Engineering"];

  async function fetchCourses() {
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      setCourses(res.data || []);
      setIsLoading(false);
      setError(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setError(true);
      setToast('failed to fetch courses');
    }
  }

  useEffect(() => {
    fetchCourses();
  }, [refresh]);

  // --- HANDLERS ---
  
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

  const handleOpenStudentModal = (course) => {
    setSelectedCourseStudents(course);
    setIsStudentModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
      setSubmitting(true);
      try {
        await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
        setToast('Course deleted');
        setRefresh(!refresh);
      } catch (err) {
        setToast('Delete failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const reload = () => {
    setIsLoading(true);
    setRefresh(!refresh);
  };

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

      {/* --- HEADER --- */}
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

      {/* --- FILTER NAVS --- */}
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

      {/* --- COURSE GRID --- */}
      <CourseGrid 
        loading={loading}
        error={error}
        reload={reload}
        filteredCourses={filteredCourses}
        handleOpenModal={handleOpenModal}
        handleOpenStudentModal={handleOpenStudentModal}
        handleDelete={handleDelete}
        submitting={submitting}
      />

      {/* --- CONFIGURATION MODAL --- */}
      <ConfigModal 
        isModalOpen={isModalOpen}
        departments={departments}
        formData={formData}
        handleSubmit={handleSubmit}
        setIsModalOpen={setIsModalOpen}
        setFormData={setFormData}
        submitting={submitting}
      />
      {/* --- STUDENT LIST MODAL --- */}
      <StudentList 
        isStudentModalOpen={isStudentModalOpen}
        selectedCourseStudents={selectedCourseStudents}
        setIsStudentModalOpen={setIsStudentModalOpen}
      />
  
    </div>
  );
};

export default Courses;

