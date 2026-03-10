import { create } from "zustand";

const useAuth = create((set) => ({
    auth: true,
    setAuth: ((authValue) => set({ auth: authValue }))
}))

export default useAuth;