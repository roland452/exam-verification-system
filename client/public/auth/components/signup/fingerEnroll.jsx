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

      const registrationResult = await startRegistration({ optionsJSON: data });

      setFingerDescriptor(registrationResult);
    } catch (error) {
      console.error("Enrollment failed:", error);
      setToast('Fingerprint enrollment failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all
        ${fingerDescriptor
          ? 'border-green-500 bg-green-50 ark:bg-emerald-400/10 ark:border-emerald-400'
          : 'border-dashed border-green-900/30 ark:border-emerald-400/30'}`}>
        {fingerDescriptor ? (
          <FaCheckCircle className="text-green-500 ark:text-emerald-400 text-4xl" />
        ) : (
          <FaFingerprint className="text-green-900 ark:text-emerald-400 text-4xl" />
        )}
      </div>
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading || fingerDescriptor}
        className="bg-green-900 text-white px-8 py-3 rounded-full font-semibold
                   shadow-lg shadow-green-900/25 hover:shadow-xl hover:shadow-green-900/30
                   transition-all active:scale-95 disabled:opacity-60 disabled:shadow-none
                   flex items-center gap-2"
      >
        {loading ? <FaSpinner className="animate-spin" /> : null}
        {fingerDescriptor ? "Fingerprint Secured" : "Enroll Fingerprint"}
      </button>
    </div>
  );
};

export default FingerEnroll;
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

      const registrationResult = await startRegistration({ optionsJSON: data });

      setFingerDescriptor(registrationResult);
    } catch (error) {
      console.error("Enrollment failed:", error);
      setToast('Fingerprint enrollment failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all
        ${fingerDescriptor
          ? 'border-green-500 bg-green-50 ark:bg-emerald-400/10 ark:border-emerald-400'
          : 'border-dashed border-green-900/30 ark:border-emerald-400/30'}`}>
        {fingerDescriptor ? (
          <FaCheckCircle className="text-green-500 ark:text-emerald-400 text-4xl" />
        ) : (
          <FaFingerprint className="text-green-900 ark:text-emerald-400 text-4xl" />
        )}
      </div>
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading || fingerDescriptor}
        className="bg-green-900 text-white px-8 py-3 rounded-full font-semibold
                   shadow-lg shadow-green-900/25 hover:shadow-xl hover:shadow-green-900/30
                   transition-all active:scale-95 disabled:opacity-60 disabled:shadow-none
                   flex items-center gap-2"
      >
        {loading ? <FaSpinner className="animate-spin" /> : null}
        {fingerDescriptor ? "Fingerprint Secured" : "Enroll Fingerprint"}
      </button>
    </div>
  );
};

export default FingerEnroll;
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

      const registrationResult = await startRegistration({ optionsJSON: data });

      setFingerDescriptor(registrationResult);
    } catch (error) {
      console.error("Enrollment failed:", error);
      setToast('Fingerprint enrollment failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all
        ${fingerDescriptor
          ? 'border-green-500 bg-green-50 ark:bg-emerald-400/10 ark:border-emerald-400'
          : 'border-dashed border-green-900/30 ark:border-emerald-400/30'}`}>
        {fingerDescriptor ? (
          <FaCheckCircle className="text-green-500 ark:text-emerald-400 text-4xl" />
        ) : (
          <FaFingerprint className="text-green-900 ark:text-emerald-400 text-4xl" />
        )}
      </div>
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading || fingerDescriptor}
        className="bg-green-900 text-white px-8 py-3 rounded-full font-semibold
                   shadow-lg shadow-green-900/25 hover:shadow-xl hover:shadow-green-900/30
                   transition-all active:scale-95 disabled:opacity-60 disabled:shadow-none
                   flex items-center gap-2"
      >
        {loading ? <FaSpinner className="animate-spin" /> : null}
        {fingerDescriptor ? "Fingerprint Secured" : "Enroll Fingerprint"}
      </button>
    </div>
  );
};

export default FingerEnroll;
