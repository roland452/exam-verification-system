import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit3, FiTrash2, FiPlus, FiBell, FiInfo, FiAlertCircle, FiX, FiCalendar, FiChevronDown, FiSend } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useToast from '../../../context/toast';
import LoaderAnimation from '../../../../src/assets/loader';
import ErrorMessage from '../../../../src/assets/error';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NoticeManager = ({ section }) => {


    const setToast = useToast((state) => state.setToast);
    const [refresh, setRefresh] = useState(false)
    const [loading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [submitting, setSubmitting] = useState(false)


  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ _id: null, title: "", action: "", type: "info" });

  // Dummy Data
  const [notices, setNotices] = useState([
    // { _id: "1", title: "Exam Reschedule", action: "Check Portal", type: "urgent", createdAt: "2024-05-20" },
    // { _id: "2", title: "Biometric Update", action: "Register Fingerprint", type: "info", createdAt: "2024-05-18" },
  ]);

  const API_URL = `${BASE_URL}/api/notices`;

  async function fetchNotices() {
      try {
        const res = await axios.get(API_URL, { withCredentials: true });
        // The backend returns the array directly
        setNotices(res.data || []);
        setRefresh(!refresh)
        setIsLoading(false)
        setError(false)
      } catch (error) {
        console.error(error);
        setIsLoading(false)
        setError(true)
        setToast('failed to fetch Notices');
      }
    }
  
    useEffect(() => {
      fetchNotices();
    },[refresh]);
  

  // --- HANDLERS ---
  const handleOpenModal = (notice = null) => {
    if (notice) {
      setFormData({ _id: notice._id, title: notice.title, action: notice.action, type: notice.type });
    } else {
      setFormData({ _id: null, title: "", action: "", type: "info" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast('updating.... notices')
    setSubmitting(true)
    try {

      if (formData._id) {
        // UPDATE ROUTE
        await axios.put(`${API_URL}/${formData._id}`, formData);
        console.log("Updating ID:", formData._id);
        setToast('updated successfully')
        setSubmitting(false)

      } else {
        // CREATE ROUTE
        await axios.post(API_URL, formData);
        console.log("Creating new notice");
        setToast('created notices')
        setSubmitting(false)
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("API Error (using dummy logic for now)");
      setSubmitting(false)
      setIsModalOpen(false); // Closing anyway for demo
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this notice?")) {
       setToast('deleting.... notices')
       setSubmitting(true)
      try {

        await axios.delete(`${API_URL}/${id}`);
        setNotices(notices.filter(n => n._id !== id));
        setToast('notice deleted')
        setSubmitting(false)

      } catch (err) { 

        console.log("Delete failed");  
        setToast('failed to delete notices')
        setSubmitting(false)
      }
    }
  };

  const reload = () => {
    setIsLoading(true)
    setRefresh(!refresh)
  }

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`absolute w-full min-h-screen transition-all duration-[.2s] ease-in-out ${section === 'notice'? 'translate-x-[0]' : 'translate-x-[120%]'} h-screen w-full bg-[#f4f7f5] flex flex-col overflow-hidden font-sans`}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* --- COMPACT HEADER --- */}
      <header className="flex-none bg-white border-b-2 border-green-500 px-6 py-4 shadow-sm z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-green-500"><FiBell size={20}/></div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Broadcasts</h1>
          </div>
          <div className="flex gap-2">
            <motion.div animate={{ width: searchActive ? 200 : 40 }} className="h-10 bg-slate-100 rounded-xl flex items-center overflow-hidden">
                <button onClick={() => setSearchActive(!searchActive)} className="w-10 h-10 flex-none flex items-center justify-center text-slate-400"><FiSearch size={16}/></button>
                <input type="text" placeholder="Search..." className="bg-transparent outline-none text-xs font-bold w-full" onChange={(e) => setSearchTerm(e.target.value)} />
            </motion.div>
            <button onClick={() => handleOpenModal()} className="h-10 px-4 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                <FiPlus /> New Notice
            </button>
          </div>
        </div>
      </header>

      {/* --- LIST AREA --- */}
      <main className="flex-grow overflow-y-auto no-scrollbar p-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {
            loading? (
              <LoaderAnimation />
            ):
            error? (
              <div>
                <div className="flex flex-col items-center justify-center h-64 mt-20 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <FiAlertCircle size={30} />
                    </div>
                    <h3 className="font-bold text-slate-800">Connection Failed</h3>
                    <p className="text-xs text-slate-400 mb-6">We couldn't reach the exam servers.</p>
                    <button onClick={() => reload()} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl">Retry Connection</button>
                </div>
              </div>
            ):
            filteredNotices.map((n) => (
              <motion.div key={n._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:border-green-500/30 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${n.type === 'urgent' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {n.type === 'urgent' ? <FiAlertCircle /> : <FiInfo />}
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-black text-slate-800">{n.title}</h4>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">{n.action}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(n)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-green-600 transition-all"><FiEdit3 size={14}/></button>
                  <button onClick={() => handleDelete(n._id)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                    { submitting ? <AiOutlineLoading3Quarters className='animate-spin' size={14}/> : <FiTrash2 size={14}/> }
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- INPUT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900">{formData._id ? "Edit Notice" : "New Broadcast"}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-xl"><FiX /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" placeholder="e.g. Exam Start Time" required />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Action Text</label>
                  <input value={formData.action} onChange={e => setFormData({...formData, action: e.target.value})} type="text" className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-green-500" placeholder="e.g. Check Hall Assignment" required />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Notice Style</label>
                  <div className="relative mt-1.5">
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none focus:border-green-500">
                        <option value="info">Info (Green Icon)</option>
                        <option value="urgent">Urgent (Red Icon)</option>
                        <option value="update">Update (Blue Icon)</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:bg-slate-900 transition-all">
                  <FiSend /> { submitting ? <AiOutlineLoading3Quarters className='animate-spin' size={14}/> : formData._id ? "Update Broadcast" : "Post to Students"}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticeManager;
