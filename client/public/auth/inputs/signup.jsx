import React, { useState } from 'react'
import axios from 'axios'
import { FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useSignupContext from '../components/signup/signupContext';
import SignupInput from '../components/signup/signup';
import FaceEnroll from '../components/signup/faceEnroll';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = ({authSection, setPopup, submitting, setSubmitting}) => {
    const [confirmPassword, setConfirmPassword] = useState('')
    
    // Matric format: kasu/22/csc/1072  (kasu / year / dept / number)
    const matricRegex = /^kasu\/\d{2}\/[a-z]{3}\/\d{4}$/i;

    const signupActiveSection = useSignupContext((state) => state.signupSection)
    const setSignupActiveSection = useSignupContext((state) => state.setSignupSection)
    const { matric, setMatric, password, setPassword, fingerDescriptor, setFingerDescriptor, faceDescriptor, setFaceDescriptor } = useSignupContext();

    // Sections array for the progress bar
    const sections = ['signup', 'faceEnroll',];
    const currentIndex = sections.indexOf(signupActiveSection);

    async function apiRequest() {
      setSubmitting(true)
      try {
        const res = await axios.post(`${BASE_URL}/api/signup`,
          { matric, password, faceDescriptor },
          { withCredentials: true }
        )
        setPopup(res.data.message)
      } catch (error) {
        setPopup('Signup failed')
      } finally {
        setSubmitting(false)
      }
    }

    const handleNext = () => {
      // Logic for Section 1
      if (signupActiveSection === 'signup') {
        if (!matric || !password) return setPopup('Input cannot be empty')
        if (!matricRegex.test(matric)) return setPopup('Invalid Matric format (KASU/00/XXX/0000)')
        if (password.length < 6) return setPopup('Password must be at least 6 characters')
        setSignupActiveSection('faceEnroll')
      } 
     
      else {
        if (!faceDescriptor) return setPopup('Please enroll your face first')
        apiRequest()
      }
    }

    const handleBack = () => {
      if (signupActiveSection === 'faceEnroll') setSignupActiveSection('signup')
    }

  return (
    <div className={`${authSection === 'signup'? 'flex flex-col gap-6' : 'hidden'} w-full max-w-md mx-auto p-4`}>
      
      {/* --- PROGRESS BAR UI --- */}
      <div className="flex items-center justify-between mb-2 px-2">
        {sections.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-300
              ${index < currentIndex
                ? 'bg-green-900 text-white shadow-md shadow-green-900/30'
                : index === currentIndex
                ? 'bg-green-900 text-white shadow-md shadow-green-900/30 ring-4 ring-green-900/15'
                : 'bg-gray-100 ark:bg-white/5 text-gray-400 ark:text-gray-500'}`}>
              {index + 1}
            </div>
            {index < sections.length - 1 && (
              <div className="flex-1 h-1 mx-2 rounded-full bg-gray-100 ark:bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full bg-green-900 transition-all duration-500 ${index < currentIndex ? 'w-full' : 'w-0'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* --- FORM SECTIONS --- */}
      <div className="">
        {signupActiveSection === 'signup' && (
          <SignupInput 
            matric={matric} 
            setMatric={setMatric} 
            password={password} 
            setPassword={setPassword} 
          />
        )}
        {signupActiveSection === 'faceEnroll' && (
          <faceEnroll 
            fingerDescriptor={fingerDescriptor}
            setFingerDescriptor={setFingerDescriptor} 
          />
        )}
        {signupActiveSection === 'faceEnroll' && (
          <FaceEnroll 
            setFaceDescriptor={setFaceDescriptor} 
          />
        )}
      </div>

      {/* --- NAVIGATION BUTTONS --- */}
      <div className="flex gap-2 mt-0">
        {signupActiveSection !== 'signup' && (
          <button 
            className="flex-1 py-3 px-3 bg-gray-100 ark:bg-white/5 text-gray-700 ark:text-gray-200 rounded-full cursor-pointer font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-gray-200 ark:hover:bg-white/10 active:scale-95"
            onClick={handleBack}
          >
            <FaChevronLeft size={12}/> Back
          </button>
        )}
        
        <button 
          className="flex-[2] py-3 px-6 bg-green-900 rounded-full cursor-pointer text-white shadow-lg shadow-green-900/25 font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-green-900/30 active:scale-95 disabled:opacity-60"
          onClick={handleNext}
          disabled={submitting}
        >
          {submitting ? <FaSpinner className="animate-spin"/> : (
            signupActiveSection === 'faceEnroll' ? 'Signup' : <>Next <FaChevronRight size={12}/></>
          )}
        </button>
      </div>
    </div>
  )
}

export default Signup
