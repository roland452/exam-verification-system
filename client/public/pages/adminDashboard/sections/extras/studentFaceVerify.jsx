import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentFaceVerify = ({ setIsVerifiedProfile, setIsCamOpen, setStep, setMatric, matric }) => {

   

  const videoRef = useRef();
  const [status, setStatus] = useState("Loading AI Models...");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        
         startVideo();
        
      } catch (err) {
        setStatus("Error loading models. Check folder location.");
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    const constraints = {
      video: { facingMode: 'environment' }
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => { videoRef.current.srcObject = stream; })
      .catch(() => setStatus("Camera access denied"));
    setStatus("Position your face and click Register");
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
    setStatus("Scanning... looking for stable frame");

    const runDetection = async () => {
      try {
        const detection = await faceapi.detectSingleFace(
          videoRef.current, 
          
          new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.4 })
        ).withFaceLandmarks().withFaceDescriptor();

        if (!detection) {
          requestAnimationFrame(runDetection);
          return;
        }

        setStatus("Face found");
        const descriptorArray = Array.from(detection.descriptor);
        console.log(descriptorArray);
        const response = await axios.post(`${BASE_URL}/api/admin-exam/face-verification`, { descriptor: descriptorArray, matric }, { withCredentials: true });

        if (response.data.authenticated || response.data.success) {
          setStep('success')
          setIsVerifiedProfile(response.data.profile || [])
        }

        stopVideo()

        setIsCamOpen(false)
        setIsScanning(false);
        console.log(descriptorArray);

        
      } catch (err) {
        requestAnimationFrame(runDetection);
        setStep('failed')
        stopVideo()
        setIsCamOpen(false)
      }
    };

    runDetection();
  };

  const closeCam = () => {
    stopVideo()
    setIsCamOpen(false)
  }



  return (
    <>
      
        <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center bg-[#fffdfddc] dark:bg-[#141313e3] p-8 z-50">
          <FaArrowLeft className='absolute left-5 cursor-pointer h-7 w-7' onClick={() => closeCam()} />

          
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-3 border-[#0aaf0a] mb-6 shadow-2xl">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
          </div>

          <p className="text-gray-500 dark:text-gray-300 mb-6 font-medium text-center max-w-xs">{status}</p>

          <button 
            onClick={handleEnroll}
            disabled={isScanning}
            className={`${isScanning ? 'bg-gray-400' : 'bg-[#0aaf0a]'} text-white px-10 py-3 rounded-xl font-bold transition-all active:scale-95`}
          >
            {isScanning ? "Processing..." : "Grant Me Access"}
          </button>
        </div>
      
    </>
  );
}

export default StudentFaceVerify
