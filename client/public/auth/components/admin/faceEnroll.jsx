import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;




const FaceEnroll = ({ faceEnrollActive, setFaceEnrollActive, mode = "signup" }) => {

  const videoRef = useRef();
  const [status, setStatus] = useState("Loading AI Models...");
  const [isScanning, setIsScanning] = useState(false);
  const [authMethod, setAuthMethod] = useState("email"); // "face" | "email"

  // Email/password form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (authMethod !== "face") return;

    const loadModels = async () => {
      try {
        // Models must be in public/models folder
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

        if (faceEnrollActive) {
          startVideo();
        }
      } catch (err) {
        setStatus("Error loading models. Check public/models location.");
      }
    };
    loadModels();
  }, [faceEnrollActive, authMethod]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setStatus("Camera access denied"));
    setStatus(mode === "signup" ? "Position face to Log Admin" : "Position face to Login");
  };


  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => {
        track.stop(); // This physically turns off the camera hardware
      });

      videoRef.current.srcObject = null; // This clears the video element
      setStatus("Camera closed");
    }
  };


  const handleEnroll = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setStatus("Scanning... extracting biometric features");

    const runDetection = async () => {
      try {
        // High inputSize helps avoid detection skips
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.4 })
        ).withFaceLandmarks().withFaceDescriptor();

        
        if (!detection || !detection.detection || !detection.detection.box) {
          requestAnimationFrame(runDetection);
          return;
        }

        // Convert the Float32Array to a standard JS Array for the Backend
        const descriptorArray = Array.from(detection.descriptor);

        // Use the Admin Routes we established
        // (fixed: was previously swapped — "login" was hitting /signup)
        const endpoint = mode === "login" ? `${BASE_URL}/api/admin/login` : `${BASE_URL}/api/admin/signup`;

        const response = await axios.post(`${endpoint}`, {
          username: "admin", // Matches your Admin Schema
          descriptor: descriptorArray
        }, { withCredentials: true });

        setStatus(response.data.message || "Success!");
        setIsScanning(false);
        stopVideo()

        // Redirect or close modal on success
        if (response.data.authenticated || response.data.success) {
            setTimeout(() => {
                setFaceEnrollActive(false);
                window.location.href = "/admin";
            }, 1500);
        } else {
          setTimeout(() => {
              setFaceEnrollActive(false);
              setStatus(response.data.message || "not recognized");
          }, 1500);
        }

      } catch (err) {
        stopVideo()
        // If it's a transient library error, retry detection
        if (err.message && err.message.includes("Box.constructor")) {
            requestAnimationFrame(runDetection);
        } else {
            setStatus(err.response?.data?.message || "Biometric Error");
            setIsScanning(false);
        }

      }
    };

    runDetection();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailSubmitting) return;
    setEmailSubmitting(true);
    setEmailError("");

    try {
      const endpoint = mode === "login"
        ? `${BASE_URL}/api/admin/login-email`
        : `${BASE_URL}/api/admin/signup-email`;

      const response = await axios.post(endpoint, { email, password }, { withCredentials: true });

      if (response.data.authenticated || response.data.success) {
        setTimeout(() => {
          setFaceEnrollActive(false);
          window.location.href = "/admin";
        }, 800);
      }
    } catch (err) {
      setEmailError(err.response?.data?.message || "Something went wrong");
    } finally {
      setEmailSubmitting(false);
    }
  };

  // Stop camera when modal closes
  const handleClose = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setFaceEnrollActive(false);
  };

  const switchMethod = (method) => {
    if (method === "face" && authMethod !== "face") {
      setAuthMethod("face");
    } else if (method === "email" && authMethod !== "email") {
      stopVideo();
      setAuthMethod("email");
    }
  };

  return (
    <>
      {faceEnrollActive && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-zinc-900/95 z-50 backdrop-blur-md p-8">

         <FaArrowLeft
            className='absolute top-6 left-6 cursor-pointer h-5 w-5 text-zinc-700 dark:text-white hover:scale-110 transition-transform'
            onClick={handleClose}
         />

          {/* <h2 className="text-3 font-black capitalize text-zinc-800 dark:text-white mb-2">
            Admin {mode}
          </h2> */}

          {/* ── Auth method toggle ─────────────────────────────────────── */}
          <div className="flex gap-1 mb-8 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full">
            <button
              onClick={() => switchMethod("face")}
              className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
                ${authMethod === "face" ? 'bg-green-400 text-white shadow' : 'text-zinc-500'}`}
            >
              Face
            </button>
            <button
              onClick={() => switchMethod("email")}
              className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
                ${authMethod === "email" ? 'bg-green-400 text-white shadow' : 'text-zinc-500'}`}
            >
              Email
            </button>
          </div>

          {authMethod === "face" ? (
            <>
              <div className="relative mb-8">
                {/* Visual Scan Ring */}
                <div className={`absolute -inset-4 border-2 border-dashed rounded-full ${isScanning ? 'border-green-500 animate-spin-slow' : 'border-zinc-300 opacity-20'}`}></div>

                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-green-400 shadow-[0_0_40px_rgba(10,175,10,0.2)]">
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
                  {isScanning && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_#0aaf0a] animate-scan"></div>
                  )}
                </div>
              </div>

              <p className={`text-sm font-bold text-center mb-8 max-w-xs ${status.includes('Error') || status.includes('failed') ? 'text-red-500' : 'text-zinc-500'}`}>
                {status}
              </p>

              <button
                onClick={handleEnroll}
                disabled={isScanning}
                className={`w-full max-w-xs py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl
                    ${isScanning ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-green-400 text-white hover:bg-zinc-900 active:scale-95'}
                `}
              >
                {isScanning ? "Processing..." : `Confirm ${mode}`}
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailSubmit} className="w-full max-w-xs flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-white outline-none focus:border-green-400"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-white outline-none focus:border-green-400"
              />

              {emailError && (
                <p className="text-xs font-bold text-red-500 text-center">{emailError}</p>
              )}

              <button
                type="submit"
                disabled={emailSubmitting}
                className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl mt-2
                    ${emailSubmitting ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-green-400 text-white hover:bg-zinc-900 active:scale-95'}
                `}
              >
                {emailSubmitting ? "Processing..." : `Confirm ${mode}`}
              </button>
            </form>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { position: absolute; animation: scan 2s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </>
  );
};

export default FaceEnroll;
