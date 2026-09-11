import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Quality = 'auto' | '1080p' | '720p' | '480p';
type Subtitle = 'off' | 'en' | 'hi';

type PlayerState = {
  quality: Quality;
  subtitle: Subtitle;
  autoplay: boolean;
  setQuality: (q: Quality) => void;
  setSubtitle: (s: Subtitle) => void;
  setAutoplay: (a: boolean) => void;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      quality: 'auto',
      subtitle: 'off',
      autoplay: true,
      setQuality: (quality) => set({ quality }),
      setSubtitle: (subtitle) => set({ subtitle }),
      setAutoplay: (autoplay) => set({ autoplay }),
    }),
    { name: 'moviemix-player-settings', getStorage: () => AsyncStorage }
  )
);
