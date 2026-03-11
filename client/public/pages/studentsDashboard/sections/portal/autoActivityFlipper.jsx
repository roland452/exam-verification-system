import React, { useState, useEffect } from 'react';
import { FiInfo, FiAlertCircle } from 'react-icons/fi';
import { MdHistory } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion'; // Added for animations
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AutoActivityFlipper = () => {
  const [index, setIndex] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true); // Added to prevent undefined errors

  const API_URL = `${BASE_URL}/api/student-notices`;

  async function fetchNotices() {
    try {
      const res = await axios.get(API_URL, { withCredentials: true });
      // Ensure we set the data and stop loading
      if (res.data && res.data.length > 0) {
        setActivities(res.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  // Logic to switch the activity every 4 seconds
  useEffect(() => {
    if (activities.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % activities.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activities.length]);

  // Guard clause: If loading or no activities, show a placeholder
  if (loading || activities.length === 0) {
    return (
      <div className="my-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse">
        <div className="h-4 w-24 bg-slate-100 rounded mb-2"></div>
        <div className="h-8 bg-slate-50 rounded-xl"></div>
      </div>
    );
  }

  const current = activities[index];

  const getStatusColor = (type) => {
    switch (type) {
      case 'urgent': return 'text-red-500 bg-red-50';
      case 'info': return 'text-blue-500 bg-blue-50';
      default: return 'text-green-500 bg-green-50';
    }
  };

  const getRelativeTime = (date) => {
    if (!date) return "just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + (interval === 1 ? " hr ago" : " hrs ago");
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + (interval === 1 ? " min ago" : " mins ago");
    return "just now";
  };

  return (
    <div className='w-full'>
      <div className="my-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MdHistory className="text-green-600" />
            <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Notice Feed</span>
          </div>
          
          {/* Progress Dots */}
          <div className="flex gap-1">
            {activities.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-green-500' : 'w-1 bg-slate-200'}`} 
              />
            ))}
          </div>
        </div>

        {/* Animated Flipper Content */}
        <div className="relative h-12 flex items-center"> 
          <AnimatePresence mode="wait">
            <motion.div 
              key={current._id || index} 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="flex items-center gap-4 w-full"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(current.type)}`}>
                {current.type === 'urgent' ? <FiAlertCircle size={18}/> : <FiInfo size={18}/>}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 truncate">
                  {current.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                      {getRelativeTime(current.createdAt)}
                   </span>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <span className="text-[9px] font-black text-green-600 uppercase">Updates</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AutoActivityFlipper;
