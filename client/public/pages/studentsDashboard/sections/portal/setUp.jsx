import React, { useState } from 'react';
import axios from 'axios';
import { FiUser } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineSchool, MdOutlineClass } from "react-icons/md";
import useToast from '../../../../context/toast';
import useRefresh from '../../../../context/refresh'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Setup = () => {

    const setToast = useToast((state) => state.setToast)
    const setRefresh = useRefresh((state) => state.setRefresh)
    const refresh = useRefresh((state) => state.refresh)

    // 1. State for form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        course: '',
        level: ''
    });

    const [loading, setLoading] = useState(false);

    // 2. Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Submit to Backend
    const handleSaveProfile = async () => {
        if (!formData.fullName || !formData.email || !formData.course || !formData.level) {
            setToast("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/update-profile`, formData, {
                withCredentials: true // Important for sessions
            });
            setToast("Profile Saved Successfully!");
            setRefresh(!refresh)
            console.log(response.data);
        } catch (error) {
            console.error("Save Error:", error);
            setToast(error.response?.data?.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`absolute w-full min-h-screen flex items-center justify-center p-0 font-sans`}>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <img src="../../../../src/assets/Kaduna State University Official_iddJOb3gD__0.png" alt="KASU" className="w-16 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
                    <p className="text-gray-500 text-sm">Enter your academic details</p>
                </div>

                <div className="space-y-5">
                    {/* Full Name */}
                    <div className="relative border-b-2 border-gray-100 py-2 focus-within:border-green-600 transition-colors">
                        <FiUser className="absolute left-0 top-3 text-gray-400" />
                        <input 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full pl-8 pr-4 bg-transparent outline-none text-gray-700 placeholder-gray-400" 
                            placeholder="Full Name" 
                        />
                    </div>

                    {/* Email */}
                    <div className="relative border-b-2 border-gray-100 py-2 focus-within:border-green-600 transition-colors">
                        <HiOutlineMail className="absolute left-0 top-3 text-gray-400" />
                        <input 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-8 pr-4 bg-transparent outline-none text-gray-700 placeholder-gray-400" 
                            placeholder="University Email" 
                        />
                    </div>

                    {/* Course Selection */}
                    <div className="relative border-b-2 border-gray-100 py-2 focus-within:border-green-600 transition-colors flex items-center">
                        <MdOutlineSchool className="text-gray-400 mr-3 text-xl" />
                        <select 
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full bg-transparent outline-none text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Select Course</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="Software Engineering">Software Engineering</option>
                        </select>
                    </div>

                    {/* Level Selection */}
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">Current Level</label>
                        <div className="flex gap-2">
                            {['100', '200', '300', '400'].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setFormData({...formData, level: lvl})}
                                    className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                                        formData.level === lvl 
                                        ? 'bg-green-700 text-white border-green-700 shadow-md scale-105' 
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                                    }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full mt-10 bg-green-800 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all active:scale-95 disabled:bg-gray-400"
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </div>
    );
};

export default Setup;
