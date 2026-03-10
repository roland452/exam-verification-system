import { create } from "zustand";

const useDashBoardContext = create((set) => ({
    dashBoardSection: 'portal', 
    navActive: false, 
    

    setDashBoardSection: (section) => set({ dashBoardSection : section }),
    setNavActive: (value) => set({ navActive : value }),
   
}));

export default useDashBoardContext;

    