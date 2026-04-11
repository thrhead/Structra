import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type JobStatus = 'completed' | 'pending' | 'delayed';

export interface Job {
  id: string;
  name: string;
  status: JobStatus;
  assignedWorker: string;
  date: string;
}

export interface QueueItem {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

interface AppState {
  isOnline: boolean;
  setOnlineStatus: (status: boolean) => void;
  syncQueue: QueueItem[];
  addToQueue: (action: Omit<QueueItem, 'id' | 'timestamp'>) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
  clearQueue: () => Promise<void>;
  loadQueue: () => Promise<void>;
  isSyncing: boolean;
  setSyncing: (status: boolean) => void;
  jobs: Job[];
}

export const useAppStore = create<AppState>((set, get) => ({
  isOnline: true,
  setOnlineStatus: (status) => set({ isOnline: status }),
  syncQueue: [],
  isSyncing: false,
  setSyncing: (status) => set({ isSyncing: status }),
  jobs: [
    { id: '1', name: 'A-Blok HVAC Montajı', status: 'completed', assignedWorker: 'Ahmet Yılmaz', date: '2024-05-12' },
    { id: '2', name: 'Zemin Kat Elektrik Tesisatı', status: 'pending', assignedWorker: 'Mehmet Demir', date: '2024-05-14' },
    { id: '3', name: 'Çatı Yalıtım Kontrolü', status: 'delayed', assignedWorker: 'Can Kaya', date: '2024-05-10' },
    { id: '4', name: 'B-Blok Su Tesisatı', status: 'completed', assignedWorker: 'Ali Vefa', date: '2024-05-11' },
  ],
  loadQueue: async () => {
    try {
      const stored = await AsyncStorage.getItem('@sync_queue');
      if (stored) {
        set({ syncQueue: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load queue', e);
    }
  },
  addToQueue: async (action) => {
    const newItem: QueueItem = {
      ...action,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    const newQueue = [...get().syncQueue, newItem];
    set({ syncQueue: newQueue });
    await AsyncStorage.setItem('@sync_queue', JSON.stringify(newQueue));
  },
  removeFromQueue: async (id) => {
    const newQueue = get().syncQueue.filter((item) => item.id !== id);
    set({ syncQueue: newQueue });
    await AsyncStorage.setItem('@sync_queue', JSON.stringify(newQueue));
  },
  clearQueue: async () => {
    set({ syncQueue: [] });
    await AsyncStorage.removeItem('@sync_queue');
  },
}));
