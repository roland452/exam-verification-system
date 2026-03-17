import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiEdit2, FiTrash2, FiPlus, FiBookOpen, 
  FiUsers, FiActivity, FiX, FiMapPin, FiCalendar, 
  FiAlertCircle, FiClock, FiChevronDown 
} from 'react-icons/fi';


const ConfigModal = ({ isModalOpen, departments, formData, handleSubmit, setIsModalOpen, setFormData, submitting}) => {
  return (
    <div>
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

                <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Department</label>
                    <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full mt-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none focus:border-green-500" required>
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
  )
}

export default ConfigModal
