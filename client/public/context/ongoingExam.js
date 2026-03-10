import { create } from "zustand";

const useOngoingExam = create((set) => ({
    exam: {},
    setExam: ((examValue) => set({ exam: examValue }))
}))

export default useOngoingExam;