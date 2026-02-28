import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
    name: string;
    instagram: string;
    telegram: string;
    phone: string;
    setProfile: (profile: Partial<Omit<ProfileState, 'setProfile'>>) => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            name: 'Il Tuo Nome',
            instagram: '',
            telegram: '',
            phone: '',
            setProfile: (profile) => set((state) => ({ ...state, ...profile })),
        }),
        {
            name: 'sharing-simulator-profile',
        }
    )
);
