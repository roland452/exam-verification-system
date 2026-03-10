import { create } from "zustand";

const useFaceEnroll = create((set) => ({
    active:false,
    setActive: ((activeValue) => set({ active: activeValue }))
}))

export default useFaceEnroll;