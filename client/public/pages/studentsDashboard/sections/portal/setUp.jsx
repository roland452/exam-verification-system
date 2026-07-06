import React, { useState } from 'react';
import axios from 'axios';
import { FiUser } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineSchool, MdOutlineClass } from "react-icons/md";
import useToast from '../../../../context/toast';
import useRefresh from '../../../../context/refresh'
import KasuIcon from '../../../../../src/assets/kasu_icon.png'
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
        <div className="absolute w-full min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#0F2B1D' }}>
            <div
                className="w-full max-w-md rounded-[1.75rem] shadow-2xl overflow-hidden p-9 relative"
                style={{ background: '#FBF8F2' }}
            >
                {/* Corner seal accent */}
                <div
                    className="absolute top-0 right-0 w-24 h-24 opacity-[0.06] pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at top right, #A9822F 0%, transparent 70%)'
                    }}
                />

                {/* Header */}
                <div className="text-center mb-7">
                    <img src={KasuIcon} alt="KASU" className="w-14 mx-auto mb-4" />
                    <h2
                        className="text-[1.65rem] leading-tight font-semibold"
                        style={{ color: '#1C1712', fontFamily: 'Georgia, "Source Serif 4", serif' }}
                    >
                       profile
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-3 mb-1">
                        <span className="h-px w-8" style={{ background: '#A9822F' }} />
                        <span className="h-1 w-1 rounded-full" style={{ background: '#A9822F' }} />
                        <span className="h-px w-8" style={{ background: '#A9822F' }} />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2 block"
                            style={{ color: '#8A8175' }}
                        >
                            Full Name
                        </label>
                        <div
                            className="relative flex items-center border-b-2 py-2.5 transition-colors"
                            style={{ borderColor: '#E4DCC9' }}
                        >
                            <FiUser className="mr-3 shrink-0" style={{ color: '#A9822F' }} />
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none text-[15px]"
                                style={{ color: '#1C1712' }}
                                placeholder="e.g. Amina Yusuf"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2 block"
                            style={{ color: '#8A8175' }}
                        >
                            University Email
                        </label>
                        <div
                            className="relative flex items-center border-b-2 py-2.5 transition-colors"
                            style={{ borderColor: '#E4DCC9' }}
                        >
                            <HiOutlineMail className="mr-3 shrink-0" style={{ color: '#A9822F' }} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none text-[15px]"
                                style={{ color: '#1C1712' }}
                                placeholder="you@kasu.edu.ng"
                            />
                        </div>
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2 block"
                            style={{ color: '#8A8175' }}
                        >
                            Course of Study
                        </label>
                        <div
                            className="relative flex items-center border-b-2 py-2.5 transition-colors"
                            style={{ borderColor: '#E4DCC9' }}
                        >
                            <MdOutlineSchool className="mr-3 shrink-0 text-lg" style={{ color: '#A9822F' }} />
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none text-[15px] appearance-none cursor-pointer"
                                style={{ color: formData.course ? '#1C1712' : '#8A8175' }}
                            >
                                <option value="">Select course</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="Software Engineering">Software Engineering</option>
                            </select>
                        </div>
                    </div>

                    {/* Level Selection */}
                    <div>
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3 block"
                            style={{ color: '#8A8175' }}
                        >
                            Current Level
                        </label>
                        <div className="flex gap-2">
                            {['100', '200', '300', '400'].map((lvl) => {
                                const active = formData.level === lvl;
                                return (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, level: lvl })}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border"
                                        style={
                                            active
                                                ? { background: '#123524', color: '#F3E9CF', borderColor: '#123524' }
                                                : { background: 'transparent', color: '#8A8175', borderColor: '#E4DCC9' }
                                        }
                                    >
                                        {lvl}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full mt-10 py-4 rounded-2xl font-bold text-[13px] uppercase tracking-[0.14em] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{ background: '#123524', color: '#F3E9CF' }}
                >
                    {loading ? "Saving…" : "Save Profile"}
                </button>
            </div>
        </div>
    );
};

export default Setup;
