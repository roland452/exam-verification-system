import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

const useProfile = create()(
    persist((set) => ({
        profile: [],
        profileLoading: null,
        profileError: false,

        setProfile: ((profileValue) => set({ profile: profileValue })),
        setProfileLoading: ((loadValue) => set({ profileLoading: loadValue })),
        setProfileError: ((errorValue) => set({ profileError: errorValue }))
    }),
    {
        name: 'profile',
        storage: createJSONStorage(() => sessionStorage)
    }
    )
)

export default useProfile