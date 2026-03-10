import React, { useState } from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { FaFingerprint, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import useToast from '../../../context/toast';
import axios from 'axios';

const FingerEnroll = ({ fingerDescriptor, setFingerDescriptor }) => {
  const setToast = useToast((state) => state.setToast);
  const [loading, setLoading] = useState(false);

  
const handleEnroll = async () => {
  setLoading(true);
  try {
      const { data } = await axios.get('/api/signup/enroll-biometric-options', { withCredentials: true });
      
      // Library handles all Base64URL-to-binary conversions
      const registrationResult = await startRegistration({ optionsJSON: data });

      setFingerDescriptor(registrationResult);
  } catch (error) {
      console.error("Enrollment failed:", error);
  } finally {
      setLoading(false);
  }
};



  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all 
        ${fingerDescriptor ? 'border-green-500 bg-green-50' : 'border-dashed border-green-900'}`}>
        {fingerDescriptor ? (
          <FaCheckCircle className="text-green-500 text-4xl" />
        ) : (
          <FaFingerprint className="text-green-900 text-4xl" />
        )}
      </div>
      <button 
        type="button"
        onClick={handleEnroll}
        disabled={loading || fingerDescriptor}
        className="bg-green-900 text-white px-8 py-2 rounded-full shadow-lg active:scale-95 disabled:bg-gray-400 flex items-center gap-2"
      >
        {loading ? <FaSpinner className="animate-spin" /> : null}
        {fingerDescriptor ? "Fingerprint Secured" : "Enroll Fingerprint"}
      </button>
    </div>
  );
};

export default FingerEnroll;
