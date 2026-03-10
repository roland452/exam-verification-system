import { create } from "zustand";

const useSignupContext = create((set) => ({
    signupSection: 'signup', 
    matric: '',
    password: '',
    fingerDescriptor: '',
    faceDescriptor: '', // Fixed: was faceDescription

    setSignupSection: (section) => set({ signupSection : section }),
    setMatric: (value) => set({ matric: value }),
    setPassword: (value) => set({ password: value }),
    setFingerDescriptor: (value) => set({ fingerDescriptor: value }),
    setFaceDescriptor: (value) => set({ faceDescriptor: value }), // Matches state
}));

export default useSignupContext;
