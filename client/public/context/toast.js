import { create } from "zustand";

const useToast = create((set) => ({
    toast:'',
    setToast: ((toastValue) => set({ toast: toastValue }))
}))

export default useToast;