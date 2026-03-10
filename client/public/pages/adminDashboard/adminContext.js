import { create } from "zustand";

const useAdminContext = create((set) => ({
    adminSection: 'course', 
    navActive: false, 
    

    setAdminSection: (section) => set({ adminSection : section }),
    setNavActive: (value) => set({ navActive : value }),
   
}));

export default useAdminContext;

    