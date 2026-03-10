import { create } from "zustand";


const useLoginContext = create((set) => ({
    loginSection: 'login', 
    matric: '',

    setLoginSection: (section) => set({ loginSection : section }),
    setMatric: (value) => set({ matric: value }),
}));
    


export default useLoginContext;
